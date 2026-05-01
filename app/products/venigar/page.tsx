import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Datu Puti Sachet", price: 5, img: "/products/puti.webp" },
  { name: "Silver Swan Sachet", price: 5, img: "/products/silver.webp" },
];

export default function VinegarPage() {
  return <ProductPage title="Vinegar" category="Others" items={items} />;
}
