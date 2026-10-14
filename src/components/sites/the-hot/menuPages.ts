// Menu book pages, kept out of MenuBook.tsx ("use client") so server code such as the
// image sitemap can read them: values exported from a client module are client references.
export const MENU_IMAGE_BASE = "/sites/the-hot-beer-garden/images/facebook-post-menu-2026-09";

export const menuPages = [
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
] as const;
