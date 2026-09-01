"use client";

import { useState } from "react";
import {
  MOCK_BANK_PRODUCTS,
  type BankProduct,
} from "@/lib/admin-data";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
} from "@phosphor-icons/react/dist/ssr";

const EMPTY_FORM: Omit<BankProduct, "id"> = {
  bankName: "",
  productName: "",
  plafonMin: 0,
  plafonMax: 0,
  bungaIndikatif: 0,
  tenorMin: 12,
  tenorMax: 60,
  logoUrl: "",
  displayOrder: 0,
  isActive: true,
};

export default function AdminBankProductsPage() {
  const [products, setProducts] =
    useState<BankProduct[]>(MOCK_BANK_PRODUCTS);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<BankProduct | null>(null);
  const [selected, setSelected] = useState<BankProduct | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  function openAdd() {
    setEditing(null);
    setFormData({
      ...EMPTY_FORM,
      displayOrder: products.length + 1,
    });
    setShowModal(true);
  }

  function openEdit(item: BankProduct) {
    setEditing(item);
    setFormData({
      bankName: item.bankName,
      productName: item.productName,
      plafonMin: item.plafonMin,
      plafonMax: item.plafonMax,
      bungaIndikatif: item.bungaIndikatif,
      tenorMin: item.tenorMin,
      tenorMax: item.tenorMax,
      logoUrl: item.logoUrl,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
    setShowModal(true);
  }

  function openDelete(item: BankProduct) {
    setSelected(item);
    setShowDelete(true);
  }

  function handleSave() {
    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...formData } : p))
      );
    } else {
      const newItem: BankProduct = {
        ...formData,
        id: `bp-${Date.now()}`,
      };
      setProducts((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  }

  function handleDelete() {
    if (selected) {
      setProducts((prev) => prev.filter((p) => p.id !== selected.id));
    }
    setShowDelete(false);
  }

  function moveItem(id: string, direction: "up" | "down") {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
      return updated.map((p, i) => ({ ...p, displayOrder: i + 1 }));
    });
  }

  function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);
  }

  function updateField(
    field: keyof typeof formData,
    value: string | number | boolean
  ) {
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
              {products.map((item, idx) => (
                <tr key={item.id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td className="table-link">{item.bankName}</td>
                  <td>{item.productName}</td>
                  <td>
                    {formatRupiah(item.plafonMin)} -{" "}
                    {formatRupiah(item.plafonMax)}
                  </td>
                  <td>{item.bungaIndikatif}%</td>
                  <td>
                    {item.tenorMin}-{item.tenorMax} bln
                  </td>
                  <td>
                    <span
                      className={`badge badge-${item.isActive ? "active" : "inactive"}`}
                    >
                      {item.isActive ? "Aktif" : "Nonaktif"}
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
              ))}
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
                    value={formData.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Produk</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.productName}
                    onChange={(e) =>
                      updateField("productName", e.target.value)
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
                    value={formData.plafonMin}
                    onChange={(e) =>
                      updateField("plafonMin", Number(e.target.value))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Plafon Maksimum</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.plafonMax}
                    onChange={(e) =>
                      updateField("plafonMax", Number(e.target.value))
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
                    value={formData.bungaIndikatif}
                    onChange={(e) =>
                      updateField(
                        "bungaIndikatif",
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
                    value={formData.displayOrder}
                    onChange={(e) =>
                      updateField("displayOrder", Number(e.target.value))
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
                    value={formData.tenorMin}
                    onChange={(e) =>
                      updateField("tenorMin", Number(e.target.value))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tenor Maksimum (bulan)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.tenorMax}
                    onChange={(e) =>
                      updateField("tenorMax", Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-check">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      updateField("isActive", e.target.checked)
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
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                {editing ? "Simpan Perubahan" : "Tambah Produk"}
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
                <strong>{selected.productName}</strong> dari{" "}
                <strong>{selected.bankName}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDelete(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                <Trash weight="bold" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
