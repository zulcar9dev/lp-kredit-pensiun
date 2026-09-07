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
  fetchFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  type FaqRow,
} from "@/lib/actions/faq";

const EMPTY_FORM = {
  question: "",
  answer: "",
  display_order: 0,
  is_active: false,
};

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [selected, setSelected] = useState<FaqRow | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFaqs();
      setFaqs(data);
    } catch (err) {
      console.error("Gagal memuat FAQ:", err);
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
      display_order: faqs.length + 1,
    });
    setShowModal(true);
  }

  function openEdit(item: FaqRow) {
    setEditing(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      display_order: item.display_order,
      is_active: item.is_active ?? false,
    });
    setShowModal(true);
  }

  function openDelete(item: FaqRow) {
    setSelected(item);
    setShowDelete(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editing) {
      const result = await updateFaq(editing.id, {
        question: formData.question,
        answer: formData.answer,
        display_order: formData.display_order,
        is_active: formData.is_active,
      });
      setSaving(false);
      if (result.ok) {
        loadData();
        setShowModal(false);
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    } else {
      const result = await createFaq({
        question: formData.question,
        answer: formData.answer,
        display_order: formData.display_order,
        is_active: formData.is_active,
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
    const result = await deleteFaq(selected.id);
    setSaving(false);
    if (result.ok) {
      loadData();
    } else {
      alert("Gagal menghapus: " + result.error);
    }
    setShowDelete(false);
  }

  async function toggleActive(item: FaqRow) {
    await updateFaq(item.id, { is_active: !item.is_active });
    loadData();
  }

  async function moveItem(id: string, direction: "up" | "down") {
    const idx = faqs.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= faqs.length) return;

    const updated = [...faqs];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];

    await Promise.all(
      updated.map((f, i) =>
        updateFaq(f.id, { display_order: i + 1 })
      )
    );

    loadData();
  }

  function updateField(field: string, value: string | number | boolean) {
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
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <CircleNotch weight="bold" className="animate-spin" />
                      <p>Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <p>Belum ada FAQ</p>
                    </div>
                  </td>
                </tr>
              ) : (
                faqs.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="table-link">{item.question}</td>
                    <td>
                      <div className="section-preview">{item.answer}</div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge badge-${item.is_active ? "active" : "inactive"}`}
                        onClick={() => toggleActive(item)}
                        style={{ cursor: "pointer", border: "none" }}
                      >
                        {item.is_active ? "Tampil" : "Sembunyi"}
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
                    value={formData.is_active ? "true" : "false"}
                    onChange={(e) =>
                      updateField(
                        "is_active",
                        e.target.value === "true"
                      )
                    }
                  >
                    <option value="true">Tampil di landing page</option>
                    <option value="false">Sembunyi</option>
                  </select>
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
                  "Tambah FAQ"
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
