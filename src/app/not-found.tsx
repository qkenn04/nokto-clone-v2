import { BrandMark } from "@/components/sites/nokto/chrome/BrandMark";
import { site } from "@/components/sites/nokto/site";
import { ButtonLink, Heading, Section, Stack, Text } from "@/components/sites/nokto/ui";

export default function NotFound() {
  return (
    <Section as="main" minH="dvh" tone="background">
      <Stack justify="between" fullHeight>
        <BrandMark />
        <Stack gap={6}>
          <Heading as="h1" level="h1">
            Không tìm thấy trang này.
          </Heading>
          <Text variant="editorial" tone="muted">
            Hẹn bạn ở The Hot.
          </Text>
          <div className="pt-4">
            <ButtonLink href={site.cta.href}>{site.cta.label}</ButtonLink>
          </div>
        </Stack>
        <span aria-hidden />
      </Stack>
    </Section>
  );
}
