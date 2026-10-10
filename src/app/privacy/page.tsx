import type { Metadata } from "next";
import { LegalPage } from "@/components/sites/nokto/legal/LegalPage";
import { legalMetadata, privacy } from "@/components/sites/nokto/legal/content";

export const metadata: Metadata = legalMetadata(privacy);

export default function PrivacyPage() {
  return <LegalPage content={privacy} />;
}
