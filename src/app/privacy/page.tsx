import type { Metadata } from "next";
import { LegalPage } from "@/components/sites/nokto/legal/LegalPage";
import { privacy } from "@/components/sites/nokto/legal/content";
import { pageMetadata } from "@/seo/page-meta";

export const metadata: Metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return <LegalPage content={privacy} />;
}
