import { site } from "../site";

export type MenuItem = { name: string; subtitle?: string; description?: string; price: number; image?: string };
/** `short` is the filter chip's label when the heading is a playful name ("Sục sôi" → "Lẩu"). */
export type MenuCategory = { name: string; short?: string; tagline?: string; items: MenuItem[] };
export type MenuGroupId = "an_choi" | "premium";
/** A tab of the menu: the list shows one group at a time, the flip book (the-hot/menuPages.ts) one book per group. */
export type MenuGroup = { id: MenuGroupId; label: string; summary: string; categories: MenuCategory[] };
export type MenuContent = { label: string; headline: string; editorial: string; groups: MenuGroup[]; pairings: string; footnote: string };

// Prices in VND from The Hot’s supplied menu, including VAT.
// "Món ăn chơi": the menu pages posted on Facebook in September 2026.
// "Premium": the owner's menu PDF (Canva, created 2026-09-06), pages 12–22 and 24. Names follow the print; this text
// version fixes only clear typos (English spelling, missing spaces, a mistranslated name, two dishes printed twice)
// and writes "mực một nắng" the same way everywhere. English names are the printed ones, for visitors.
const anChoi: MenuGroup = {
  id: "an_choi",
  label: "Món ăn chơi",
  summary: "Mồi lai rai, salad, bia",
  categories: [
    {
      name: "Món mới",
      tagline: "Gọi vài món, lai rai trong lúc chờ đủ hội.",
      items: [
        { name: "Bánh mì bơ tỏi", price: 39000 },
        { name: "Khoai lang kén", price: 39000 },
        { name: "Bắp sốt bơ cay", price: 69000 },
        { name: "Đậu hũ lướt ván", price: 59000 },
        { name: "Khoai lang kén lắc phô mai", price: 45000 },
        { name: "Da ếch rang muối", price: 59000 },
      ],
    },
    {
      name: "Salad",
      tagline: "Thêm chút rau xanh cho cả bàn.",
      items: [
        { name: "Salad dầu giấm", price: 59000 },
        { name: "Salad cải kale", price: 99000 },
        { name: "Khổ qua chà bông", price: 49000 },
      ],
    },
    {
      name: "Gà",
      tagline: "Sụn gà và lòng mề, chọn món hợp gu.",
      items: [
        { name: "Sụn gà rang muối", price: 99000 },
        { name: "Lòng mề gà xào hành", price: 79000 },
      ],
    },
    {
      name: "Mực",
      tagline: "Mực trứng, răng mực — bơ cay, mắm hay sate?",
      items: [
        { name: "Răng mực sốt bơ cay", price: 99000 },
        { name: "Răng mực chiên mắm", price: 89000 },
        { name: "Răng mực sate", price: 89000 },
        { name: "Mực xào sate", price: 99000 },
        { name: "Mực trứng chiên mắm", price: 99000 },
        { name: "Mực trứng xào sate", price: 99000 },
      ],
    },
    {
      name: "Heo",
      tagline: "Trộn thính, xào cải chua hay chiên mắm?",
      items: [
        { name: "Ba chỉ heo trộn thính", price: 99000 },
        { name: "Bao tử heo xào cải chua", price: 99000 },
        { name: "Bao tử heo chiên mắm", price: 99000 },
      ],
    },
    {
      name: "Bò",
      tagline: "Gỏi bò Thái Lan hoặc cải thìa xào bò sốt nấm.",
      items: [
        { name: "Gỏi bò Thái Lan", price: 99000 },
        { name: "Cải thìa xào bò sốt nấm", price: 99000 },
      ],
    },
    {
      name: "Cơm & mì",
      tagline: "Hội đang đói? Thêm cơm, mì hoặc miến.",
      items: [
        { name: "Mì trộn tứ vị", price: 99000 },
        { name: "Cơm chiên tóp mỡ", price: 89000 },
        { name: "Miến xào sốt XO", price: 99000 },
        { name: "Cơm chiên muối é", price: 89000 },
      ],
    },
    {
      name: "Bia & cider",
      tagline: site.beerOffer,
      items: [
        { name: "Heineken", price: 23000 },
        { name: "Heineken Silver", price: 23000 },
        { name: "Tiger Crystal", price: 20000 },
        { name: "Larue Smooth", price: 20000 },
        { name: "Tiger Silver", price: 19000 },
        { name: "Strongbow Dâu", price: 32000 },
        { name: "Strongbow Táo", price: 32000 },
        { name: "Strongbow Nho đen", price: 32000 },
      ],
    },
  ],
};

