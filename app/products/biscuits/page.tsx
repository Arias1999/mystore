import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Skyflakes", price: 15, img: "/products/biscuits.jpg" },
  { name: "Rebisco", price: 12, img: "/products/biscuits.jpg" },
  { name: "Fita", price: 14, img: "/products/biscuits.jpg" },
  { name: "Hansel", price: 13, img: "/products/biscuits.jpg" },
  { name: "Bingo", price: 12, img: "/products/biscuits.jpg" },
  { name: "CalCheese", price: 18, img: "/products/biscuits.jpg" },
  { name: "Cream-O", price: 15, img: "/products/biscuits.jpg" },
  { name: "Chips Ahoy", price: 35, img: "/products/biscuits.jpg" },
  { name: "Oreo", price: 30, img: "/products/biscuits.jpg" },
];

export default function BiscuitsPage() {
  return <ProductPage title="🍪 Biscuits" category="Snacks" items={items} />;
}
