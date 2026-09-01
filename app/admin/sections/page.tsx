"use client";

import { useState } from "react";
import { MOCK_SECTIONS, type Section } from "@/lib/admin-data";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
} from "@phosphor-icons/react/dist/ssr";

const EMPTY_FORM: Omit<Section, "id"> = {
  sectionType: "",
  title: "",
  content: "",
  imageUrl: "",
  displayOrder: 0,
  status: "draft",
};

const SECTION_TYPES = [
  { value: "hero", label: "Hero / Headline" },
  { value: "keunggulan", label: "Keunggulan" },
  { value: "bank_mitra", label: "Bank Mitra & Produk" },
  { value: "cara_pengajuan", label: "Cara Pengajuan" },
  { value: "testimonial", label: "Testimonial" },
  { value: "form_lead", label: "Form Lead" },
  { value: "faq", label: "FAQ" },
  { value: "footer", label: "Footer" },
];

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>(MOCK_SECTIONS);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [selected, setSelected] = useState<Section | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  function openAdd() {
    setEditing(null);
    setFormData({
      ...EMPTY_FORM,
      displayOrder: sections.length + 1,
    });
    setShowModal(true);
  }

  function openEdit(item: Section) {
    setEditing(item);
    setFormData({
      sectionType: item.sectionType,
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl,
      displayOrder: item.displayOrder,
      status: item.status,
    });
    setShowModal(true);
  }

  function openDelete(item: Section) {
    setSelected(item);
    setShowDelete(true);
  }

  function handleSave() {
    if (editing) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editing.id ? { ...s, ...formData } : s
        )
      );
    } else {
      const newItem: Section = {
        ...formData,
        id: `s-${Date.now()}`,
      };
      setSections((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  }

  function handleDelete() {
    if (selected) {
      setSections((prev) => prev.filter((s) => s.id !== selected.id));
    }
    setShowDelete(false);
  }

  function toggleStatus(id: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "published" ? "draft" : "published",
            }
          : s
      )
    );
  }

  function moveItem(id: string, direction: "up" | "down") {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
      return updated.map((s, i) => ({ ...s, displayOrder: i + 1 }));
    });
  }

  function updateField(
    field: keyof typeof formData,
    value: string | number
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function getSectionLabel(type: string) {
    return (
      SECTION_TYPES.find((st) => st.value === type)?.label || type
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Sections</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus weight="bold" />
          Tambah Section
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Jenis</th>
                <th>Judul</th>
                <th>Preview</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((item, idx) => (
                <tr key={item.id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td>
                    <span className="badge badge-info">
                      {getSectionLabel(item.sectionType)}
                    </span>
                  </td>
                  <td className="table-link">{item.title}</td>
                  <td>
                    <div className="section-preview">{item.content}</div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`badge badge-${item.status}`}
                      onClick={() => toggleStatus(item.id)}
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {item.status === "published"
                        ? "Published"
                        : "Draft"}
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
                        disabled={idx === sections.length - 1}
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
              <h3>{editing ? "Edit Section" : "Tambah Section Baru"}</h3>
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
                  <label className="form-label">Jenis Section</label>
                  <select
                    className="form-select"
                    value={formData.sectionType}
                    onChange={(e) =>
                      updateField("sectionType", e.target.value)
                    }
                  >
                    <option value="">Pilih jenis...</option>
                    {SECTION_TYPES.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      updateField(
                        "status",
                        e.target.value as "published" | "draft"
                      )
                    }
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Judul</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Konten{" "}
                  <span className="form-label-hint">
                    (opsional, bisa kosong)
                  </span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => updateField("content", e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">URL Gambar</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) =>
                      updateField("imageUrl", e.target.value)
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
                {editing ? "Simpan Perubahan" : "Tambah Section"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && selected && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hapus Section</h3>
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
                Yakin ingin menghapus section{" "}
                <strong>{selected.title}</strong>?
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
