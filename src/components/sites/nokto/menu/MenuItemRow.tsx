import Image from "next/image";
import { site } from "../site";
import { Heading, Text } from "../ui";
import type { MenuItem } from "./data";

/** Dish row: thumbnail (zooms on hover), name with its English name, description, price. */
export function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <li className={`group relative grid ${item.image ? "grid-cols-[auto_1fr_auto]" : "grid-cols-[1fr_auto]"} items-center gap-4 py-4 sm:gap-6 sm:py-5 lg:py-6`}>
      {item.image ? (
        <div className="relative aspect-square w-16 shrink-0 sm:w-20 lg:w-24">
          <div className="relative h-full w-full origin-left overflow-hidden bg-surface transition-transform duration-500 ease-cinema group-hover:z-20 group-hover:scale-[2.6]">
            <Image src={item.image} alt="" fill quality={90} sizes="16rem" className="object-cover" />
          </div>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-col gap-1.5">
        <Heading as="h3" level="h3" family="sans">
          {item.name}
          {item.subtitle ? (
            <>
              {" "}
              <span className="ml-1" lang="en">
                <Text as="span" variant="body" tone="muted">
                  {item.subtitle}
                </Text>
              </span>
            </>
          ) : null}
        </Heading>
        {item.description ? <Text variant="small" tone="low">{item.description}</Text> : null}
      </div>
      <span
        aria-label={`${item.price} ${site.currency.symbol}`}
        className="shrink-0 text-body tabular-nums text-foreground"
      >
        {new Intl.NumberFormat("vi-VN").format(item.price)}{site.currency.symbol}
      </span>
    </li>
  );
}
