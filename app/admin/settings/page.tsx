"use client";

import { useState } from "react";
import {
  MOCK_SETTINGS,
  type AppSetting,
} from "@/lib/admin-data";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSetting[]>(MOCK_SETTINGS);
  const [saved, setSaved] = useState(false);

  function getSetting(key: string) {
    return settings.find((s) => s.settingKey === key)?.settingValue || "";
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) =>
      prev.map((s) =>
        s.settingKey === key ? { ...s, settingValue: value } : s
      )
    );
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            onChange={(e) => updateSetting("site_title", e.target.value)}
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
            onChange={(e) => updateSetting("wa_number", e.target.value)}
          />
          <div className="form-hint">
            Nomor ini digunakan untuk tombol WhatsApp di landing page.
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
            onChange={(e) => updateSetting("wa_greeting", e.target.value)}
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            Simpan Pengaturan
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
              InsForge (belum terintegrasi)
            </div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold">
              Data
            </div>
            <div className="font-bold">Mock data (localStorage)</div>
          </div>
        </div>

        <div className="note note-warn mt-4">
          <WarningCircle weight="bold" />
          Saat ini semua data bersifat simulasi dan akan ter-reset setiap
          halaman di-refresh. Integrasi backend InsForge akan dilakukan di
          phase selanjutnya.
        </div>
      </div>
    </>
  );
}
