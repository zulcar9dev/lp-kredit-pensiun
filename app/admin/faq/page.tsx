"use client";

import { useState } from "react";
import { MOCK_FAQS, type FaqItem } from "@/lib/admin-data";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  ArrowUp,
  ArrowDown,
} from "@phosphor-icons/react/dist/ssr";

const EMPTY_FORM: Omit<FaqItem, "id"> = {
  question: "",
  answer: "",
  displayOrder: 0,
  status: "draft",
};

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(MOCK_FAQS);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [selected, setSelected] = useState<FaqItem | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  function openAdd() {
    setEditing(null);
    setFormData({
      ...EMPTY_FORM,
      displayOrder: faqs.length + 1,
    });
    setShowModal(true);
  }

  function openEdit(item: FaqItem) {
    setEditing(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      displayOrder: item.displayOrder,
      status: item.status,
    });
    setShowModal(true);
  }

  function openDelete(item: FaqItem) {
    setSelected(item);
    setShowDelete(true);
  }

  function handleSave() {
    if (editing) {
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === editing.id ? { ...f, ...formData } : f
        )
      );
    } else {
      const newItem: FaqItem = {
        ...formData,
        id: `f-${Date.now()}`,
      };
      setFaqs((prev) => [...prev, newItem]);
    }
    setShowModal(false);
  }

  function handleDelete() {
    if (selected) {
      setFaqs((prev) => prev.filter((f) => f.id !== selected.id));
    }
    setShowDelete(false);
  }

  function toggleStatus(id: string) {
    setFaqs((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: f.status === "published" ? "draft" : "published",
            }
          : f
      )
    );
  }

  function moveItem(id: string, direction: "up" | "down") {
    setFaqs((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
      return updated.map((f, i) => ({ ...f, displayOrder: i + 1 }));
    });
  }

  function updateField(
    field: keyof typeof formData,
    value: string | number
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      <div className="page-header">
        <h1>FAQ</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus weight="bold" />
          Tambah FAQ
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Pertanyaan</th>
                <th>Jawaban</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((item, idx) => (
                <tr key={item.id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td className="table-link">{item.question}</td>
                  <td>
                    <div className="section-preview">{item.answer}</div>
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
                        disabled={idx === faqs.length - 1}
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
              <h3>{editing ? "Edit FAQ" : "Tambah FAQ Baru"}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X weight="bold" />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Pertanyaan</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.question}
                  onChange={(e) =>
                    updateField("question", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Jawaban</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => updateField("answer", e.target.value)}
                />
              </div>
              <div className="form-row">
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
                {editing ? "Simpan Perubahan" : "Tambah FAQ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && selected && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hapus FAQ</h3>
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
                Yakin ingin menghapus FAQ{" "}
                <strong>{selected.question}</strong>?
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
