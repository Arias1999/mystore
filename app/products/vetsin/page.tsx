import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Ajinomoto 11g", price: 5, img: "/products/vetsin.jpg" },
  { name: "Ajinomoto 22g", price: 10, img: "/products/vetsin.jpg" },
  { name: "Ajinomoto 44g", price: 18, img: "/products/vetsin.jpg" },
  { name: "Ajinomoto 100g", price: 35, img: "/products/vetsin.jpg" },
];

export default function VetsinPage() {
  return <ProductPage title="🫙 Vetsin" category="Others" items={items} />;
}
