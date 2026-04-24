import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Fresh Milk", price: 60, img: "/products/milk.jpg" },
  { name: "Chocolate Milk", price: 65, img: "/products/milk.jpg" },
  { name: "Evaporated Milk", price: 50, img: "/products/milk.jpg" },
  { name: "Powdered Milk", price: 70, img: "/products/milk.jpg" },
];

export default function MilkPage() {
  return <ProductPage title="🥛 Milk" category="Dairy" items={items} />;
}
