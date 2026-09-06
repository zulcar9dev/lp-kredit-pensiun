"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
  CircleNotch,
} from "@phosphor-icons/react/dist/ssr";
import {
  fetchBankProducts,
  createBankProduct,
  updateBankProduct,
  deleteBankProduct,
  type BankProductRow,
} from "@/lib/actions/bank-products";
import { ImageUploadField } from "@/components/image-upload-field";

const EMPTY_FORM = {
  bank_name: "",
  product_name: "",
  plafon_min: 0,
  plafon_max: 0,
  bunga_indikatif: 0,
  tenor_min: 12,
  tenor_max: 60,
  notes: "",
  logo_url: "",
  logo_key: "",
  display_order: 0,
  is_active: true,
};

export default function AdminBankProductsPage() {
  const [products, setProducts] = useState<BankProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<BankProductRow | null>(null);
  const [selected, setSelected] = useState<BankProductRow | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await fetchBankProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function openAdd() {
    setEditing(null);
    setFormData({
      ...EMPTY_FORM,
      display_order: products.length + 1,
    });
    setShowModal(true);
  }

  function openEdit(item: BankProductRow) {
    setEditing(item);
    setFormData({
      bank_name: item.bank_name,
      product_name: item.product_name ?? "",
      plafon_min: item.plafon_min ?? 0,
      plafon_max: item.plafon_max ?? 0,
      bunga_indikatif: item.bunga_indikatif ?? 0,
      tenor_min: item.tenor_min ?? 12,
      tenor_max: item.tenor_max ?? 60,
      notes: item.notes ?? "",
      logo_url: item.logo_url ?? "",
      logo_key: item.logo_key ?? "",
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setShowModal(true);
  }

  function openDelete(item: BankProductRow) {
    setSelected(item);
    setShowDelete(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      const result = await updateBankProduct(editing.id, {
        bank_name: formData.bank_name,
        product_name: formData.product_name || null,
        plafon_min: formData.plafon_min ?? null,
        plafon_max: formData.plafon_max ?? null,
        bunga_indikatif: formData.bunga_indikatif ?? null,
        tenor_min: formData.tenor_min ?? null,
        tenor_max: formData.tenor_max ?? null,
        notes: formData.notes || null,
        logo_url: formData.logo_url || null,
        logo_key: formData.logo_key || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
      });
      setSaving(false);
      if (result.ok) {
        loadProducts();
        setShowModal(false);
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    } else {
      const result = await createBankProduct({
        bank_name: formData.bank_name,
        product_name: formData.product_name || null,
        plafon_min: formData.plafon_min ?? null,
        plafon_max: formData.plafon_max ?? null,
        bunga_indikatif: formData.bunga_indikatif ?? null,
        tenor_min: formData.tenor_min ?? null,
        tenor_max: formData.tenor_max ?? null,
        notes: formData.notes || null,
        logo_url: formData.logo_url || null,
        logo_key: formData.logo_key || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
      });
      setSaving(false);
      if (result.ok) {
        loadProducts();
        setShowModal(false);
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setSaving(true);
    const result = await deleteBankProduct(selected.id);
    setSaving(false);
    if (result.ok) {
      loadProducts();
    } else {
      alert("Gagal menghapus: " + result.error);
    }
    setShowDelete(false);
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= products.length) return;

    const updated = [...products];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];

    await Promise.all(
      updated.map((p, i) =>
        updateBankProduct(p.id, { display_order: i + 1 })
      )
    );

    loadProducts();
  }

  function formatRupiah(n: number | null) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n ?? 0);
  }

  function updateField(field: string, value: string | number | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      <div className="page-header">
        <h1>Bank & Produk</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus weight="bold" />
          Tambah Produk
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Bank</th>
                <th>Produk</th>
                <th>Plafon</th>
                <th>Bunga</th>
                <th>Tenor</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <CircleNotch weight="bold" className="animate-spin" />
                      <p>Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <p>Belum ada produk bank</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="table-link">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {item.logo_url ? (
                          <img
                            src={item.logo_url}
                            alt={`Logo ${item.bank_name}`}
                            style={{ width: 32, height: 32, borderRadius: 6, objectFit: "contain", border: "1px solid var(--border)" }}
                          />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--navy-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--navy-700)" }}>
                            {item.bank_name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        {item.bank_name}
                      </div>
                    </td>
                    <td>{item.product_name}</td>
                    <td>
                      {formatRupiah(item.plafon_min)} -{" "}
                      {formatRupiah(item.plafon_max)}
                    </td>
                    <td>{item.bunga_indikatif}%</td>
                    <td>
                      {item.tenor_min}-{item.tenor_max} bln
                    </td>
                    <td>
                      <span
                        className={`badge badge-${item.is_active ? "active" : "inactive"}`}
                      >
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions justify-end">
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => moveItem(item.id, "up")}
                          disabled={idx === 0}
                          title="Naik"
                        >
                          <ArrowUp weight="bold" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => moveItem(item.id, "down")}
                          disabled={idx === products.length - 1}
                          title="Turun"
                        >
                          <ArrowDown weight="bold" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => openEdit(item)}
                          title="Edit"
                        >
                          <PencilSimple weight="bold" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => openDelete(item)}
                          title="Hapus"
                          style={{ color: "var(--red-500)" }}
                        >
                          <Trash weight="bold" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? "Edit Produk" : "Tambah Produk Baru"}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X weight="bold" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nama Bank</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.bank_name}
                    onChange={(e) => updateField("bank_name", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Produk</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.product_name}
                    onChange={(e) =>
                      updateField("product_name", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Plafon Minimum</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.plafon_min}
                    onChange={(e) =>
                      updateField("plafon_min", Number(e.target.value))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Plafon Maksimum</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.plafon_max}
                    onChange={(e) =>
                      updateField("plafon_max", Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Bunga Indikatif (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.bunga_indikatif}
                    onChange={(e) =>
                      updateField(
                        "bunga_indikatif",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Urutan Tampil</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.display_order}
                    onChange={(e) =>
                      updateField("display_order", Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tenor Minimum (bulan)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.tenor_min}
                    onChange={(e) =>
                      updateField("tenor_min", Number(e.target.value))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tenor Maksimum (bulan)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.tenor_max}
                    onChange={(e) =>
                      updateField("tenor_max", Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Catatan</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Logo (opsional)</label>
                <ImageUploadField
                  url={formData.logo_url}
                  folder="bank-logos"
                  maxSizeMB={1}
                  hint="JPG/PNG/WebP, maksimal 1MB. Kosongkan jika tidak ada."
                  onChange={(v) => {
                    updateField("logo_url", v?.url ?? "");
                    updateField("logo_key", v?.key ?? "");
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-check">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      updateField("is_active", e.target.checked)
                    }
                  />
                  Aktif
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <CircleNotch weight="bold" className="animate-spin" />
                ) : editing ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Produk"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && selected && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hapus Produk</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowDelete(false)}
              >
                <X weight="bold" />
              </button>
            </div>
            <div className="modal-body">
              <p className="text-sm">
                Yakin ingin menghapus produk{" "}
                <strong>{selected.product_name}</strong> dari{" "}
                <strong>{selected.bank_name}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDelete(false)}
                disabled={saving}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? (
                  <CircleNotch weight="bold" className="animate-spin" />
                ) : (
                  <>
                    <Trash weight="bold" />
                    Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
