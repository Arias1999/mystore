import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Head & Shoulders", price: 8, img: "/products/head-shoulders.jpg" },
  { name: "Pantene", price: 42, img: "/products/panteen.jpg" },
  { name: "Sunsilk-green", price: 8, img: "/products/sunslik-green.jpg" },
  { name: "Rejoice", price: 8, img: "/products/rejoice.webp" },
  { name: "Palmolive", price: 8, img: "/products/palmolive.jpg" },
  { name: "Keratin Empress", price: 10, img: "/products/keratin.jpg" },
  { name: "Sunsilk-orange", price: 8, img: "/products/sunsilk-orange.jpg" },
  { name: "Sunsilk-pink", price: 8, img: "/products/sunsilk-pink.jpg" },
  { name: "Dove", price: 8, img: "/products/dove.jpg" },
];

export default function ShampooPage() {
  return <ProductPage title="🧴 Shampoo" category="Personal Care" items={items} />;
}
