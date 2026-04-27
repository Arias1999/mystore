import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Ariel", price: 20, img: "/products/laundry-soap.jpg" },
  { name: "Tide", price: 18, img: "/products/laundry-soap.jpg" },
  { name: "Surf", price: 15, img: "/products/laundry-soap.jpg" },
  { name: "Breeze", price: 16, img: "/products/laundry-soap.jpg" },
  { name: "Champion", price: 14, img: "/products/laundry-soap.jpg" },
  { name: "Downy", price: 22, img: "/products/laundry-soap.jpg" },
  { name: "Wings", price: 13, img: "/products/laundry-soap.jpg" },
  { name: "Calla", price: 15, img: "/products/laundry-soap.jpg" },
  { name: "Pride", price: 12, img: "/products/laundry-soap.jpg" },
];

export default function LaundrySoapPage() {
  return <ProductPage title="🧺 Laundry Soap" category="Personal Care" items={items} />;
}
