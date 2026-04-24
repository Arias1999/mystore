import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Head & Shoulders", price: 45, img: "/products/shampoo.jpg" },
  { name: "Pantene", price: 42, img: "/products/shampoo.jpg" },
  { name: "Sunsilk", price: 38, img: "/products/shampoo.jpg" },
  { name: "Rejoice", price: 35, img: "/products/shampoo.jpg" },
];

export default function ShampooPage() {
  return <ProductPage title="🧴 Shampoo" category="Personal Care" items={items} />;
}
