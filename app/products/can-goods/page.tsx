import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Sardines", price: 20, img: "/products/canned.jpg" },
  { name: "Meat Loaf", price: 38, img: "/products/canned.jpg" },
  { name: "Beef Loaf", price: 42, img: "/products/canned.jpg" },
  { name: "Carne Norte", price: 55, img: "/products/canned.jpg" },
  { name: "Corned Beef", price: 45, img: "/products/canned.jpg" },
  { name: "Tuna", price: 35, img: "/products/canned.jpg" },
  { name: "Luncheon Meat", price: 55, img: "/products/canned.jpg" },
];

export default function CanGoodsPage() {
  return <ProductPage title="🥫 Can Goods" category="Canned Food" items={items} />;
}
