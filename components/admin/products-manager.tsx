"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { ErrorState } from "@/components/admin/error-state";
import { LoadingState } from "@/components/admin/loading-state";
import { Pagination } from "@/components/admin/pagination";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];

const emptyForm = {
  name: "",
  price: 0,
  stock: 0,
  category: "",
  image_url: "",
};

const PAGE_SIZE = 8;

export function ProductsManager() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setProducts(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => void fetchProducts())
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [fetchProducts, supabase]);

  const categories = useMemo(() => {
    return ["all", ...new Set(products.map((product) => product.category))];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setIsModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image_url: product.image_url ?? "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  }

  async function saveProduct() {
    setSaving(true);
    setError("");

    let imageUrl = form.image_url || null;

    if (imageFile) {
      const imageName = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(imageName, imageFile, { upsert: true });

      if (uploadError) {
        toast.error(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(imageName);
      imageUrl = data.publicUrl;
    }

    if (editing) {
      const { error: updateError } = await supabase
        .from("products")
        .update({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          category: form.category,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editing.id);

      if (updateError) {
        toast.error(updateError.message);
        setSaving(false);
        return;
      }

      toast.success("Product updated.");
    } else {
      const { error: insertError } = await supabase.from("products").insert({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        image_url: imageUrl,
      });

      if (insertError) {
        toast.error(insertError.message);
        setSaving(false);
        return;
      }

      toast.success("Product created.");
    }

    setSaving(false);
    setIsModalOpen(false);
    await fetchProducts();
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    const { error: deleteError } = await supabase.from("products").delete().eq("id", id);

    if (deleteError) {
      toast.error(deleteError.message);
      return;
    }

    toast.success("Product deleted.");
    await fetchProducts();
  }

  if (loading) return <LoadingState label="Loading products..." rows={6} />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search product name"
          className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--accent)]"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm outline-none"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All categories" : item}
            </option>
          ))}
        </select>
        <button
          onClick={openCreate}
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--accent)] px-4 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)]"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[var(--line)] bg-[var(--surface)]">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--surface-soft)] text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product) => (
              <tr key={product.id} className="border-b border-[var(--line)] last:border-b-0">
                <td className="px-4 py-3">
                  <img
                    src={product.image_url || "/vercel.svg"}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                </td>
                <td className="px-4 py-3 text-[var(--text)]">{product.name}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{product.category}</td>
                <td className="px-4 py-3 text-[var(--text)]">{formatCurrency(product.price)}</td>
                <td className="px-4 py-3 text-[var(--text)]">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="rounded-md border border-[var(--line)] p-2 text-[var(--text)] transition hover:bg-[var(--surface-soft)]"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-md border border-[var(--danger)]/35 p-2 text-[var(--danger)] transition hover:bg-[var(--danger)]/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[var(--text-muted)]">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-lg rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                {editing ? "Edit Product" : "Add Product"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border border-[var(--line)] p-2"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid gap-3">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Name"
                className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="number"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
                placeholder="Price"
                className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="number"
                value={form.stock}
                onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
                placeholder="Stock"
                className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                placeholder="Category"
                className="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2 text-sm"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveProduct}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