const premium: MenuGroup = {
  id: "premium",
  label: "Premium",
  summary: "Combo, lẩu, mẹt, rượu",
  categories: [
    {
      name: "Combo",
      tagline: "Chốt kèo cho cả hội: món nhậu kèm bia Tiger, cho 4 hoặc 6 người.",
      items: [
        {
          name: "Kèo nhập cuộc",
          subtitle: "Combo for 4",
          description: "Combo 4 người: nem chả trộn chua cay, bắp xào tép đồng, nọng heo nướng Tây Bắc và 6 bia Tiger.",
          price: 693000,
        },
        {
          name: "Kèo tụ hội",
          subtitle: "Combo for 4",
          description: "Combo 4 người: gỏi xoài cá khô bò, mực một nắng cháy tiêu xanh, bò xào luklak và 6 bia Tiger.",
          price: 756000,
        },
        {
          name: "Kèo tới bến",
          subtitle: "Combo for 4",
          description: "Combo 4 người: nem chả tré, bò kéo pháo, tóp mỡ Triều Khúc và 6 bia Tiger.",
          price: 756000,
        },
        {
          name: "Lật kèo 1",
          subtitle: "Combo for 6",
          description:
            "Combo 6 người: gỏi tai heo bóp rau răm, mực khô lắc khoai lang, sụn gà chiên mắm, mực một nắng cháy tiêu xanh, nọng heo nướng ngũ vị và 8 bia Tiger.",
          price: 1159000,
        },
        {
          name: "Lật kèo 2",
          subtitle: "Combo for 6",
          description:
            "Combo 6 người: gỏi bò tái chanh bóp cà pháo, tóp mỡ Triều Khúc, bò xào luklak, chân gà chiên mắm, nọng heo nướng Tây Bắc và 8 bia Tiger.",
          price: 1159000,
        },
      ],
    },
    {
      name: "Món ăn khai vị",
      short: "Khai vị",
      tagline: "Gỏi, trộn, bóp — mở màn cho cả bàn.",
      items: [
        { name: "Gỏi rau má trộn tép đồng", subtitle: "Pennywort Salad With Freshwater Shrimp", price: 122000 },
        { name: "Gỏi xoài cá khô bò", subtitle: "Dried Triggerfish & Mango Salad", price: 122000 },
        { name: "Gỏi bò tái chanh bóp cà pháo", subtitle: "Rare Beef Salad With Lime & Pickled Eggplant", price: 175000 },
        { name: "Khoai tây chiên lắc phô mai", subtitle: "French Fries With Cheese Powder", price: 97000 },
        { name: "Chân gà lắc cóc xoài", subtitle: "Chicken Feet With Ambarella and Mango", price: 97000 },
        { name: "Xà lách trộn trái cây Đà Lạt", subtitle: "Dalat Fruit Salad", price: 122000 },
        { name: "Nem chả trộn chua cay kiểu Huế", subtitle: "Hue Style Spicy & Sour Mixed Pork Rolls", price: 149000 },
        { name: "Tai heo bóp gỏi rau răm", subtitle: "Pig Ear Salad With Vietnamese Coriander", price: 162000 },
        { name: "Bao tử bóp rau răm", subtitle: "Pork Stomach Salad With Vietnamese Coriander", price: 162000 },
        { name: "Trứng bách thảo tôm khô củ kiệu", subtitle: "Century Egg With Dried Shrimp and Pickled Leeks", price: 162000 },
        { name: "Chả cá cầu vồng", subtitle: "Rainbow Fish Cakes", price: 225000 },
        { name: "Gỏi đu đủ ba khía Thái Lan", subtitle: "Thai Papaya Salad With Salted Crab", price: 188000 },
        { name: "Gỏi xà lách xoong trộn bò", subtitle: "Watercress and Beef Salad", price: 177000 },
      ],
    },
    {
      name: "Mồi bén lai rai",
      short: "Mồi bén",
      tagline: "Hàu, nghêu, mực, cá — nhâm nhi cùng bia lạnh.",
      items: [
        { name: "Cá bò khô nướng", subtitle: "Grilled Dried Triggerfish", price: 146000 },
        { name: "Hàu nướng mỡ hành", subtitle: "Grilled Oysters With Scallion Oil", price: 213000 },
        { name: "Mực khô nướng", subtitle: "Grilled Dried Squid", price: 227000 },
        { name: "Hàu nướng phô mai", subtitle: "Grilled Oysters With Cheese", price: 227000 },
        { name: "Nem chả tré", subtitle: "Fermented Pork Roll", price: 188000 },
        { name: "Nghêu hấp sả", subtitle: "Steamed Clams With Lemongrass", price: 188000 },
        { name: "Nghêu hấp Thái", subtitle: "Thai Steamed Clams", price: 188000 },
        { name: "Chả cá thác lác um măng cay", subtitle: "Spicy Braised Clown Knifefish Cake With Bamboo Shoots", price: 213000 },
        { name: "Cá lóc nướng Hoả Diệm Sơn", subtitle: "Snakehead Fish Grilled Flaming Mountain Style", price: 380000 },
        { name: "Mực khô lắc mắm khoai lang", subtitle: "Grilled Dried Squid With Sweet Potato Fish Sauce", price: 188000 },
        { name: "Mực một nắng cháy tỏi", subtitle: "Sun-dried Squid With Crispy Garlic", price: 213000 },
        { name: "Mực một nắng cháy tiêu xanh", subtitle: "Grilled Dried Squid With Green Peppercorns", price: 213000 },
        { name: "Mực cơm chiên mắm", subtitle: "Fried Rice Field Squid With Fish Sauce", price: 252000 },
        { name: "Cá diêu hồng chiên giòn sốt Thái", subtitle: "Crispy Red Tilapia With Thai Sauce", price: 252000 },
      ],
    },
    {
      name: "Các món mẹt",
      short: "Mẹt",
      tagline: "Mỗi mẹt năm món, bày chung một mâm cho cả hội.",
      items: [
        {
          name: "Mẹt gà rực lửa",
          description: "Cánh gà rang lá chanh, canh lòng gà trứng non, gà nướng ngũ vị, xôi nếp nương, gà hấp lá chanh.",
          price: 580000,
        },
        {
          name: "Mẹt núi rừng Tây Bắc",
          description: "Diềm heo nướng chẩm chéo, canh lòng gà trứng non, gà hấp mắc khén, ếch nướng Tây Bắc, xôi nếp nương.",
          price: 708000,
        },
        {
          name: "Mẹt The Hot",
          description: "Xôi gấc nấu nấm, gà nướng ngũ vị, ếch đồng rang lá chanh, nội trường hấp, nọng heo nướng lá mắc mật.",
          price: 708000,
        },
      ],
    },
    {
      name: "Chuyện nhà heo",
      short: "Heo",
      tagline: "Tóp mỡ, nọng, diềm, ba chỉ, sườn — đủ món cho hội mê heo.",
      items: [
        { name: "Tóp mỡ Triều Khúc", subtitle: "Crackling Trieu Khuc Style", price: 162000 },
        { name: "Phèo non xào dưa cải chua", subtitle: "Stir-fried Pork Intestines With Pickled Mustard Greens", price: 162000 },
        { name: "Diềm heo cháy tỏi lá chanh", subtitle: "Pork Skirt With Crispy Garlic & Kaffir Lime Leaves", price: 188000 },
        { name: "Nọng heo nướng Tây Bắc", subtitle: "Northwest Grilled Pork Jowl", price: 198000 },
        { name: "Ba chỉ một nắng cuốn lá mơ", subtitle: "Grilled Dried Pork Belly With Hog Plum Leaves", price: 188000 },
        { name: "Nọng heo nướng ngũ vị", subtitle: "Five-spice Grilled Pork Jowl", price: 213000 },
        { name: "Ba chỉ cháy cạnh tiêu xanh", subtitle: "Crispy Pork Belly With Green Pepper", price: 188000 },
        { name: "Sườn nướng cao bồi", subtitle: "Western-style Grilled Pork Ribs", price: 278000 },
        { name: "Sườn heo nấu kiểu Thái", subtitle: "Thai Style Pork Ribs", price: 290000 },
        { name: "Diềm heo nướng Tây Bắc kèm kim chi", subtitle: "Northwest Grilled Pork Skirt With Kimchi", price: 213000 },
      ],
    },
    {
      name: "Chuyện nhà bò",
      short: "Bò",
      tagline: "Từ bò lúc lắc tới bò nướng phiến đá khói lửa.",
      items: [
        { name: "Lá sách bò tê cay", subtitle: "Spicy Beef Tripe", price: 213000 },
        { name: "Bò tương bần", subtitle: "Beef With Fermented Bean Sauce", price: 252000 },
        { name: "Bò kéo pháo", subtitle: "Beef & Pickled Eggplant", price: 252000 },
        { name: "Bò lúc lắc", subtitle: "Shaking Beef", price: 252000 },
        { name: "Bò cuộn lá lốt", subtitle: "Grilled Beef Wrapped in Betel Leaves", price: 248000 },
        { name: "Gân bò xào sa tế", subtitle: "Stir-fried Beef Tendon With Satay Sauce", price: 204000 },
        { name: "Bắp bò ngâm tương", subtitle: "Soy-marinated Beef Shank", price: 293000 },
        { name: "Bò thượng hạng nướng ngũ vị", subtitle: "Five-spice Grilled Prime Beef", price: 406000 },
        { name: "Bò nướng phiến đá khói lửa", subtitle: "Hot Stone Grilled Beef", price: 444000 },
      ],
    },
    {
      name: "Chuyện nhà gà",
      short: "Gà",
      tagline: "Gà tre mắm nhĩ, chân, sụn, cánh — chiên mắm hay rang muối?",
      items: [
        { name: "Gà tre mắm nhĩ", subtitle: "Free-range Chicken With Fish Sauce", price: 278000 },
        { name: "Chân gà chiên mắm", subtitle: "Fried Chicken Feet With Fish Sauce", price: 137000 },
        { name: "Sụn gà chiên mắm", subtitle: "Fried Chicken Cartilage With Fish Sauce", price: 149000 },
        { name: "Gà nướng ngũ vị kèm xôi gấc", subtitle: "Five-spice Grilled Chicken With Sticky Rice", price: 278000 },
        { name: "Cánh gà rang muối lá chanh", subtitle: "Roasted Chicken Wings With Salt & Kaffir Lime Leaves", price: 162000 },
        { name: "Cánh gà chiên mắm", subtitle: "Fried Chicken Wings With Fish Sauce", price: 162000 },
        { name: "Gà xào Kung Pao", subtitle: "Kung Pao Chicken", price: 255000 },
      ],
    },
    {
      name: "Chuyện nhà tôm",
      short: "Tôm",
      tagline: "Tôm sú cháy tỏi, nướng muối ớt hay nổ cốm rang?",
      items: [
        { name: "Tôm sú cháy kim chi", subtitle: "Wok-tossed Tiger Prawns With Kimchi", price: 278000 },
        { name: "Tôm sốt Thái", subtitle: "Thai Style Shrimp", price: 200000 },
        { name: "Tôm sú nướng muối ớt", subtitle: "Grilled Prawns With Chili Salt", price: 252000 },
        { name: "Tôm sú nổ cốm rang", subtitle: "Firecracker Prawns With Roasted Young Rice", price: 278000 },
        { name: "Tôm sú xào sốt bơ cay", subtitle: "Stir-fried Prawns With Spicy Butter Sauce", price: 278000 },
        { name: "Tôm sú cháy tỏi", subtitle: "Prawns With Crispy Garlic", price: 278000 },
      ],
    },
    {
      name: "Chuyện nhà ếch",
      short: "Ếch",
      tagline: "Ếch xào sả ớt hoặc rang lá chanh.",
      items: [
        { name: "Ếch xào sả ớt", subtitle: "Stir-fried Frog With Lemongrass & Chili", price: 188000 },
        { name: "Ếch rang lá chanh", subtitle: "Roasted Frog With Kaffir Lime Leaves", price: 188000 },
      ],
    },
    {
      name: "Sục sôi",
      short: "Lẩu",
      tagline: "Lẩu sôi giữa bàn cho đêm Đà Lạt se lạnh.",
      items: [
        { name: "Lẩu bắp bò riêu tôm", subtitle: "Beef Shank & Shrimp Paste Hotpot", price: 380000 },
        { name: "Lẩu gà tiềm đại bổ", subtitle: "Nutritious Herbal Chicken Hotpot", price: 508000 },
        { name: "Lẩu ếch măng cay", subtitle: "Spicy Bamboo Shoot Frog Hotpot", price: 213000 },
        { name: "Lẩu hải sản Tom Yum", subtitle: "Tom Yum Seafood Hotpot", price: 380000 },
      ],
    },
    {
      name: "Hồi sức",
      short: "Canh",
      tagline: "Thố tiềm và canh bầu cho ấm bụng.",
      items: [
        { name: "Thố tiềm tam sung sung", subtitle: "Braised Chicken Offal Pot With Triple Herbs", price: 508000 },
        { name: "Canh bầu nấu tôm", subtitle: "Gourd Soup With Shrimp", price: 188000 },
        { name: "Canh bầu nấu nghêu", subtitle: "Gourd Soup With Clams", price: 188000 },
      ],
    },
    {
      name: "Bền bỉ",
      short: "Cơm, mì, cháo",
      tagline: "Cơm chiên, mì xào, cháo — ăn no để còn chơi tiếp.",
      items: [
        { name: "Mì xào hải sản", subtitle: "Stir-fried Seafood Noodles", price: 200000 },
        { name: "Mì xào bò", subtitle: "Stir-fried Beef Noodles", price: 188000 },
        { name: "Cơm chiên cá mặn", subtitle: "Salted Fish Fried Rice", price: 188000 },
        { name: "Cơm chiên dưa bò", subtitle: "Beef & Pickled Cucumber Fried Rice", price: 188000 },
        { name: "Cơm chiên Hải Hoàng Bào", subtitle: "Imperial Seafood Fried Rice", price: 213000 },
        { name: "Cháo bò băm", subtitle: "Minced Beef Porridge", price: 162000 },
        { name: "Cháo hải sản", subtitle: "Seafood Porridge", price: 188000 },
        { name: "Cơm chiên Bát Bửu", subtitle: "Eight-treasure Fried Rice", price: 236000 },
      ],
    },
    {
      name: "Tái sinh",
      short: "Rau & đậu",
      tagline: "Rau xào tỏi, đậu khuôn và bắp xào tép đồng.",
      items: [
        { name: "Bắp xào tép đồng", subtitle: "Stir-fried Corn With Freshwater Shrimp", price: 162000 },
        { name: "Rau rừng xào tỏi", subtitle: "Stir-fried Forest Vegetables With Garlic", price: 84000 },
        { name: "Rau muống xào tỏi", subtitle: "Stir-fried Morning Glory With Garlic", price: 84000 },
        { name: "Đọt su su xào tỏi", subtitle: "Stir-fried Chayote Shoots With Garlic", price: 84000 },
        { name: "Đậu khuôn chiên", subtitle: "Fried Tofu", price: 84000 },
        { name: "Đậu khuôn mỡ hành", subtitle: "Tofu With Scallion Oil", price: 84000 },
        { name: "Đậu khuôn cháy sả", subtitle: "Fried Tofu With Lemongrass", price: 84000 },
      ],
    },
    {
      name: "Chưa say",
      short: "Rượu & vang",
      tagline: "Tháp Sapporo, rượu, vang Pháp và rượu trái cây.",
      items: [
        { name: "Tháp Sapporo", subtitle: "Sapporo Beer Tower", price: 638000 },
        { name: "Soju Chamisul", price: 182000 },
        { name: "Vodka Cheers", price: 898000 },
        { name: "Gin Cheers", price: 1125000 },
        { name: "Jim Beam", price: 1125000 },
        { name: "Jose Cuervo Tequila", price: 1534000 },
        { name: "Jagermeister", price: 1125000 },
        { name: "Rivage", subtitle: "France", description: "Grenache – Tempranillo", price: 670000 },
        { name: "Chateau du Pin", subtitle: "France", description: "Cab. Franc – Cab. Sauvignon – Merlot", price: 759000 },
        { name: "Rim-mơ The Hot", subtitle: "Vietnamese Apricot Wine", price: 55000 },
        { name: "Áp-pồ Meow Meow", subtitle: "Vietnamese Wild Hawthorn Wine", price: 55000 },
      ],
    },
    {
      name: "Tháp chill tự do",
      short: "Tháp chill",
      tagline: "Tháp cocktail cho cả bàn.",
      items: [
        { name: "Bomb Peach", description: "Vodka Cheers, Cointreau, syrup bưởi, syrup đào, nước ép thơm, soda.", price: 897000 },
        { name: "Jager Bomb Tower", description: "Vodka Cheers, rum Bacardi, Blue Curacao, nước ép thơm.", price: 1010000 },
      ],
    },
  ],
};

export const menu: MenuContent = {
  label: "MENU NHẬU — THE HOT",
  headline: "Mồi bén. Bia lạnh.",
  editorial: "Từ món lai rai đến món ăn no, gọi theo gu của cả bàn.",
  groups: [anChoi, premium],
  pairings: site.beerOffer,
  footnote: "Giá VNĐ, đã gồm VAT. Nhắn The Hot để hỏi món đang có và ưu đãi hôm bạn ghé.",
};

/** The two tabs, shared by the list and the flip book. */
export const menuGroups: readonly MenuGroup[] = menu.groups;
