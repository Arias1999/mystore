import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Knorr Sinigang sa Sampalok", price: 12, img: "/products/download.png" },
  { name: "Mama Sita's Sinigang Mix", price: 10, img: "/products/download.png" },
  { name: "Maggi Sinigang Mix", price: 10, img: "/products/download.png" },
];

export default function SinigangPage() {
  return <ProductPage title="🍜 Sinigang Mix" category="Others" items={items} />;
}
