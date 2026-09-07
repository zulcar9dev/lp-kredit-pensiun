"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  CircleNotch,
} from "@phosphor-icons/react/dist/ssr";
import {
  fetchSettings,
  upsertSetting,
  type SettingRow,
} from "@/lib/actions/settings";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (err) {
      console.error("Gagal memuat pengaturan:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function getSetting(key: string) {
    return settings.find((s) => s.setting_key === key)?.setting_value || "";
  }

  function updateLocal(key: string, value: string) {
    setSettings((prev) => {
      const existing = prev.find((s) => s.setting_key === key);
      if (existing) {
        return prev.map((s) =>
          s.setting_key === key ? { ...s, setting_value: value } : s
        );
      }
      return [...prev, { id: "", setting_key: key, setting_value: value }];
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const keys = ["site_title", "wa_number", "wa_number_display", "wa_greeting"];
    const results = await Promise.all(
      keys.map((key) => upsertSetting(key, getSetting(key)))
    );
    setSaving(false);
    if (results.every((r) => r.ok)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert("Gagal menyimpan pengaturan");
    }
  }

  if (loading) {
    return (
      <>
        <div className="page-header">
          <h1>Pengaturan</h1>
        </div>
        <div className="card">
          <div className="empty-state">
            <CircleNotch weight="bold" className="animate-spin" />
            <p>Memuat pengaturan...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Pengaturan</h1>
      </div>

      {saved && (
        <div className="note note-success">
          <CheckCircle weight="bold" />
          Pengaturan berhasil disimpan.
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Pengaturan Umum</h3>
        </div>

        <div className="form-group">
          <label className="form-label">
            Judul Website
            <span className="form-label-hint"> — tampil di browser tab</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={getSetting("site_title")}
            onChange={(e) => updateLocal("site_title", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Nomor WhatsApp
            <span className="form-label-hint">
              {" "}
              — format: 08xxxxxxxxxx (tanpa spasi)
            </span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="082189902246"
            value={getSetting("wa_number")}
            onChange={(e) => updateLocal("wa_number", e.target.value)}
          />
          <div className="form-hint">
            Nomor ini digunakan untuk tombol WhatsApp di landing page.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Format Tampilan Nomor WhatsApp
            <span className="form-label-hint">
              {" "}
              — yang ditampilkan di halaman
            </span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="0821-8990-2246"
            value={getSetting("wa_number_display")}
            onChange={(e) => updateLocal("wa_number_display", e.target.value)}
          />
          <div className="form-hint">
            Format nomor yang ditampilkan ke pengunjung (contoh: 0821-8990-2246). Kosongkan untuk format default.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Sapaan WhatsApp
            <span className="form-label-hint">
              {" "}
              — pesan yang terkirim saat user klik tombol
            </span>
          </label>
          <textarea
            className="form-textarea"
            rows={3}
            value={getSetting("wa_greeting")}
            onChange={(e) => updateLocal("wa_greeting", e.target.value)}
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <CircleNotch weight="bold" className="animate-spin" />
            ) : (
              "Simpan Pengaturan"
            )}
          </button>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">Informasi Sistem</h3>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div className="text-xs text-muted font-semibold">Versi</div>
            <div className="font-bold">1.0.0</div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold">
              Backend
            </div>
            <div className="font-bold">
              InsForge (terintegrasi)
            </div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold">
              Data
            </div>
            <div className="font-bold">Database PostgreSQL (InsForge)</div>
          </div>
        </div>
      </div>
    </>
  );
}
