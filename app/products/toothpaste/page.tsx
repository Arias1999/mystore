import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Colgate", price: 10, img: "/products/colgate.jpg" },
  { name: "Close Up", price: 10, img: "/products/closse-up.webp" },
  { name: "Hapee", price: 10, img: "/products/hapee.webp" },
  { name: "Sensodyne", price: 25, img: "/products/sensodyne.jpg" },
];

export default function ToothpastePage() {
  return <ProductPage title="🪥 Toothpaste" category="Personal Care" items={items} />;
}
