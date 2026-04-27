import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Small Egg", price: 8, img: "/products/eggs.jpg" },
  { name: "Large Egg", price: 12, img: "/products/eggs.jpg" },
];

export default function EggsPage() {
  return <ProductPage title="🥚 Eggs" category="Fresh Produce" items={items} />;
}
