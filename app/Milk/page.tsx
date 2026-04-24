"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  name: string;
  price: number;
  img: string;
};

const milkProducts: Product[] = [
  { name: "Fresh Milk", price: 60, img: "/products/milk.jpg" },
  { name: "Chocolate Milk", price: 65, img: "/products/milk.jpg" },
  { name: "Evaporated Milk", price: 50, img: "/products/milk.jpg" },
  { name: "Powdered Milk", price: 70, img: "/products/milk.jpg" },
];

export default function MilkPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [qty, setQty] = useState<{ [key: number]: number }>({});
  const router = useRouter();

  const addToCart = (product: Product, index: number) => {
    const isAuth = localStorage.getItem("auth");

    if (!isAuth) {
      alert("Please login first!");
      router.push("/login");
      return;
    }

    const quantity = qty[index] || 1;

    setCart([...cart, { ...product, qty: quantity }]);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div style={{ display: "flex" }}>

      {/* MILK PRODUCTS */}
      <div style={{ width: "70%" }}>
        <h1>🥛 Milk Products</h1>

        <div style={styles.grid}>
          {milkProducts.map((p, i) => (
            <div key={i} style={styles.card}>
              <h3>{p.name}</h3>
              <img src={p.img} width={120} />
              <p>₱{p.price}</p>

              <input
                type="number"
                min="1"
                value={qty[i] || 1}
                onChange={(e) =>
                  setQty({ ...qty, [i]: Number(e.target.value) })
                }
              />

              <br /><br />

              <button onClick={() => addToCart(p, i)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CART */}
      <div style={styles.cart}>
        <h2>🛒 Cart</h2>

        {cart.map((item, i) => (
          <p key={i}>
            {item.name} (x{item.qty}) - ₱{item.price * item.qty}
          </p>
        ))}

        <hr />
        <h3>Total: ₱{total}</h3>

        <button onClick={() => alert("Order placed!")}>
          Place Order
        </button>
      </div>

    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  card: {
    textAlign: "center" as const,
    padding: "10px",
    background: "#eee",
  },
  cart: {
    width: "30%",
    padding: "20px",
    background: "#f4f4f4",
  },
};


















