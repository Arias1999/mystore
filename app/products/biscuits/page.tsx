import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Skyflakes", price: 15, img: "/products/biscuits.jpg" },
  { name: "Rebisco", price: 12, img: "/products/biscuits.jpg" },
  { name: "Fita", price: 14, img: "/products/biscuits.jpg" },
  { name: "Hansel", price: 13, img: "/products/biscuits.jpg" },
];

export default function BiscuitsPage() {
  return <ProductPage title="🍪 Biscuits" category="Snacks" items={items} />;
}
