import { ArrowDown } from "lucide-react";
import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { HeroIntro } from "@/components/sites/nokto/home/HeroIntro";
import { HeroVideo } from "@/components/sites/the-hot/HeroVideo";
import { HomeGallery } from "@/components/sites/the-hot/home/HomeGallery";
import { EventTimeline } from "@/components/sites/the-hot/home/EventTimeline";

// Video fills the mobile hero; desktop uses the intro and video side by side.
export default function HomePage() {
  return (
    <main id="main-content" className="relative w-full">
      <div className="relative isolate flex min-h-svh flex-col lg:h-dvh lg:min-h-[40rem] lg:flex-row">
        <section className="pointer-events-none relative z-10 flex w-full flex-1 flex-col lg:pointer-events-auto lg:min-h-0 lg:w-[45%] lg:flex-none lg:overflow-hidden">
          <HeroIntro />
        </section>
        <aside className="absolute inset-0 z-0 overflow-hidden lg:relative lg:inset-auto lg:min-h-0 lg:w-[55%] lg:flex-none">
          <HeroVideo
            src="/videos/main.mp4"
            poster="/sites/the-hot-beer-garden/images/hero-video-poster.jpg"
          />
        </aside>
        <div className="section-pad pointer-events-none absolute inset-x-0 bottom-6 z-20">
          <a href="#gallery" className="pointer-events-auto inline-flex min-h-11 items-center gap-3 text-small font-semibold text-accent transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            <ArrowDown aria-hidden size={18} strokeWidth={1.5} />
            <span className="sm:hidden">Khám phá</span>
            <span className="hidden sm:inline">Gallery & sự kiện</span>
          </a>
        </div>
      </div>
      <HomeGallery />
      <EventTimeline />
      <SiteFooter />
    </main>
  );
}
