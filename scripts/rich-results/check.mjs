import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";

const TEST_PAGE = "https://search.google.com/test/rich-results";
const RESULT_PAGE = "https://search.google.com/test/rich-results/result";
const LOGIN_PAGE = "https://accounts.google.com/";
const DEFAULT_URL = "https://thehot.vn/";
const TIME_ZONE = "Asia/Ho_Chi_Minh";
const TIME_ZONE_OFFSET = "+07:00";
const TEST_TIMEOUT_MS = 180_000;
const PAGE_TIMEOUT_MS = 60_000;
const GROUP_NAMES = new Map([
  [1, "Events"],
  [4, "Local businesses"],
  [54, "Organization"],
]);
const NON_CRITICAL_SEVERITY = 1;
const CRITICAL_SEVERITY = 2;
const RESOURCE_LOADED = 2;
const RESOURCE_BLOCKED_BY_ROBOTS = 5;
const SUMMARY_TEXT = /\d+ (valid|invalid) items? detected|No items detected|not eligible/i;
const REFUSAL_TEXT = /Something went wrong|Log in and try again/i;
const ISSUE_LINE = /^(Missing field|Invalid|Either|Incorrect|Unparsable|Duplicate)\b.*"[^"]+"/;
const ICON_WORDS = new Set(["check_circle", "error", "warning", "cancel", "info"]);
const SOURCES = ["auto", "data", "ui"];
const USAGE = `usage: node scripts/rich-results/check.mjs [url ...] [--id <result-id> ...] [--source auto|data|ui]
       node scripts/rich-results/check.mjs --login

  url           run a new Rich Results Test (default: ${DEFAULT_URL})
  --id          read an existing result (the id in a Share link) instead of running a test
  --source      auto: read the page data, fall back to the UI (default)
                data: page data only · ui: UI only
  --login       open Google sign-in in the script's Chrome profile; close the window when done

env: RRT_PROFILE  Chrome profile signed in to Google (default: ~/.local/share/thehot-rrt/chrome-profile)
     RRT_HEADLESS=1  run Chrome without a window (Google usually refuses this)

exit: 0 no invalid item · 1 an item has a critical issue · 2 no result (refused, timeout, format changed, bad usage)`;

class UsageError extends Error {}
class FormatError extends Error {}
class MissingResultError extends Error {}

function parseArgs(argv) {
  const options = { urls: [], ids: [], source: "auto", help: false, login: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--login") options.login = true;
    else if (arg === "--id") options.ids.push(valueAfter(argv, (index += 1), arg));
    else if (arg === "--source") options.source = valueAfter(argv, (index += 1), arg);
    else if (arg.startsWith("-")) throw new UsageError(`unknown option ${arg}`);
    else options.urls.push(arg);
  }
  if (!SOURCES.includes(options.source)) throw new UsageError(`--source must be one of ${SOURCES.join(", ")}`);
  if (options.urls.length === 0 && options.ids.length === 0) options.urls.push(DEFAULT_URL);
  return options;
}

function valueAfter(argv, index, flag) {
  const value = argv[index];
  if (value === undefined || value.startsWith("-")) throw new UsageError(`${flag} needs a value`);
  return value;
}

function createBrowser() {
  let launched;
  return {
    async page() {
      launched ??= chromium.launchPersistentContext(process.env.RRT_PROFILE ?? join(homedir(), ".local/share/thehot-rrt/chrome-profile"), {
        channel: "chrome",
        headless: process.env.RRT_HEADLESS === "1",
        locale: "en-US",
        viewport: { width: 1280, height: 1000 },
        ignoreDefaultArgs: ["--password-store=basic", "--use-mock-keychain"],
        args: ["--password-store=gnome-libsecret"],
      });
      const context = await launched;
      return context.pages()[0] ?? context.newPage();
    },
    async close() {
      if (launched) await (await launched).close();
    },
  };
}

function resultUrl(id) {
  return `${RESULT_PAGE}?id=${encodeURIComponent(id)}`;
}

function linesOf(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !ICON_WORDS.has(line) && !/^[-]$/.test(line));
}

