"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  CircleNotch,
  Copy,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";
import {
  fetchCampaignSettings,
  createCampaignSetting,
  updateCampaignSetting,
  deleteCampaignSetting,
  type CampaignSettingRow,
} from "@/lib/actions/campaign-settings";

const EMPTY_FORM = {
  campaign_name: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  pixel_id: "",
  is_active: true,
};

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignSettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editing, setEditing] = useState<CampaignSettingRow | null>(null);
  const [selected, setSelected] = useState<CampaignSettingRow | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCampaignSettings();
      setCampaigns(data);
    } catch (err) {
      console.error("Gagal memuat campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditing(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(item: CampaignSettingRow) {
    setEditing(item);
    setFormData({
      campaign_name: item.campaign_name,
      utm_source: item.utm_source ?? "",
      utm_medium: item.utm_medium ?? "",
      utm_campaign: item.utm_campaign ?? "",
      utm_content: item.utm_content ?? "",
      utm_term: item.utm_term ?? "",
      pixel_id: item.pixel_id ?? "",
      is_active: item.is_active,
    });
    setShowModal(true);
  }

  function openDelete(item: CampaignSettingRow) {
    setSelected(item);
    setShowDelete(true);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      campaign_name: formData.campaign_name,
      utm_source: formData.utm_source || null,
      utm_medium: formData.utm_medium || null,
      utm_campaign: formData.utm_campaign || null,
      utm_content: formData.utm_content || null,
      utm_term: formData.utm_term || null,
      pixel_id: formData.pixel_id || null,
      is_active: formData.is_active,
    };

    let result;
    if (editing) {
      result = await updateCampaignSetting(editing.id, payload);
    } else {
      result = await createCampaignSetting(payload);
    }

    setSaving(false);
    if (result.ok) {
      await load();
      setShowModal(false);
    } else {
      alert("Gagal menyimpan: " + result.error);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setSaving(true);
    const result = await deleteCampaignSetting(selected.id);
    setSaving(false);
    if (result.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== selected.id));
    } else {
      alert("Gagal menghapus: " + result.error);
    }
    setShowDelete(false);
  }

  function buildUtmUrl(item: CampaignSettingRow) {
    const params = new URLSearchParams();
    if (item.utm_source) params.set("utm_source", item.utm_source);
    if (item.utm_medium) params.set("utm_medium", item.utm_medium);
    if (item.utm_campaign) params.set("utm_campaign", item.utm_campaign);
    if (item.utm_content) params.set("utm_content", item.utm_content);
    if (item.utm_term) params.set("utm_term", item.utm_term);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function updateField(field: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <>
      <div className="page-header">
        <h1>Campaign Settings</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus weight="bold" />
          Tambah Campaign
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="empty-state">
            <CircleNotch weight="bold" className="animate-spin" />
            <p>Memuat data...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada campaign. Klik &quot;Tambah Campaign&quot; untuk membuat.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Campaign</th>
                  <th>UTM Source</th>
                  <th>UTM Medium</th>
                  <th>UTM Campaign</th>
                  <th>Pixel ID</th>
                  <th>Status</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((item) => (
                  <tr key={item.id}>
                    <td className="table-link">{item.campaign_name}</td>
                    <td className="table-mono">{item.utm_source || "-"}</td>
                    <td>{item.utm_medium || "-"}</td>
                    <td>{item.utm_campaign || "-"}</td>
                    <td className="table-mono">{item.pixel_id || "-"}</td>
                    <td>
                      <span className={`badge badge-${item.is_active ? "closed" : "new"}`}>
                        {item.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions justify-end">
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() =>
                            copyToClipboard(
                              buildUtmUrl(item),
                              item.id
                            )
                          }
                          title="Copy UTM URL"
                        >
                          {copied === item.id ? (
                            <CheckCircle weight="bold" />
                          ) : (
                            <Copy weight="bold" />
                          )}
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
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? "Edit Campaign" : "Tambah Campaign Baru"}</h3>
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
                <label className="form-label">Nama Campaign</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Meta Ads Sept 2026"
                  value={formData.campaign_name}
                  onChange={(e) => updateField("campaign_name", e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">UTM Source</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="facebook, instagram"
                    value={formData.utm_source}
                    onChange={(e) => updateField("utm_source", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">UTM Medium</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="cpc, paid, organic"
                    value={formData.utm_medium}
                    onChange={(e) => updateField("utm_medium", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">UTM Campaign</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="kredit_pensiun_sept2026"
                    value={formData.utm_campaign}
                    onChange={(e) => updateField("utm_campaign", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">UTM Content</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.utm_content}
                    onChange={(e) => updateField("utm_content", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">UTM Term</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.utm_term}
                    onChange={(e) => updateField("utm_term", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pixel ID (informatif)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Meta Pixel ID"
                    value={formData.pixel_id}
                    onChange={(e) => updateField("pixel_id", e.target.value)}
                  />
                  <p className="mt-1 text-xs text-stone-500">
                    Catatan: tracking pixel saat ini memakai Pixel ID dari
                    konfigurasi server, kolom ini hanya dokumentasi per kampanye.
                  </p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => updateField("is_active", e.target.checked)}
                    style={{ marginRight: 8 }}
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
                disabled={saving || !formData.campaign_name}
              >
                {saving ? (
                  <CircleNotch weight="bold" className="animate-spin" />
                ) : editing ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Campaign"
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
              <h3>Hapus Campaign</h3>
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
                Yakin ingin menghapus campaign{" "}
                <strong>{selected.campaign_name}</strong>?
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
