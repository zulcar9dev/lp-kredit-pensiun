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
  fetchSections,
  createSection,
  updateSection,
  deleteSection,
  type SectionRow,
} from "@/lib/actions/sections";
import { ImageUploadField } from "@/components/image-upload-field";

const EMPTY_FORM = {
  section_type: "",
  title: "",
  content: "",
  image_url: "",
  image_key: "",
  display_order: 0,
  status: "draft" as SectionRow["status"],
};

function sectionContentToText(content: Record<string, unknown> | null): string {
  if (!content) return "";
  if (typeof content === "object" && typeof content.text === "string") {
    return content.text;
  }
  return JSON.stringify(content);
}

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
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<SectionRow | null>(null);
  const [selected, setSelected] = useState<SectionRow | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchSections();
    setSections(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openAdd() {
    setEditing(null);
    setFormData({
      ...EMPTY_FORM,
      display_order: sections.length + 1,
    });
    setShowModal(true);
  }

  function openEdit(item: SectionRow) {
    setEditing(item);
    setFormData({
      section_type: item.section_type,
      title: item.title ?? "",
      content: sectionContentToText(item.content),
      image_url: item.image_url ?? "",
      image_key: item.image_key ?? "",
      display_order: item.display_order,
      status: item.status,
    });
    setShowModal(true);
  }

  function openDelete(item: SectionRow) {
    setSelected(item);
    setShowDelete(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      const result = await updateSection(editing.id, {
        section_type: formData.section_type,
        title: formData.title || null,
        content: formData.content
          ? { text: formData.content }
          : null,
        image_url: formData.image_url || null,
        image_key: formData.image_key || null,
        display_order: formData.display_order,
        status: formData.status,
      });
      setSaving(false);
      if (result.ok) {
        loadData();
        setShowModal(false);
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    } else {
      const result = await createSection({
        section_type: formData.section_type,
        title: formData.title || null,
        content: formData.content
          ? { text: formData.content }
          : null,
        image_url: formData.image_url || null,
        image_key: formData.image_key || null,
        display_order: formData.display_order,
        status: formData.status,
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
    const result = await deleteSection(selected.id);
    setSaving(false);
    if (result.ok) {
      loadData();
    } else {
      alert("Gagal menghapus: " + result.error);
    }
    setShowDelete(false);
  }

  async function toggleStatus(item: SectionRow) {
    const newStatus = item.status === "published" ? "draft" : "published";
    await updateSection(item.id, { status: newStatus });
    loadData();
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;

    const updated = [...sections];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];

    await Promise.all(
      updated.map((s, i) =>
        updateSection(s.id, { display_order: i + 1 })
      )
    );

    loadData();
  }

  function updateField(field: string, value: string | number) {
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
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <CircleNotch weight="bold" className="animate-spin" />
                      <p>Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : sections.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <p>Belum ada section</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sections.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td>
                      <span className="badge badge-info">
                        {getSectionLabel(item.section_type)}
                      </span>
                    </td>
                    <td className="table-link">{item.title}</td>
                    <td>
                      <div className="section-preview">
                        {sectionContentToText(
                          item.content as Record<string, unknown> | null
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge badge-${item.status}`}
                        onClick={() => toggleStatus(item)}
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
                    value={formData.section_type}
                    onChange={(e) =>
                      updateField("section_type", e.target.value)
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
                      updateField("status", e.target.value)
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
                  <label className="form-label">Gambar</label>
                  <ImageUploadField
                    url={formData.image_url}
                    folder="sections"
                    maxSizeMB={2}
                    hint="JPG/PNG/WebP, maksimal 2MB."
                    onChange={(v) => {
                      updateField("image_url", v?.url ?? "");
                      updateField("image_key", v?.key ?? "");
                    }}
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
                  "Tambah Section"
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
