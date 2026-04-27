import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Knorr Sinigang Mix", price: 10, img: "/products/download.png" },
  { name: "Knorr Chicken Cube", price: 5, img: "/products/download.png" },
  { name: "Knorr Beef Cube", price: 5, img: "/products/download.png" },
];

export default function KnorrPage() {
  return <ProductPage title="🍲 Knorr" category="Others" items={items} />;
}
