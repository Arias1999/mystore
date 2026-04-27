import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Magic Sarap 8g", price: 5, img: "/products/magic-sarap.webp" },
];

export default function MagicSarapPage() {
  return <ProductPage title="✨ Magic Sarap" category="Others" items={items} />;
}
