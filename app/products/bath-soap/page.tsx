import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Safeguard", price: 25, img: "/products/safeguard.jpg" },
  { name: "Dove", price: 30, img: "/products/dove.webp" },
  { name: "Palmolive", price: 22, img: "/products/palmolive-soap.jpg" },
  { name: "Bioderm", price: 18, img: "/products/bioderm.jpg" },
  { name: "Silka", price: 22, img: "/products/silka.jpg" },
];

export default function BathSoapPage() {
  return <ProductPage title="🧼 Bath Soap" category="Personal Care" items={items} />;
}
