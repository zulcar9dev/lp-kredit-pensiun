"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
  Star,
  CircleNotch,
} from "@phosphor-icons/react/dist/ssr";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialRow,
} from "@/lib/actions/testimonials";
import { ImageUploadField } from "@/components/image-upload-field";

const EMPTY_FORM = {
  name: "",
  pension_type: "PNS",
  content: "",
  photo_url: "",
  photo_key: "",
  rating: 5,
  is_featured: false,
  display_order: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<TestimonialRow | null>(null);
  const [selected, setSelected] = useState<TestimonialRow | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error("Gagal memuat testimoni:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openAdd() {
    setEditing(null);
    setFormData({
      ...EMPTY_FORM,
      display_order: testimonials.length + 1,
    });
    setShowModal(true);
  }

  function openEdit(item: TestimonialRow) {
    setEditing(item);
    setFormData({
      name: item.name,
      pension_type: item.pension_type ?? "PNS",
      content: item.content,
      photo_url: item.photo_url ?? "",
      photo_key: item.photo_key ?? "",
      rating: item.rating,
      is_featured: item.is_featured,
      display_order: item.display_order,
    });
    setShowModal(true);
  }

  function openDelete(item: TestimonialRow) {
    setSelected(item);
    setShowDelete(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      const result = await updateTestimonial(editing.id, {
        name: formData.name,
        pension_type: formData.pension_type,
        content: formData.content,
        photo_url: formData.photo_url || null,
        photo_key: formData.photo_key || null,
        rating: formData.rating,
        is_featured: formData.is_featured,
        display_order: formData.display_order,
      });
      setSaving(false);
      if (result.ok) {
        loadData();
        setShowModal(false);
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    } else {
      const result = await createTestimonial({
        name: formData.name,
        pension_type: formData.pension_type,
        content: formData.content,
        photo_url: formData.photo_url || null,
        photo_key: formData.photo_key || null,
        rating: formData.rating,
        is_featured: formData.is_featured,
        display_order: formData.display_order,
      });
      setSaving(false);
      if (result.ok) {
        loadData();
        setShowModal(false);
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setSaving(true);
    const result = await deleteTestimonial(selected.id);
    setSaving(false);
    if (result.ok) {
      loadData();
    } else {
      alert("Gagal menghapus: " + result.error);
    }
    setShowDelete(false);
  }

  async function toggleFeatured(item: TestimonialRow) {
    await updateTestimonial(item.id, { is_featured: !item.is_featured });
    loadData();
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const idx = testimonials.findIndex((t) => t.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= testimonials.length) return;

    const updated = [...testimonials];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];

    await Promise.all(
      updated.map((t, i) =>
        updateTestimonial(t.id, { display_order: i + 1 })
      )
    );

    loadData();
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

  function updateField(field: string, value: string | number | boolean) {
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
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <CircleNotch weight="bold" className="animate-spin" />
                      <p>Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <p>Belum ada testimoni</p>
                    </div>
                  </td>
                </tr>
              ) : (
                testimonials.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="table-link">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {item.photo_url ? (
                          <img
                            src={item.photo_url}
                            alt={`Foto ${item.name}`}
                            style={{ width: 32, height: 32, borderRadius: 9999, objectFit: "cover", border: "1px solid var(--border)" }}
                          />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: 9999, background: "var(--brand-100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--brand-700)" }}>
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        {item.name}
                      </div>
                    </td>
                    <td>{item.pension_type}</td>
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
                        className={`badge badge-${item.is_featured ? "active" : "inactive"}`}
                        onClick={() => toggleFeatured(item)}
                        style={{ cursor: "pointer", border: "none" }}
                      >
                        {item.is_featured ? "Featured" : "Biasa"}
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
                ))
              )}
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
                    value={formData.pension_type}
                    onChange={(e) =>
                      updateField("pension_type", e.target.value)
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
                    value={formData.display_order}
                    onChange={(e) =>
                      updateField("display_order", Number(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Foto (opsional)</label>
                <ImageUploadField
                  url={formData.photo_url}
                  folder="testimonial-photos"
                  maxSizeMB={2}
                  hint="JPG/PNG/WebP, maksimal 2MB. Kosongkan jika tidak ada."
                  onChange={(v) => {
                    updateField("photo_url", v?.url ?? "");
                    updateField("photo_key", v?.key ?? "");
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-check">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      updateField("is_featured", e.target.checked)
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
                  "Tambah Testimoni"
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
