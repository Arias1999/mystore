import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Bear brand", price: 60, img: "/products/milk.webp" },
  { name: "Chocolate Milk", price: 65, img: "/products/choco.jpg" },
  { name: "Energen", price: 15, img: "/products/energen.jpg" },
  { name: "Milo", price: 18, img: "/products/milo.jpg" },
  { name: "Alaska", price: 20, img: "/products/alaska.jpg" },
  { name: "Tablea", price: 25, img: "/products/tablea.jpg" },
  { name: "Nescafe Stick", price: 8, img: "/products/nescafe.jpg" },
];

export default function MilkPage() {
  return <ProductPage title="🥛 Milk" category="Milk" items={items} />;
}
