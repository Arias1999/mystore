

"use client";

import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Contact Us</h1>
        <button onClick={() => router.push("/")} style={styles.btn}>
          Back Home
        </button>
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        <h2>Get in Touch</h2>

        <p><strong>Email:</strong> lyrastore@gmail.com</p>
        <p><strong>Phone:</strong> 0912-345-6789</p>
        <p><strong>Address:</strong> Alcoy Cebu, Philippines</p>

        <br />

        <h3>Send us a Message</h3>

        <input type="text" placeholder="Your Name" style={styles.input} />
        <input type="email" placeholder="Your Email" style={styles.input} />
        <textarea placeholder="Your Message" style={styles.textarea}></textarea>

        <button style={styles.sendBtn}>Send Message</button>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        <p>© 2026 LYRA’S STORE</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: "url('/background.jpg')",
    backgroundSize: "cover",
    position: "relative" as const,
    color: "white",
  },

  overlay: {
    position: "absolute" as const,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    position: "relative" as const,
    zIndex: 1,
  },

  title: {
    margin: 0,
  },

  btn: {
    padding: "8px 15px",
    background: "#2563eb",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  content: {
    padding: "40px",
    background: "rgba(255,255,255,0.9)",
    color: "black",
    margin: "40px",
    borderRadius: "10px",
    position: "relative" as const,
    zIndex: 1,
  },

  input: {
    display: "block",
    width: "100%",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  textarea: {
    display: "block",
    width: "100%",
    height: "100px",
    margin: "10px 0",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  sendBtn: {
    padding: "10px 20px",
    background: "#16a34a",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center" as const,
    padding: "10px",
    position: "relative" as const,
    zIndex: 1,
  },
};







