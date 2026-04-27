import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Cornstarch 100g", price: 15, img: "/products/download.png" },
  { name: "Cornstarch 200g", price: 28, img: "/products/download.png" },
];

export default function CornstarchPage() {
  return <ProductPage title="🌽 Cornstarch" category="Others" items={items} />;
}
