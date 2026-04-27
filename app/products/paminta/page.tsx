import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Black Pepper Sachet", price: 8, img: "/products/download.png" },
  { name: "White Pepper Sachet", price: 8, img: "/products/download.png" },
];

export default function PamintaPage() {
  return <ProductPage title="🌶️ Paminta" category="Others" items={items} />;
}
