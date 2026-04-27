import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Head & Shoulders", price: 45, img: "/products/shampoo.jpg" },
  { name: "Pantene", price: 42, img: "/products/shampoo.jpg" },
  { name: "Sunsilk", price: 38, img: "/products/shampoo.jpg" },
  { name: "Rejoice", price: 35, img: "/products/shampoo.jpg" },
  { name: "Palmolive", price: 38, img: "/products/shampoo.jpg" },
  { name: "Keratin Empress", price: 55, img: "/products/shampoo.jpg" },
  { name: "Dove", price: 48, img: "/products/shampoo.jpg" },
];

export default function ShampooPage() {
  return <ProductPage title="🧴 Shampoo" category="Personal Care" items={items} />;
}
