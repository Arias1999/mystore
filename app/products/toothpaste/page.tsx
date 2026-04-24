import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Colgate", price: 35, img: "/products/toothpaste.jpg" },
  { name: "Close Up", price: 30, img: "/products/toothpaste.jpg" },
  { name: "Hapee", price: 25, img: "/products/toothpaste.jpg" },
  { name: "Sensodyne", price: 55, img: "/products/toothpaste.jpg" },
];

export default function ToothpastePage() {
  return <ProductPage title="🪥 Toothpaste" category="Personal Care" items={items} />;
}
