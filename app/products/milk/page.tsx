import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Bear brand", price: 60, img: "/products/milk.webp" },
  { name: "Chocolate Milk", price: 65, img: "/products/milk.jpg" },
  { name: "Energen", price: 15, img: "/products/milk.jpg" },
  { name: "Milo", price: 18, img: "/products/milk.jpg" },
  { name: "Alaska", price: 20, img: "/products/milk.jpg" },
  { name: "Tablea", price: 25, img: "/products/milk.jpg" },
  { name: "Nescafe Stick", price: 8, img: "/products/milk.jpg" },
];

export default function MilkPage() {
  return <ProductPage title="🥛 Milk" category="Dairy" items={items} />;
}
