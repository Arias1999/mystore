import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Sardines Mega green", price: 20, img: "/products/sardines-mega-green.jpg" },
  { name: "Meat Loaf", price: 38, img: "/products/meat-loaf.webp" },
  { name: "Beef Loaf", price: 42, img: "/products/beef-loaf.webp" },
  { name: "Carne Norte", price: 55, img: "/products/carne-norte.jpg" },
  { name: "Corned Beef", price: 45, img: "/products/corned-beef.webp" },
  { name: "Tuna", price: 35, img: "/products/tuna-spicy.jpg" },
  { name: "Sardines Mega red", price: 55, img: "/products/sardines-mega-red.webp" },
];

export default function CanGoodsPage() {
  return <ProductPage title="🥫 Canned Food" category="Canned Food" items={items} />;
}