async function refusalShown(page) {
  const dialog = page.locator("[data-inject-content-controller]").filter({ hasText: REFUSAL_TEXT }).first();
  if (!(await dialog.isVisible().catch(() => false))) return null;
  return (await dialog.innerText()).replace(/\s+/g, " ").replace(/ Dismiss$/i, "").trim();
}

function resultIdIn(address) {
  const url = new URL(address);
  return url.pathname === "/test/rich-results/result" ? url.searchParams.get("id") : null;
}

async function runTest(page, url) {
  await page.goto(`${TEST_PAGE}?url=${encodeURIComponent(url)}`, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT_MS });
  const deadline = Date.now() + TEST_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const id = resultIdIn(page.url());
    if (id && (await page.getByText(SUMMARY_TEXT).first().isVisible().catch(() => false))) return id;
    const refusal = await refusalShown(page);
    if (refusal) throw new Error(`Rich Results Test refused: ${refusal}`);
    await page.waitForTimeout(1000);
  }
  throw new Error(`no result after ${TEST_TIMEOUT_MS / 1000}s`);
}

async function fetchResultHtml(id) {
  const response = await fetch(resultUrl(id), { headers: { "accept-language": "en-US" } });
  if (!response.ok) throw new FormatError(`result page returned HTTP ${response.status}`);
  return response.text();
}

function readBlocks(html) {
  const blocks = new Map();
  const pattern = /AF_initDataCallback\(\{key: '(ds:\d+)', hash: '\d+', data:([\s\S]*?), sideChannel: \{\}\}\);<\/script>/g;
  for (const [, key, data] of html.matchAll(pattern)) {
    try {
      blocks.set(key, JSON.parse(data));
    } catch {
      throw new FormatError(`${key} is not JSON`);
    }
  }
  return blocks;
}

function readRuleNames(html) {
  const start = html.indexOf('["UNKNOWN_RULETYPE",0]');
  if (start === -1) return new Map();
  const list = html.slice(start, html.indexOf("]]]", start));
  return new Map([...list.matchAll(/\["([A-Z0-9_]+)",(\d+)\]/g)].map(([, name, code]) => [Number(code), name]));
}

function expectFormat(condition, message) {
  if (!condition) throw new FormatError(`page data format changed: ${message}`);
}

function issueFromData(raw, ruleNames) {
  expectFormat(Array.isArray(raw) && Array.isArray(raw[6]) && Array.isArray(raw[6][2]), "issue entry");
  const [ruleCode, , field, parents] = raw[6];
  const severityCode = raw[2];
  const issue = {
    field: [...(Array.isArray(parents) ? parents : []), ...field].join("."),
    rule: ruleNames.get(ruleCode) ?? `rule ${ruleCode}`,
    severity: severityCode === NON_CRITICAL_SEVERITY ? "non-critical" : "critical",
  };
  return [NON_CRITICAL_SEVERITY, CRITICAL_SEVERITY].includes(severityCode) ? issue : { ...issue, severityCode };
}

function countCritical(issues) {
  return issues.filter((issue) => issue.severity === "critical").length;
}

function itemFromData(raw, ruleNames) {
  expectFormat(Array.isArray(raw) && typeof raw[0] === "string" && Array.isArray(raw[1]), "item entry");
  const issues = raw[1].filter((entry) => Array.isArray(entry) && entry[0]).map((entry) => issueFromData(entry[0], ruleNames));
  const critical = countCritical(issues);
  expectFormat(
    critical === raw[2] && issues.length - critical === raw[3],
    `item "${raw[0]}" lists ${raw[2]} critical and ${raw[3]} non-critical issues but ${critical} and ${issues.length - critical} were read`,
  );
  return { name: raw[0], valid: critical === 0, issues };
}

function formatCrawlTime(milliseconds) {
  const local = new Intl.DateTimeFormat("sv-SE", { timeZone: TIME_ZONE, dateStyle: "short", timeStyle: "medium" }).format(new Date(milliseconds));
  return `${local.replace(" ", "T")}${TIME_ZONE_OFFSET}`;
}

