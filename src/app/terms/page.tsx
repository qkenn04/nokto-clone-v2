import type { Metadata } from "next";
import { LegalPage } from "@/components/sites/nokto/legal/LegalPage";
import { terms } from "@/components/sites/nokto/legal/content";
import { pageMetadata } from "@/seo/page-meta";

export const metadata: Metadata = pageMetadata("/terms");

export default function TermsPage() {
  return <LegalPage content={terms} />;
}
