import Link from "next/link";
import { trackAttrs } from "@/lib/analytics";
import { site } from "../../nokto/site";
import { Heading, Section, Stack, Text } from "../../nokto/ui";
import styles from "./HomeContent.module.css";

const inlineLink =
  "text-accent underline decoration-1 underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

export function HomeIntro() {
  return (
    <Section id="gioi-thieu" padY="lg-tight" tone="background" relative isolate className={styles.contentSection} aria-labelledby="home-intro-title">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
        <header className={styles.sectionHeader}>
          <div className={styles.headerCopy}>
            <Text variant="label" tone="accent" className={styles.sectionLabel}>{site.label}</Text>
            <Heading as="h2" level="h1" id="home-intro-title" className={styles.sectionTitle}>
              Quán nhậu ngoài trời cho hội bạn <span className={styles.titleSticker}>ở Đà Lạt.</span>
            </Heading>
          </div>
        </header>
        <Stack gap={5}>
          <Text tone="muted" measure="wide">
            {site.name} là quán nhậu ngoài trời ở {site.address.display}, mở cửa từ {site.hours.opens}. Tan làm hay cuối tuần, cứ kéo hội bạn qua: chọn một góc ngoài trời hoặc ngồi gần sân khấu, gọi vài món mồi bén, làm vài ly bia lạnh rồi để đêm Đà Lạt trôi theo nhạc.
          </Text>
          <Text tone="muted" measure="wide">
            Menu đủ cho một cuộc nhậu dài: mồi lai rai từ 39K, gỏi, các món heo, bò, gà, mực, tôm, ếch, cùng lẩu và mẹt để cả bàn cùng gắp. Đi đông thì có combo cho 4 và 6 người, kèm sẵn bia Tiger. Ngoài bia còn có cider, soju, rượu vang, rượu mơ và tháp bia cho những màn nâng ly. Giá trong menu đã gồm VAT.
          </Text>
          <Text tone="muted" measure="wide">
            Tan làm, sinh nhật hay lâu rồi chưa gặp, cứ hẹn nhau ở The Hot; đi nhóm đông thì báo trước để quán sắp chỗ. Xem{" "}
            <Link href="/menu/list" className={inlineLink}>bảng giá món nhậu</Link>
            {" "}để chốt món, ngó{" "}
            <a href="#events" className={inlineLink}>lịch sự kiện</a>
            {" "}xem tối nào có chương trình, rồi{" "}
            <Link href={site.cta.href} className={inlineLink} {...trackAttrs("booking_cta_click", { location: "intro" })}>đặt bàn trước</Link>
            {" "}hoặc gọi hotline{" "}
            <a href={site.phoneHref} className={inlineLink} {...trackAttrs("contact_click", { method: "phone", location: "intro" })}>{site.phone}</a>
            {" "}để giữ chỗ cho cả hội.
          </Text>
        </Stack>
      </div>
    </Section>
  );
}
