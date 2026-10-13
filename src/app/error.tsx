"use client";

import { BrandMark } from "@/components/sites/nokto/chrome/BrandMark";
import { ButtonLink, Heading, Section, Stack, Text, buttonClass } from "@/components/sites/nokto/ui";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <Section as="main" minH="dvh" tone="background">
      <Stack justify="between" fullHeight>
        <BrandMark />
        <Stack gap={6}>
          <Heading as="h1" level="h1">
            Trang chưa tải được.
          </Heading>
          <Text variant="editorial" leading="snug" tone="muted" measure="comfort">
            Vui lòng thử lại hoặc quay về trang chủ The Hot.
          </Text>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:gap-6">
            <button type="button" onClick={() => retry()} className={buttonClass("primary")}>
              Thử lại
            </button>
            <ButtonLink href="/" variant="ghost">
              Về trang chủ
            </ButtonLink>
          </div>
        </Stack>
        <span aria-hidden />
      </Stack>
    </Section>
  );
}
