import { menuGroups, type MenuGroupId } from "../nokto/menu/data";

// Menu book pages, kept out of MenuBook.tsx ("use client") so server code such as the
// image sitemap can read them: values exported from a client module are client references.

export type MenuPage = { file: string; label: string; alt: string };

/** One tab of the flip book: its own folder of page images (1414×2000 JPEG). */
export type MenuBookData = { id: MenuGroupId; label: string; summary: string; base: string; pages: readonly MenuPage[] };

/** "Món ăn chơi": the dishes and beers The Hot posted on Facebook in September 2026. */
const anChoiPages: readonly MenuPage[] = [
  {
    file: "01-800796877_122135444649172686_9059122717537152863_n.jpg",
    label: "Món mới · trang 01",
    alt: "Menu món mới gồm bánh mì bơ tỏi, khoai lang kén, bắp sốt bơ cay và đậu hũ lướt ván",
  },
  {
    file: "02-800796866_122135444781172686_6041003405290942996_n.jpg",
    label: "Món mới · trang 02",
    alt: "Menu món mới gồm khoai lang kén lắc phô mai và da ếch rang muối",
  },
  {
    file: "03-799958838_122135444679172686_1250782695995952984_n.jpg",
    label: "Salad · trang 03",
    alt: "Menu salad dầu giấm, salad cải kale và khổ qua chà bông",
  },
  {
    file: "04-800993867_122135445015172686_2880443494216915679_n.jpg",
    label: "Gà · trang 04",
    alt: "Menu sụn gà rang muối và lòng mề gà xào hành",
  },
  {
    file: "05-800001194_122135444961172686_392697963960710615_n.jpg",
    label: "Mực · trang 05",
    alt: "Menu răng mực sốt bơ cay, răng mực chiên mắm và răng mực sate",
  },
  {
    file: "06-800756459_122135444985172686_4078762221086326244_n.jpg",
    label: "Hải sản · trang 06",
    alt: "Menu mực xào sate, mực trứng chiên mắm và mực trứng xào sate",
  },
  {
    file: "07-800862933_122135444823172686_5472107878615177399_n.jpg",
    label: "Heo · trang 07",
    alt: "Menu ba chỉ heo trộn thính, bao tử heo xào cải chua và bao tử heo chiên mắm",
  },
  {
    file: "08-800881809_122135444919172686_1741136367694887308_n.jpg",
    label: "Bò · trang 08",
    alt: "Menu gỏi bò Thái Lan và cải thìa xào bò sốt nấm",
  },
  {
    file: "09-800066853_122135444991172686_2171913459235762488_n.jpg",
    label: "Cơm và mì · trang 09",
    alt: "Menu mì trộn tứ vị, cơm chiên tóp mỡ, miến xào sốt XO và cơm chiên muối é",
  },
  {
    file: "10-792176893_122135446899172686_5106627020647185501_n.jpg",
    label: "Bia · trang 10",
    alt: "Menu bia gồm Heineken, Tiger, Larue và Strongbow",
  },
];

/**
 * "Premium": pages 12–22 and 24 of the owner's menu PDF (Canva, created 2026-09-06), exported at 1414×2000 like the
 * pages above. The covers and the beer page (already in "Món ăn chơi") are left out. The images stay as printed;
 * the text version in nokto/menu/data.ts fixes the PDF's typos.
 */