function reportFromData(html) {
  const blocks = readBlocks(html);
  const head = blocks.get("ds:0");
  if (Array.isArray(head) && head[2] === undefined) throw new MissingResultError(`no result for id ${head[0]} (status ${head[1]}); the id is wrong or expired`);
  const tested = head?.[2];
  const structured = blocks.get("ds:4");
  expectFormat(Array.isArray(tested) && typeof tested[0] === "string" && typeof tested[1] === "number", "ds:0 tested URL");
  expectFormat(Array.isArray(structured) && Array.isArray(structured[1]), "ds:4 groups");
  const ruleNames = readRuleNames(html);
  const groups = structured[1].map((group) => {
    expectFormat(Array.isArray(group) && typeof group[0] === "number" && Array.isArray(group[1]), "group entry");
    return { type: GROUP_NAMES.get(group[0]) ?? `type ${group[0]}`, items: group[1].map((item) => itemFromData(item, ruleNames)) };
  });
  const status = blocks.get("ds:3")?.[3]?.[1];
  const resources = blocks.get("ds:5")?.[0];
  return {
    url: tested[0],
    crawledAt: formatCrawlTime(tested[1]),
    httpStatus: typeof status === "number" ? status : null,
    groups,
    blockedResources: Array.isArray(resources)
      ? resources
          .filter((resource) => resource[3] !== RESOURCE_LOADED)
          .map((resource) => ({ url: resource[0], reason: resource[3] === RESOURCE_BLOCKED_BY_ROBOTS ? "robots.txt" : `code ${resource[3]}` }))
      : null,
  };
}

function issueFromUi(line, parent) {
  const optional = / \(optional\)$/.test(line);
  const message = line.replace(/ \(optional\)$/, "");
  const field = message.match(/"([^"]+)"/)?.[1] ?? null;
  return { field: parent && field ? `${parent}.${field}` : field, message, severity: optional ? "non-critical" : "critical" };
}

function issuesInPanel(panel) {
  const issues = [];
  panel.forEach((line, index) => {
    if (!ISSUE_LINE.test(line)) return;
    let anchor = index - 1;
    while (anchor >= 0 && ISSUE_LINE.test(panel[anchor])) anchor -= 1;
    issues.push(issueFromUi(line, anchor >= 0 ? panel[anchor] : null));
  });
  return issues;
}

function issueCountsIn(status) {
  if (!/\d+ (?:non-)?critical issues?/.test(status)) return null;
  const count = (pattern) => Number(status.match(pattern)?.[1] ?? 0);
  return { critical: count(/(\d+) critical issues?/), nonCritical: count(/(\d+) non-critical issues?/) };
}

async function expandedPanel(page, row, status) {
  const deadline = Date.now() + 15_000;
  for (;;) {
    if ((await row.getAttribute("aria-expanded")) === "true") {
      const panel = linesOf(await row.evaluate((element) => element.parentElement.innerText));
      const start = panel.indexOf(status) + 1;
      if (start > 0 && panel.includes("type") && !panel.includes("Loading…")) return panel.slice(start);
    }
    if (Date.now() > deadline) throw new Error(`item details did not load after "${status}"`);
    await page.waitForTimeout(250);
  }
}

async function itemFromUi(page, row, [name, ...status]) {
  if ((await row.getAttribute("aria-expanded")) !== "true") await row.click();
  const issues = issuesInPanel(await expandedPanel(page, row, status.at(-1)));
  const critical = countCritical(issues);
  const shown = issueCountsIn(status.join("\n"));
  if (shown && (shown.critical !== critical || shown.nonCritical !== issues.length - critical)) {
    throw new Error(`"${name}" shows ${shown.critical} critical and ${shown.nonCritical} non-critical issues but ${critical} and ${issues.length - critical} were read`);
  }
  return { name, valid: critical === 0, issues };
}

async function itemsFromUi(page) {
  const rows = await page.locator('div[role="button"][aria-expanded]').filter({ visible: true }).filter({ hasNotText: /Crawl/ }).elementHandles();
  const items = [];
  for (const row of rows) {
    const lines = linesOf(await row.innerText()).filter((line) => line !== "Loading…");
    if (lines.length >= 2) items.push(await itemFromUi(page, row, lines));
  }
  return items;
}

