import { FixedPhoto } from "../chrome/FixedPhoto";
import { SiteFooter } from "../chrome/SiteFooter";
import { siteImage } from "../site";
import { ButtonLink, Heading, Section, Stack, Text } from "../ui";
import type { LegalDocument, LegalSection } from "./content";

function LegalHeader({ content }: { content: LegalDocument }) {
  return (
    <div className="border-b border-border-subtle">
      <Stack gap={6} className="pb-10">
        <div className="flex items-baseline justify-between gap-6">
          <Text variant="label" tone="muted">
            {content.eyebrow}
          </Text>
          <Text as="span" variant="small" tone="subtle" serif italic>
            Last updated: {content.updated}
          </Text>
        </div>
        <Heading as="h1" level="h1" weight="light">
          {content.title}
        </Heading>
        <Text variant="editorial" leading="snug" tone="faded" serif italic>
          {content.intro}
        </Text>
      </Stack>
    </div>
  );
}

function LegalSectionItem({ number, section }: { number: string; section: LegalSection }) {
  return (
    <li className="border-b border-border-subtle">
      <Stack gap={4} className="py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-[3rem_1fr] lg:gap-x-10">
          <Text as="span" variant="label" tone="accent">
            {number}
          </Text>
          <Stack gap={3}>
            <Heading as="h2" level="h3" weight="light">
              {section.title}
            </Heading>
            <Text tone="soft">{section.body}</Text>
          </Stack>
        </div>
      </Stack>
    </li>
  );
}

/** Shared layout for the terms and privacy pages: numbered sections over a pinned photograph. */
export function LegalPage({ content }: { content: LegalDocument }) {
  return (
    <main id="main-content" className="relative w-full">
      <FixedPhoto src={siteImage(content.image.file)} alt={content.image.alt} />
      <div className="relative z-10 lg:w-1/2">
        <Section as="div" padY="none">
          <Stack gap={4} className="pt-28 pb-24 sm:pt-32 sm:pb-28 md:pt-36 md:pb-32 lg:pt-40">
            <article className="flex max-w-[68ch] flex-col">
              <Stack gap={10}>
                <LegalHeader content={content} />
                <ol className="flex flex-col">
                  {content.sections.map((section, index) => (
                    <LegalSectionItem
                      key={section.title}
                      number={String(index + 1).padStart(2, "0")}
                      section={section}
                    />
                  ))}
                </ol>
                <div className="pt-6">
                  <ButtonLink href="/" variant="ghost">
                    ← Return home
                  </ButtonLink>
                </div>
              </Stack>
            </article>
          </Stack>
        </Section>
      </div>
      <SiteFooter />
    </main>
  );
}
