import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Datu Puti Sachet", price: 5, img: "/products/vinegar.webp" },
  { name: "Silver Swan Sachet", price: 5, img: "/products/vinegar.webp" },
];

export default function VinegarPage() {
  return <ProductPage title="🍶 Vinegar" category="Others" items={items} />;
}