async function reportFromUi(page, id) {
  await page.goto(resultUrl(id), { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT_MS });
  await page.getByText(SUMMARY_TEXT).first().waitFor({ timeout: PAGE_TIMEOUT_MS });
  const url = await page.locator('input[type="url"]').first().inputValue().catch(() => null);
  const links = await page.locator('a[href*="rich-results/result/r%2F"]').evaluateAll((anchors) => anchors.map((anchor) => ({ href: anchor.href, text: anchor.innerText })));
  const groups = [];
  for (const link of links) {
    const lines = linesOf(link.text);
    const countLine = lines.findIndex((line) => /items? detected/.test(line));
    await page.goto(link.href, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT_MS });
    await page.getByText("Detected items").first().waitFor({ timeout: PAGE_TIMEOUT_MS });
    groups.push({ type: lines[countLine - 1] ?? lines[0] ?? "unknown", items: await itemsFromUi(page) });
  }
  return { url, crawledAt: null, httpStatus: null, groups, blockedResources: null };
}

async function readResult(id, source, browser) {
  let dataError = null;
  if (source !== "ui") {
    try {
      return { source: "data", report: reportFromData(await fetchResultHtml(id)) };
    } catch (error) {
      if (source === "data" || error instanceof MissingResultError) throw error;
      dataError = error;
      console.error(`warning: ${error.message}; reading the UI instead`);
    }
  }
  try {
    return { source: "ui", report: await reportFromUi(await browser.page(), id), fallbackReason: dataError?.message };
  } catch (error) {
    throw dataError ? new Error(`page data: ${dataError.message}; UI: ${error.message}`) : error;
  }
}

function summarize(groups) {
  const items = groups.flatMap((group) => group.items);
  const invalid = items.filter((item) => !item.valid).length;
  return { items: items.length, valid: items.length - invalid, invalid };
}

async function inspect(target, source, browser) {
  const started = Date.now();
  const seconds = () => Math.round((Date.now() - started) / 1000);
  try {
    let id = target.id;
    if (!id) {
      console.error(`${target.url}: running Rich Results Test`);
      id = await runTest(await browser.page(), target.url);
    }
    console.error(`${target.url ?? id}: reading result ${id}`);
    const { source: usedSource, report, fallbackReason } = await readResult(id, source, browser);
    return {
      url: report.url ?? target.url ?? null,
      ok: true,
      source: usedSource,
      resultUrl: resultUrl(id),
      crawledAt: report.crawledAt,
      httpStatus: report.httpStatus,
      summary: summarize(report.groups),
      groups: report.groups,
      blockedResources: report.blockedResources,
      seconds: seconds(),
      ...(fallbackReason ? { fallbackReason } : {}),
    };
  } catch (error) {
    return { url: target.url ?? null, ok: false, resultUrl: target.id ? resultUrl(target.id) : null, error: error.message.split("\n")[0], seconds: seconds() };
  }
}

async function login(browser) {
  const page = await browser.page();
  const closed = new Promise((resolve) => page.context().once("close", resolve));
  await page.goto(LOGIN_PAGE, { waitUntil: "domcontentloaded", timeout: PAGE_TIMEOUT_MS });
  console.error("Sign in to Google in the Chrome window, then close the window.");
  await closed;
  return 0;
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`${error.message}\n\n${USAGE}`);
    return 2;
  }
  if (options.help) {
    console.log(USAGE);
    return 0;
  }
  if (options.login) return login(createBrowser());
  const targets = [...options.urls.map((url) => ({ url })), ...options.ids.map((id) => ({ id }))];
  const browser = createBrowser();
  const reports = [];
  try {
    for (const target of targets) reports.push(await inspect(target, options.source, browser));
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify(reports, null, 2));
  if (reports.some((report) => !report.ok)) return 2;
  return reports.some((report) => report.summary.invalid > 0) ? 1 : 0;
}

process.exitCode = await main();
