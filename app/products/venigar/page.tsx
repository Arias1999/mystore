import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Datu Puti Sachet", price: 5, img: "/products/Vinegar.webp" },
  { name: "Silver Swan Sachet", price: 5, img: "/products/Vinegar.webp" },
];

export default function VinegarPage() {
  return <ProductPage title="Vinegar" category="Others" items={items} />;
}
