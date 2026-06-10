"use client";

import { useEffect, useMemo, useState } from "react";
import { PackagePlus, RefreshCw, UploadCloud } from "lucide-react";
import { PLATFORMS } from "../../../data/platforms";
import styles from "./upload.module.css";

const emptyForm = {
  productId: "",
  name: "",
  platform: "",
  niche: "",
  followers: "",
  engagement: "",
  description: "",
  price: "",
  imageUrl: "",
  adminPassword: "",
};

export default function AdminUploadPage() {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === form.productId),
    [form.productId, products]
  );

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const fetchProducts = async () => {
    if (!form.adminPassword) {
      setMessage({ type: "error", text: "Enter the admin password first." });
      return;
    }

    setLoadingProducts(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/products", {
        headers: { "x-admin-password": form.adminPassword },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load products.");
      }

      setProducts(data.products || []);
      setMessage({ type: "success", text: "Products loaded." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const savedPassword = window.localStorage.getItem("fastaccounts-admin-password");
    if (savedPassword) {
      setForm((current) => ({ ...current, adminPassword: savedPassword }));
    }
  }, []);

  useEffect(() => {
    if (form.adminPassword) {
      window.localStorage.setItem("fastaccounts-admin-password", form.adminPassword);
    }
  }, [form.adminPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage({ type: "error", text: "Choose a .txt stock file." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    payload.append("stockFile", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: payload,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setMessage({
        type: "success",
        text: "Added " + data.added + " credentials. Stock is now " + data.availableStock + ". Invalid lines: " + data.invalidCount + ".",
      });
      setFile(null);
      setForm((current) => ({
        ...current,
        productId: data.productId,
        name: "",
        platform: "",
        niche: "",
        followers: "",
        engagement: "",
        description: "",
        price: "",
        imageUrl: "",
      }));
      await fetchProducts();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ADMIN</p>
          <h1>Product Stock Upload</h1>
        </div>
        <button className={styles.secondaryButton} onClick={fetchProducts} disabled={loadingProducts}>
          <RefreshCw size={16} />
          <span>{loadingProducts ? "LOADING" : "REFRESH PRODUCTS"}</span>
        </button>
      </section>

      {message && (
        <div className={`${styles.notice} ${message.type === "error" ? styles.error : styles.success}`}>
          {message.text}
        </div>
      )}

      <section className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.sectionTitle}>
            <PackagePlus size={18} />
            <span>Product</span>
          </div>

          <label className={styles.field}>
            <span>Admin Password</span>
            <input type="password" value={form.adminPassword} onChange={(event) => updateField("adminPassword", event.target.value)} placeholder="Set in .env" required />
          </label>

          <label className={styles.field}>
            <span>Use Existing Product</span>
            <select value={form.productId} onChange={(event) => updateField("productId", event.target.value)}>
              <option value="">Create new product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.platform} - {product.availableStock} available
                </option>
              ))}
            </select>
          </label>

          {!form.productId && (
            <div className={styles.gridFields}>
              <label className={styles.field}>
                <span>Product Name</span>
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Netflix Premium" />
              </label>

              <label className={styles.field}>
                <span>Platform</span>
                <select
                  value={form.platform}
                  onChange={(event) => updateField("platform", event.target.value)}
                  required
                >
                  <option value="">Select platform</option>
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span>Niche</span>
                <input value={form.niche} onChange={(event) => updateField("niche", event.target.value)} placeholder="Fitness" />
              </label>

              <label className={styles.field}>
                <span>Followers</span>
                <input value={form.followers} onChange={(event) => updateField("followers", event.target.value)} placeholder="125k" />
              </label>

              <label className={styles.field}>
                <span>Engagement</span>
                <input value={form.engagement} onChange={(event) => updateField("engagement", event.target.value)} placeholder="4.2%" />
              </label>

              <label className={styles.field}>
                <span>Price USD</span>
                <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField("price", event.target.value)} placeholder="9.99" />
              </label>

              <label className={`${styles.field} ${styles.fullWidth}`}>
                <span>Description</span>
                <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Short product description" rows={3} />
              </label>

              <label className={`${styles.field} ${styles.fullWidth}`}>
                <span>Image URL</span>
                <input value={form.imageUrl} onChange={(event) => updateField("imageUrl", event.target.value)} placeholder="https://..." />
              </label>
            </div>
          )}

          {selectedProduct && (
            <div className={styles.selectedProduct}>
              <strong>{selectedProduct.name}</strong>
              <span>{selectedProduct.availableStock} credentials available</span>
            </div>
          )}

          <label className={styles.dropzone}>
            <UploadCloud size={28} />
            <span>{file ? file.name : "Choose .txt stock file"}</span>
            <input type="file" accept=".txt,text/plain" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>

          <button className={styles.primaryButton} type="submit" disabled={submitting}>
            <UploadCloud size={16} />
            <span>{submitting ? "UPLOADING" : "UPLOAD STOCK"}</span>
          </button>
        </form>

        <aside className={styles.productsPanel}>
          <div className={styles.sectionTitle}>
            <span>Products</span>
          </div>
          {products.length === 0 ? (
            <p className={styles.muted}>Enter admin password and refresh products.</p>
          ) : (
            <div className={styles.productList}>
              {products.map((product) => (
                <button key={product.id} className={styles.productRow} onClick={() => updateField("productId", product.id)} type="button">
                  <span>{product.name}</span>
                  <strong>{product.availableStock}</strong>
                </button>
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}