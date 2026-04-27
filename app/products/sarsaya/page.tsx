import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Sarsaya Oyster Sauce 30ml", price: 10, img: "/products/download.png" },
  { name: "Sarsaya Oyster Sauce 60ml", price: 18, img: "/products/download.png" },
  { name: "Sarsaya Oyster Sauce 250ml", price: 55, img: "/products/download.png" },
];

export default function SarsayaPage() {
  return <ProductPage title="🥫 Sarsaya" category="Others" items={items} />;
}
