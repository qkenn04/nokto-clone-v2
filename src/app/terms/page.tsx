import type { Metadata } from "next";
import { LegalPage } from "@/components/sites/nokto/legal/LegalPage";
import { legalMetadata, terms } from "@/components/sites/nokto/legal/content";

export const metadata: Metadata = legalMetadata(terms);

export default function TermsPage() {
  return <LegalPage content={terms} />;
}
