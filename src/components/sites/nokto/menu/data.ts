import { siteImage } from "../site";

export type MenuItem = {
  name: string;
  /** Italic detail shown after the name. */
  subtitle?: string;
  description: string;
  /** Price in the site currency (PLN). */
  price: number;
  /** Thumbnail path; items without one keep an empty placeholder tile. */
  image?: string;
};

export type MenuCategory = {
  name: string;
  tagline?: string;
  items: MenuItem[];
};

export type MenuContent = {
  label: string;
  headline: string;
  editorial: string;
  categories: MenuCategory[];
  pairings: string;
  footnote: string;
};

// Autumn menu as published on the source page.
export const menu: MenuContent = {
  label: "MENU — AUTUMN SEASON",
  headline: "Each plate is a chapter.",
  editorial: "The menu shifts with each season. The intention holds.",
  categories: [
    {
      name: "SASHIMI",
      tagline: "Cut, rested, served at the temperature it asks for.",
      items: [
        {
          name: "Otoro",
          subtitle: "Bluefin belly",
          description: "Three slices, aged seven days, sea salt and yuzu zest",
          price: 145,
          image: siteImage("otoro.jpg"),
        },
        {
          name: "Hirame",
          subtitle: "Olive flounder",
          description: "Kelp-cured, ponzu, pink peppercorn",
          price: 95,
          image: siteImage("hirame.jpg"),
        },
        {
          name: "Hotate",
          subtitle: "Hokkaido scallop",
          description: "Raw, brown butter, charred leek oil",
          price: 110,
          image: siteImage("hotate.jpg"),
        },
        {
          name: "Akami Zuke",
          subtitle: "Marinated lean tuna",
          description: "Soy, mirin, fresh wasabi grated to order",
          price: 85,
          image: siteImage("akami.jpg"),
        },
        {
          name: "Kanpachi",
          subtitle: "Amberjack",
          description: "Smoked over cherrywood, green apple, shiso",
          price: 105,
          image: siteImage("kanpachi.jpg"),
        },
      ],
    },
    {
      name: "NIGIRI",
      tagline: "Rice warm. Fish cold. The hand decides everything in between.",
      items: [
        {
          name: "Otoro Nigiri",
          description: "Aged bluefin belly, nikiri brushed",
          price: 65,
          image: siteImage("otoro-nigiri.jpg"),
        },
        {
          name: "Uni",
          subtitle: "Hokkaido sea urchin",
          description: "Single piece, nori from Ariake Bay",
          price: 85,
          image: siteImage("uni.jpg"),
        },
        {
          name: "Ikura",
          subtitle: "Salmon roe",
          description: "Cured in sake and dashi overnight",
          price: 45,
          image: siteImage("ikura.jpg"),
        },
        {
          name: "Anago",
          subtitle: "Saltwater eel",
          description: "Slow-braised, sweet tsume glaze",
          price: 55,
          image: siteImage("anago.jpg"),
        },
        {
          name: "Saba",
          subtitle: "Mackerel",
          description: "Pressed, vinegared, ginger",
          price: 40,
          image: siteImage("saba.jpg"),
        },
        {
          name: "A5 Wagyu",
          subtitle: "Miyazaki",
          description: "Seared on binchotan, smoked soy",
          price: 95,
          image: siteImage("a5wagyu.jpg"),
        },
      ],
    },
    {
      name: "OMAKASE",
      tagline: "The chef chooses. You arrive hungry, curious, on time.",
      items: [
        {
          name: "Hana",
          subtitle: "seven courses",
          description: "Sashimi, two warm plates, nigiri selection, dessert",
          price: 480,
        },
        {
          name: "Tsuki",
          subtitle: "twelve courses",
          description: "Full seasonal progression, premium cuts, paired tea",
          price: 680,
        },
        {
          name: "Yoru",
          subtitle: "chef's table, eight guests",
          description: "Extended tasting at the counter, conversation with the chef",
          price: 880,
        },
      ],
    },
    {
      name: "WINE & SAKE",
      items: [
        {
          name: "Dassai 39 Junmai Daiginjo",
          subtitle: "by the carafe, 180ml",
          description: "Yamaguchi · floral, restrained",
          price: 95,
        },
        {
          name: "Tedorigawa Yamahai",
          subtitle: "by the carafe, 180ml",
          description: "Ishikawa · earthy, structured",
          price: 75,
        },
        {
          name: "Chablis 1er Cru, Vaillons",
          subtitle: "glass",
          description: "Domaine Dauvissat, 2021",
          price: 85,
        },
        {
          name: "Champagne Egly-Ouriet Brut Tradition",
          subtitle: "glass",
          description: "Grand Cru, Ambonnay",
          price: 110,
        },
        {
          name: "Hojicha Cold Brew",
          subtitle: "non-alcoholic, carafe",
          description: "Roasted, deep, served chilled",
          price: 35,
        },
      ],
    },
  ],
  pairings: "Sake flight 220 · wine flight 280 · non-alcoholic 140. Pairings on request.",
  footnote:
    "Prices in PLN. Tell us about dietary needs when you reserve. The counter is small, the menu is the chef's — both by design.",
};
