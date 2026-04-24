import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Ariel", price: 20, img: "/products/laundry-soap.jpg" },
  { name: "Tide", price: 18, img: "/products/laundry-soap.jpg" },
  { name: "Surf", price: 15, img: "/products/laundry-soap.jpg" },
  { name: "Breeze", price: 16, img: "/products/laundry-soap.jpg" },
];

export default function LaundrySoapPage() {
  return <ProductPage title="🧺 Laundry Soap" category="Personal Care" items={items} />;
}