const premiumPages: readonly MenuPage[] = [
  {
    file: "01-combo-4-nguoi.jpg",
    label: "Combo 4 người · trang 01",
    alt: "Menu Premium combo 4 người: Kèo nhập cuộc, Kèo tụ hội và Kèo tới bến, mỗi kèo kèm 6 bia Tiger",
  },
  {
    file: "02-combo-6-nguoi.jpg",
    label: "Combo 6 người · trang 02",
    alt: "Menu Premium combo 6 người: Lật kèo 1 và Lật kèo 2, mỗi kèo kèm 8 bia Tiger",
  },
  {
    file: "03-mon-an-khai-vi.jpg",
    label: "Món ăn khai vị · trang 03",
    alt: "Menu món ăn khai vị gồm gỏi rau má trộn tép đồng, gỏi bò tái chanh, nem chả trộn kiểu Huế, chả cá cầu vồng và gỏi đu đủ ba khía",
  },
  {
    file: "04-moi-ben-lai-rai.jpg",
    label: "Mồi bén lai rai · trang 04",
    alt: "Menu mồi bén lai rai gồm hàu nướng mỡ hành, mực khô nướng, nghêu hấp sả, cá lóc nướng và mực một nắng cháy tỏi",
  },
  {
    file: "05-cac-mon-met.jpg",
    label: "Các món mẹt · trang 05",
    alt: "Menu các món mẹt: mẹt gà rực lửa, mẹt núi rừng Tây Bắc và mẹt The Hot",
  },
  {
    file: "06-chuyen-nha-heo.jpg",
    label: "Chuyện nhà heo · trang 06",
    alt: "Menu món heo gồm tóp mỡ Triều Khúc, nọng heo nướng Tây Bắc, ba chỉ cháy cạnh tiêu xanh và sườn nướng cao bồi",
  },
  {
    file: "07-chuyen-nha-bo.jpg",
    label: "Chuyện nhà bò · trang 07",
    alt: "Menu món bò gồm bò lúc lắc, bò cuộn lá lốt, bò thượng hạng nướng ngũ vị và bò nướng phiến đá",
  },
  {
    file: "08-chuyen-nha-ga.jpg",
    label: "Chuyện nhà gà · trang 08",
    alt: "Menu món gà gồm gà tre mắm nhĩ, chân gà chiên mắm, cánh gà rang muối lá chanh và gà xào Kung Pao",
  },
  {
    file: "09-chuyen-nha-tom-ech.jpg",
    label: "Tôm và ếch · trang 09",
    alt: "Menu tôm sú cháy tỏi, tôm sú nổ cốm rang, tôm sú nướng muối ớt, ếch xào sả ớt và ếch rang lá chanh",
  },
  {
    file: "10-lau-va-canh.jpg",
    label: "Lẩu và canh · trang 10",
    alt: "Menu lẩu bắp bò riêu tôm, lẩu gà tiềm đại bổ, lẩu ếch măng cay, lẩu hải sản Tom Yum và canh bầu",
  },
  {
    file: "11-com-mi-chao-rau.jpg",
    label: "Cơm, mì, cháo, rau · trang 11",
    alt: "Menu cơm chiên, mì xào, cháo bò băm, cháo hải sản, rau rừng xào tỏi và đậu khuôn",
  },
  {
    file: "12-ruou-vang-thap.jpg",
    label: "Rượu, vang và tháp · trang 12",
    alt: "Menu đồ uống gồm soju, vodka, gin, Jim Beam, Jagermeister, vang Pháp, rượu mơ, rượu táo mèo, tháp bia Sapporo và tháp cocktail",
  },
];

const IMAGES = "/sites/the-hot-beer-garden/images";

const pagesByGroup: Record<MenuGroupId, { base: string; pages: readonly MenuPage[] }> = {
  an_choi: { base: `${IMAGES}/facebook-post-menu-2026-09`, pages: anChoiPages },
  premium: { base: `${IMAGES}/menu-premium-2026-09`, pages: premiumPages },
};

/** The flip book's tabs, in the same order and with the same labels as the list's groups. */
export const menuBooks: readonly MenuBookData[] = menuGroups.map((group) => ({
  id: group.id,
  label: group.label,
  summary: group.summary,
  ...pagesByGroup[group.id],
}));

/** Root-relative URL of one page image. */
export function menuPageSrc(book: MenuBookData, page: MenuPage): string {
  return `${book.base}/${page.file}`;
}
