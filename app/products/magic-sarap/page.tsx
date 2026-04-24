import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Magic Sarap 8g", price: 5, img: "/products/magic-sarap.webp" },
  { name: "Magic Sarap 18g", price: 10, img: "/products/magic-sarap.webp" },
  { name: "Magic Sarap 40g", price: 20, img: "/products/magic-sarap.webp" },
  { name: "Magic Sarap 100g", price: 45, img: "/products/magic-sarap.webp" },
];

export default function MagicSarapPage() {
  return <ProductPage title="✨ Magic Sarap" category="Others" items={items} />;
}
