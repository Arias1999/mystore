import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Datu Puti Patis Sachet", price: 5, img: "/products/download.png" },
  { name: "Silver Swan Patis Sachet", price: 5, img: "/products/download.png" },
  { name: "Rufina Patis 350ml", price: 45, img: "/products/download.png" },
];

export default function PatisPage() {
  return <ProductPage title="🫙 Patis" category="Others" items={items} />;
}
