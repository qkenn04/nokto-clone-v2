import { SiteFooter } from "@/components/sites/nokto/chrome/SiteFooter";
import { HeroIntro } from "@/components/sites/nokto/home/HeroIntro";
import { HeroPhoto } from "@/components/sites/nokto/home/HeroPhoto";
import { siteImage } from "@/components/sites/nokto/site";

// One locked viewport on desktop (45% intro, 55% photograph, footer below); stacked on mobile.
export default function HomePage() {
  return (
    <main id="main-content" className="relative flex w-full flex-col lg:h-dvh lg:overflow-hidden">
      <div className="flex flex-col lg:min-h-0 lg:flex-1 lg:flex-row">
        <section className="order-1 flex w-full flex-col lg:order-1 lg:min-h-0 lg:w-[45%] lg:flex-none lg:overflow-hidden">
          <HeroIntro />
        </section>
        <aside className="relative order-2 aspect-[3/2] w-full overflow-hidden sm:aspect-[16/10] lg:order-2 lg:aspect-auto lg:min-h-0 lg:w-[55%] lg:flex-none">
          <HeroPhoto
            src={siteImage("hero-nigiri.jpg")}
            alt="Chef-prepared dish at NOKTO"
            signature="Haruki Tanaka"
            signatureCaption="Chef"
          />
        </aside>
      </div>
      <SiteFooter />
    </main>
  );
}
