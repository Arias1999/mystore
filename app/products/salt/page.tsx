import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Iodized Salt 250g", price: 10, img: "/products/salt.jpg" },
  { name: "Iodized Salt 500g", price: 18, img: "/products/salt.jpg" },
  { name: "Rock Salt 250g", price: 8, img: "/products/salt.jpg" },
  { name: "Rock Salt 500g", price: 15, img: "/products/salt.jpg" },
];

export default function SaltPage() {
  return <ProductPage title="🧂 Salt" category="Others" items={items} />;
}
