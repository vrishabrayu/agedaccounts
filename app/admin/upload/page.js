"use client";

import { useEffect, useMemo, useState } from "react";
import { PackagePlus, RefreshCw, UploadCloud, Trash2, Key } from "lucide-react";
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
};

export default function AdminUploadPage() {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Authentication State (In-memory token)
  const [adminToken, setAdminToken] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === form.productId),
    [form.productId, products]
  );

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  // 1. Password Verification Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      setAdminToken(data.token);
      // Immediately fetch products on successful login
      await fetchProducts(data.token);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  // 2. Fetch Products
  const fetchProducts = async (token = adminToken) => {
    if (!token) return;
    setLoadingProducts(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load products.");
      }

      setProducts(data.products || []);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoadingProducts(false);
    }
  };

  // 3. Fetch Accounts for Selected Product
  const fetchAccounts = async (productId) => {
    if (!productId || !adminToken) {
      setAccounts([]);
      return;
    }
    setLoadingAccounts(true);
    try {
      const res = await fetch(`/api/admin/accounts?productId=${productId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAccounts(data.accounts || []);
      } else {
        throw new Error(data.error || "Failed to load accounts.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  // Fetch accounts when product selection changes
  useEffect(() => {
    fetchAccounts(form.productId);
  }, [form.productId]);

  // 4. Delete / Disable Account
  const handleDeleteAccount = async (accountId) => {
    if (!window.confirm("Are you sure you want to disable this account? It will be soft-deleted (status = 'DISABLED').")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/accounts/${accountId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Deletion failed.");
      }
      setMessage({ type: "success", text: "Account disabled successfully." });
      // Refresh accounts and products
      await fetchAccounts(form.productId);
      await fetchProducts();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  // 5. Submit / Parse and Bulk Create Accounts
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage({ type: "error", text: "Choose a .txt stock file." });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // Step A: Parse .txt file in frontend
      const text = await file.text();
      const parsedAccounts = [];
      text.split(/\r?\n/).forEach((rawLine) => {
        const line = rawLine.trim();
        if (!line) return;
        const sepIndex = line.indexOf(":");
        if (sepIndex <= 0 || sepIndex === line.length - 1) return;
        const username = line.slice(0, sepIndex).trim();
        const password = line.slice(sepIndex + 1).trim();
        if (username && password) {
          parsedAccounts.push({ username, password });
        }
      });

      if (parsedAccounts.length === 0) {
        throw new Error("No valid username:password lines found in file.");
      }

      let activeProductId = form.productId;

      // Step B: Create product first if "new product" is selected
      if (!activeProductId) {
        const priceNum = Number(form.price);
        if (!form.name || !form.platform || !form.price || priceNum <= 0) {
          throw new Error("Name, platform, and valid price are required for new products.");
        }

        const productRes = await fetch("/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(form),
        });
        const productData = await productRes.json();
        if (!productRes.ok) {
          throw new Error(productData.error || "Failed to create product.");
        }
        activeProductId = productData.product.id;
      }

      // Step C: Bulk Create Accounts
      const bulkRes = await fetch("/api/admin/accounts/bulk-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          productId: activeProductId,
          accounts: parsedAccounts,
        }),
      });
      const bulkData = await bulkRes.json();
      if (!bulkRes.ok) {
        throw new Error(bulkData.error || "Bulk account upload failed.");
      }

      setMessage({
        type: "success",
        text: `Successfully uploaded ${bulkData.count} accounts.`,
      });

      // Clear file and form state (except auth)
      setFile(null);
      setForm({
        ...emptyForm,
        productId: activeProductId,
      });

      // Refresh list
      await fetchProducts();
      await fetchAccounts(activeProductId);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Render Login Popup overlay if not authenticated
  if (!adminToken) {
    return (
      <div className={styles.overlay}>
        <form className={styles.loginCard} onSubmit={handleLogin}>
          <h2>Admin Authorization</h2>
          <p className={styles.muted} style={{ fontSize: "0.8rem", margin: 0 }}>
            Enter the password specified in your server configuration to access the store dashboard.
          </p>
          <label className={styles.field} style={{ marginBottom: 0 }}>
            <span>Admin Password</span>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
            />
          </label>
          {loginError && <p className={styles.error} style={{ fontSize: "0.75rem", margin: 0, padding: "0.5rem", color: "#ef4444" }}>{loginError}</p>}
          <button className={styles.primaryButton} type="submit">
            <Key size={16} />
            <span>Verify Access</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ADMIN DASHBOARD</p>
          <h1>Product Stock Upload</h1>
        </div>
        <button className={styles.secondaryButton} onClick={() => fetchProducts()} disabled={loadingProducts}>
          <RefreshCw size={16} />
          <span>{loadingProducts ? "LOADING..." : "REFRESH PRODUCTS"}</span>
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
            <span>Select Product</span>
            <select value={form.productId} onChange={(event) => updateField("productId", event.target.value)}>
              <option value="">Create new product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.platform}) - {product.availableStock} available
                </option>
              ))}
            </select>
            {form.productId && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginTop: "0.25rem",
                  display: "inline-block"
                }}
                onClick={() => updateField("productId", "")}
              >
                Create a new product instead
              </span>
            )}
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
                <input value={form.niche} onChange={(event) => updateField("niche", event.target.value)} placeholder="Entertainment" />
              </label>

              <label className={styles.field}>
                <span>Followers</span>
                <input value={form.followers} onChange={(event) => updateField("followers", event.target.value)} placeholder="N/A" />
              </label>

              <label className={styles.field}>
                <span>Engagement</span>
                <input value={form.engagement} onChange={(event) => updateField("engagement", event.target.value)} placeholder="N/A" />
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
            <span>{submitting ? "UPLOADING..." : "UPLOAD STOCK"}</span>
          </button>
        </form>

        <aside className={styles.productsPanel}>
          <div className={styles.sectionTitle}>
            <span>Products Catalog</span>
          </div>
          {products.length === 0 ? (
            <p className={styles.muted}>No products configured yet.</p>
          ) : (
            <div className={styles.productList}>
              <button
                type="button"
                className={`${styles.productRow} ${!form.productId ? styles.activeRow : ""}`}
                style={{ fontWeight: "700", borderBottom: "2px solid var(--border)", background: "rgba(255, 255, 255, 0.05)", justifyContent: "center" }}
                onClick={() => updateField("productId", "")}
              >
                <span>+ CREATE NEW PRODUCT</span>
              </button>
              {products.map((product) => (
                <button
                  key={product.id}
                  className={`${styles.productRow} ${form.productId === product.id ? styles.activeRow : ""}`}
                  onClick={() => updateField("productId", product.id)}
                  type="button"
                >
                  <span>{product.name}</span>
                  <strong>{product.availableStock}</strong>
                </button>
              ))}
            </div>
          )}
        </aside>
      </section>

      {/* Account Listings & Deletion Panel */}
      {form.productId && (
        <section className={styles.accountsPanel}>
          <div className={styles.sectionTitle}>
            <span>Credentials in Stock</span>
          </div>
          {loadingAccounts ? (
            <p className={styles.muted}>Loading inventory accounts...</p>
          ) : accounts.length === 0 ? (
            <p className={styles.muted}>No accounts currently in stock for this product.</p>
          ) : (
            <div className={styles.accountsList}>
              {accounts.map((acc) => (
                <div key={acc._id} className={styles.accountItem}>
                  <div className={styles.accDetails}>
                    <span><strong>Username:</strong> {acc.username}</span>
                    <span><strong>Password:</strong> {acc.password}</span>
                    <span className={`${styles.accBadge} ${
                      acc.status === "AVAILABLE" ? styles.badgeAvailable :
                      acc.status === "SOLD" ? styles.badgeSold : styles.badgeDisabled
                    }`}>
                      {acc.status}
                    </span>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteAccount(acc._id)}
                    disabled={acc.status === "SOLD" || acc.status === "DISABLED"}
                  >
                    <Trash2 size={12} style={{ marginRight: "0.25rem", display: "inline-block", verticalAlign: "middle" }} />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}