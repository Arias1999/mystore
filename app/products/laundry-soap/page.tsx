import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Ariel", price: 20, img: "/products/ariel.jpg" },
  { name: "Tide", price: 18, img: "/products/tide.jpg" },
  { name: "Surf", price: 15, img: "/products/surf.jpg" },
  { name: "Breeze", price: 16, img: "/products/breeze.jpg" },
  { name: "Champion", price: 14, img: "/products/champion.jpg" },
  { name: "Downy", price: 22, img: "/products/downy.jpg" },
  { name: "Wings", price: 13, img: "/products/wings.jpg" },
  { name: "Calla", price: 15, img: "/products/calla.webp" },
  { name: "Pride", price: 12, img: "/products/pride.jpg" },
];

export default function LaundrySoapPage() {
  return <ProductPage title="🧺 Laundry Soap" category="Personal Care" items={items} />;
}
