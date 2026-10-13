import { site } from "../site";

export type MenuItem = { name: string; subtitle?: string; description?: string; price: number; image?: string };
export type MenuCategory = { name: string; tagline?: string; items: MenuItem[] };
export type MenuContent = { label: string; headline: string; editorial: string; categories: MenuCategory[]; pairings: string; footnote: string };

// Prices in VND from The Hot’s supplied menu, including VAT.
export const menu: MenuContent = {
  label: "MENU NHẬU — THE HOT",
  headline: "Mồi bén. Bia lạnh.",
  editorial: "Từ món lai rai đến món ăn no, gọi theo gu của cả bàn.",
  categories: [
    {
      name: "Món ăn chơi",
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
  pairings: site.beerOffer,
  footnote: "Giá VNĐ, đã gồm VAT. Nhắn The Hot để hỏi món đang có và ưu đãi hôm bạn ghé.",
};
