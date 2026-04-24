import ProductPage from "../ProductPageTemplate";

const items = [
  { name: "Datu Puti 250ml", price: 15, img: "/products/vinegar.webp" },
  { name: "Datu Puti 500ml", price: 25, img: "/products/vinegar.webp" },
  { name: "Sukang Iloko 250ml", price: 12, img: "/products/vinegar.webp" },
  { name: "Sukang Iloko 500ml", price: 20, img: "/products/vinegar.webp" },
];

export default function VinegarPage() {
  return <ProductPage title="🍶 Vinegar" category="Others" items={items} />;
}
