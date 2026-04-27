import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Iodized Salt Sachet", price: 3, img: "/products/salt.jpg" },
  { name: "Non-Iodized Salt Sachet", price: 3, img: "/products/salt.jpg" },
];

export default function SaltPage() {
  return <ProductPage title="🧂 Salt" category="Others" items={items} />;
}
