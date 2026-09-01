"use client";

import { useState } from "react";
import {
  MOCK_TESTIMONIALS,
  type Testimonial,
} from "@/lib/admin-data";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
  Star,
} from "@phosphor-icons/react/dist/ssr";

const EMPTY_FORM: Omit<Testimonial, "id"> = {
  name: "",
  pensionType: "PNS",
  content: "",
  photoUrl: "",
  rating: 5,
  isFeatured: false,
  displayOrder: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(MOCK_TESTIMONIALS);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  function openAdd() {
    setEditing(null);
    setFormData({
      ...EMPTY_FORM,
      displayOrder: testimonials.length + 1,
    });
    setShowModal(true);
  }

  function openEdit(item: Testimonial) {
    setEditing(item);
    setFormData({
      name: item.name,
      pensionType: item.pensionType,
      content: item.content,
      photoUrl: item.photoUrl,
      rating: item.rating,
      isFeatured: item.isFeatured,
      displayOrder: item.displayOrder,
    });
    setShowModal(true);
  }

  function openDelete(item: Testimonial) {
    setSelected(item);
    setShowDelete(true);
  }

  function handleSave() {
    if (editing) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editing.id ? { ...t, ...formData } : t
        )
      );
    } else {
      const newItem: Testimonial = {
        ...formData,
        id: `t-${Date.now()}`,
      };
      setTestimonials((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  }

  function handleDelete() {
    if (selected) {
      setTestimonials((prev) =>
        prev.filter((t) => t.id !== selected.id)
      );
    }
    setShowDelete(false);
  }

  function toggleFeatured(id: string) {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isFeatured: !t.isFeatured } : t
      )
    );
  }

  function moveItem(id: string, direction: "up" | "down") {
    setTestimonials((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
      return updated.map((t, i) => ({ ...t, displayOrder: i + 1 }));
    });
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        weight={i < rating ? "fill" : "regular"}
        style={{
          width: 14,
          height: 14,
          color: i < rating ? "var(--amber-500)" : "var(--stone-300)",
        }}
      />
    ));
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
        <h1>Testimoni</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus weight="bold" />
          Tambah Testimoni
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Nama</th>
                <th>Jenis Pensiun</th>
                <th>Rating</th>
                <th>Ulasan</th>
                <th>Featured</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((item, idx) => (
                <tr key={item.id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td className="table-link">{item.name}</td>
                  <td>{item.pensionType}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {renderStars(item.rating)}
                    </div>
                  </td>
                  <td>
                    <div className="section-preview">{item.content}</div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`badge badge-${item.isFeatured ? "active" : "inactive"}`}
                      onClick={() => toggleFeatured(item.id)}
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {item.isFeatured ? "Featured" : "Biasa"}
                    </button>
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
                        disabled={idx === testimonials.length - 1}
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editing ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h3>
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
                  <label className="form-label">Nama</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis Pensiun</label>
                  <select
                    className="form-select"
                    value={formData.pensionType}
                    onChange={(e) =>
                      updateField("pensionType", e.target.value)
                    }
                  >
                    <option value="PNS">PNS</option>
                    <option value="TNI/Polri">TNI/Polri</option>
                    <option value="BUMN">BUMN</option>
                    <option value="Swasta">Swasta</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ulasan</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.content}
                  onChange={(e) => updateField("content", e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="form-input"
                    value={formData.rating}
                    onChange={(e) =>
                      updateField("rating", Number(e.target.value))
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
              <div className="form-group">
                <label className="form-check">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      updateField("isFeatured", e.target.checked)
                    }
                  />
                  Tampilkan sebagai testimonial unggulan
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
                {editing ? "Simpan Perubahan" : "Tambah Testimoni"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && selected && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hapus Testimoni</h3>
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
                Yakin ingin menghapus testimoni dari{" "}
                <strong>{selected.name}</strong>?
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
