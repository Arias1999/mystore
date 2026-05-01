import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Skyflakes", price: 15, img: "/products/skyflakes.jpg" },
  { name: "Rebisco", price: 12, img: "/products/rebisco.webp" },
  { name: "Fita", price: 14, img: "/products/fita.jpg" },
  { name: "Hansel", price: 13, img: "/products/hansel.jpg" },
  { name: "Bingo", price: 12, img: "/products/bingo.jpg" },
  { name: "CalCheese", price: 18, img: "/products/cheese.webp" },
  { name: "Cream-O", price: 15, img: "/products/cream.jpg" },
 
  { name: "Oreo", price: 30, img: "/products/oreo.jpg" },
];

export default function BiscuitsPage() {
  return <ProductPage title="🍪 Biscuits" category="Snacks" items={items} />;
}
