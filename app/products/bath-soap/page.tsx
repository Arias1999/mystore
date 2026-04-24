import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Safeguard", price: 25, img: "/products/bath-soap.jpg" },
  { name: "Dove", price: 30, img: "/products/bath-soap.jpg" },
  { name: "Palmolive", price: 22, img: "/products/bath-soap.jpg" },
  { name: "Lifebuoy", price: 20, img: "/products/bath-soap.jpg" },
];

export default function BathSoapPage() {
  return <ProductPage title="🧼 Bath Soap" category="Personal Care" items={items} />;
}
