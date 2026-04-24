import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Sardines", price: 20, img: "/products/canned.jpg" },
  { name: "Corned Beef", price: 45, img: "/products/canned.jpg" },
  { name: "Tuna", price: 35, img: "/products/canned.jpg" },
  { name: "Luncheon Meat", price: 55, img: "/products/canned.jpg" },
];

export default function CanGoodsPage() {
  return <ProductPage title="🥫 Can Goods" category="Canned Food" items={items} />;
}
