"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  Eye,
  CircleNotch,
  ArrowDown,
} from "@phosphor-icons/react/dist/ssr";
import {
  fetchLeads,
  exportLeads,
  fetchLeadOptions,
  createLead,
  updateLead,
  deleteLead,
  type LeadRow,
  type LeadFilters,
} from "@/lib/actions/leads";
import { formatRupiah } from "@/lib/format";
import { PENSION_TYPES } from "@/lib/constants";

const APPLICANT_RELATION_LABELS: Record<string, string> = {
  sendiri: "Diri sendiri",
  orang_tua: "Orang tua",
};

const EMPTY_FORM = {
  name: "",
  whatsapp: "",
  pension_type: "PNS" as string,
  applicant_relation: "sendiri" as LeadRow["applicant_relation"],
  loan_amount: null as number | null,
  status: "new" as LeadRow["status"],
  notes: "",
};

const PER_PAGE = 10;

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [campaignOptions, setCampaignOptions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pensionFilter, setPensionFilter] = useState("all");
  const [relationFilter, setRelationFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadRow | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const activeFilters = useMemo<LeadFilters>(() => ({
    status: statusFilter === "all" ? undefined : statusFilter,
    pensionType: pensionFilter === "all" ? undefined : pensionFilter,
    applicantRelation: relationFilter === "all" ? undefined : relationFilter,
    campaign: campaignFilter === "all" ? undefined : campaignFilter,
    search: debouncedSearch || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    sort,
    page: currentPage,
    limit: PER_PAGE,
  }), [
    statusFilter,
    pensionFilter,
    relationFilter,
    campaignFilter,
    debouncedSearch,
    dateFrom,
    dateTo,
    sort,
    currentPage,
  ]);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchLeads(activeFilters);
      setLeads(result.rows);
      setTotal(result.count);
    } catch (err) {
      console.error("Gagal memuat leads:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    fetchLeadOptions()
      .then((o) => {
        setCampaignOptions(o.campaigns);
      })
      .catch((err) => {
        console.error("Gagal memuat opsi filter:", err);
      });
  }, []);

  const totalPages = Math.ceil(total / PER_PAGE);

  function openAdd() {
    setEditingLead(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(lead: LeadRow) {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      whatsapp: lead.whatsapp,
      pension_type: lead.pension_type,
      applicant_relation: lead.applicant_relation ?? "sendiri",
      loan_amount: lead.loan_amount ?? null,
      status: lead.status,
      notes: lead.notes ?? "",
    });
    setShowModal(true);
  }

  function openDetail(lead: LeadRow) {
    setSelectedLead(lead);
    setShowDetail(true);
  }

  function openDelete(lead: LeadRow) {
    setSelectedLead(lead);
    setShowDelete(true);
  }

  async function handleSave() {
    setSaving(true);

    if (editingLead) {
      const result = await updateLead(editingLead.id, {
        name: formData.name,
        whatsapp: formData.whatsapp,
        pension_type: formData.pension_type,
        applicant_relation: formData.applicant_relation,
        loan_amount: formData.loan_amount,
        status: formData.status,
        notes: formData.notes || null,
      });
      setSaving(false);
      if (result.ok) {
        setShowModal(false);
        loadLeads();
      } else {
        alert("Gagal menyimpan: " + result.error);
      }
    } else {
      const result = await createLead({
        name: formData.name,
        whatsapp: formData.whatsapp,
        pension_type: formData.pension_type,
        applicant_relation: formData.applicant_relation,
        loan_amount: formData.loan_amount ?? undefined,
        status: formData.status,
        notes: formData.notes || undefined,
      });
      setSaving(false);
      if (result.ok) {
        setShowModal(false);
        loadLeads();
      } else {
        alert("Gagal menambah lead: " + result.error);
      }
    }
  }

  async function handleDelete() {
    if (!selectedLead) return;
    setSaving(true);
    const result = await deleteLead(selectedLead.id);
    setSaving(false);
    if (result.ok) {
      setShowDelete(false);
      loadLeads();
    } else {
      alert("Gagal menghapus: " + result.error);
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function updateField(field: string, value: string | number | null) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleExport() {
    setSaving(true);
    try {
      const scope = { ...activeFilters };
      delete (scope as { limit?: number }).limit;
      delete (scope as { page?: number }).page;
      const rows = await exportLeads(scope);
      if (rows.length === 0) {
        alert("Tidak ada data untuk diexport.");
        return;
      }
      const XLSX = await import("xlsx");
      const data = rows.map((l) => ({
        Nama: l.name,
        WhatsApp: l.whatsapp,
        "Jenis Pensiun": l.pension_type,
        "Pengajuan Untuk": APPLICANT_RELATION_LABELS[l.applicant_relation] || l.applicant_relation,
        "Pinjaman (Rp)": l.loan_amount ?? 0,
        Status: statusLabel(l.status),
        "Setuju PDP": l.consent ? "Ya" : "Tidak",
        Catatan: l.notes || "",
        Provinsi: l.province || "",
        "UTM Source": l.utm_source || "",
        "UTM Medium": l.utm_medium || "",
        "UTM Campaign": l.utm_campaign || "",
        "UTM Content": l.utm_content || "",
        "UTM Term": l.utm_term || "",
        "Event ID": l.event_id || "",
        "IP Address": l.ip_address || "",
        Tanggal: new Date(l.created_at).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leads");
      XLSX.writeFile(wb, `leads-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally {
      setSaving(false);
    }
  }

  const statusLabel = (s: string) =>
    s === "new"
      ? "Baru"
      : s === "contacted"
        ? "Dihubungi"
        : s === "qualified"
          ? "Kualifikasi"
          : s === "approved"
            ? "Disetujui"
            : s === "rejected"
              ? "Ditolak"
              : s === "invalid"
                ? "Invalid"
                : s;

  return (
    <>
      <div className="page-header">
        <h1>Leads</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExport}
            disabled={saving || total === 0}
          >
            <ArrowDown weight="bold" />
            Export Excel
          </button>
          <button type="button" className="btn btn-primary" onClick={openAdd}>
            <Plus weight="bold" />
            Tambah Lead
          </button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="filter-search">
            <input
              type="text"
              className="form-input"
              placeholder="Cari nama atau WhatsApp..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Semua Status</option>
            <option value="new">Baru</option>
            <option value="contacted">Dihubungi</option>
            <option value="qualified">Kualifikasi</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
            <option value="invalid">Invalid</option>
          </select>
          <select
            className="form-select"
            value={pensionFilter}
            onChange={(e) => {
              setPensionFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Semua Jenis</option>
            {PENSION_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={relationFilter}
            onChange={(e) => {
              setRelationFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Semua Pengaju</option>
            <option value="sendiri">Diri sendiri</option>
            <option value="orang_tua">Orang tua</option>
          </select>
          <select
            className="form-select"
            value={campaignFilter}
            onChange={(e) => {
              setCampaignFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Semua Kampanye</option>
            {campaignOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
          <input
            type="date"
            className="form-input"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Dari tanggal"
          />
          <input
            type="date"
            className="form-input"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Sampai tanggal"
          />
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setPensionFilter("all");
              setRelationFilter("all");
              setCampaignFilter("all");
              setSort("newest");
              setDateFrom("");
              setDateTo("");
              setCurrentPage(1);
            }}
          >
            Reset
          </button>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>WhatsApp</th>
                <th>Jenis Pensiun</th>
                <th>Pengajuan</th>
                <th>Pinjaman</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <CircleNotch weight="bold" className="animate-spin" />
                      <p>Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <MagnifyingGlass weight="bold" />
                      <p>Tidak ada data ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="table-link">{lead.name}</td>
                    <td className="table-mono">{lead.whatsapp}</td>
                    <td>{lead.pension_type}</td>
                    <td>
                      {APPLICANT_RELATION_LABELS[lead.applicant_relation] ||
                        lead.applicant_relation}
                    </td>
                    <td>{formatRupiah(lead.loan_amount)}</td>
                    <td>
                      <span className={`badge badge-${lead.status}`}>
                        {statusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="text-muted text-sm">
                      {formatDate(lead.created_at)}
                    </td>
                    <td>
                      <div className="table-actions justify-end">
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => openDetail(lead)}
                          title="Lihat"
                        >
                          <Eye weight="bold" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => openEdit(lead)}
                          title="Edit"
                        >
                          <PencilSimple weight="bold" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => openDelete(lead)}
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

        {totalPages > 1 && (
          <div className="pagination">
            <span className="text-sm text-muted" style={{ marginRight: 8 }}>
              {total} lead
            </span>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={p === currentPage ? "page-current" : "page-link"}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingLead ? "Edit Lead" : "Tambah Lead Baru"}</h3>
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
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.whatsapp}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Jenis Pensiun</label>
                  <select
                    className="form-select"
                    value={formData.pension_type}
                    onChange={(e) =>
                      updateField("pension_type", e.target.value)
                    }
                  >
                    {PENSION_TYPES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Pengajuan Untuk</label>
                  <select
                    className="form-select"
                    value={formData.applicant_relation}
                    onChange={(e) =>
                      updateField("applicant_relation", e.target.value)
                    }
                  >
                    <option value="sendiri">Diri sendiri</option>
                    <option value="orang_tua">Orang tua</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Jumlah Pinjaman</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.loan_amount ?? ""}
                    onChange={(e) =>
                      updateField("loan_amount", e.target.value ? Number(e.target.value) : null)
                    }
                  />
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
                    <option value="new">Baru</option>
                    <option value="contacted">Dihubungi</option>
                    <option value="qualified">Kualifikasi</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Ditolak</option>
                    <option value="invalid">Invalid</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Catatan</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                />
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
                ) : editingLead ? (
                  "Simpan Perubahan"
                ) : (
                  "Tambah Lead"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Lead</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowDetail(false)}
              >
                <X weight="bold" />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <div className="text-xs text-muted font-semibold">Nama</div>
                  <div className="font-bold">{selectedLead.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    WhatsApp
                  </div>
                  <div className="font-bold table-mono">
                    {selectedLead.whatsapp}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Jenis Pensiun
                  </div>
                  <div className="font-bold">{selectedLead.pension_type}</div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Pengajuan Untuk
                  </div>
                  <div className="font-bold">
                    {APPLICANT_RELATION_LABELS[selectedLead.applicant_relation] ||
                      selectedLead.applicant_relation}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Pinjaman
                  </div>
                  <div className="font-bold text-accent">
                    {formatRupiah(selectedLead.loan_amount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Setuju PDP
                  </div>
                  <div className="font-bold">
                    {selectedLead.consent ? "Ya" : "Tidak"}
                    {selectedLead.consent_at
                      ? ` — ${new Date(selectedLead.consent_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`
                      : ""}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Status
                  </div>
                  <span className={`badge badge-${selectedLead.status}`}>
                    {statusLabel(selectedLead.status)}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Event ID (dedup CAPI)
                  </div>
                  <div className="table-mono text-sm">
                    {selectedLead.event_id || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Catatan
                  </div>
                  <div>{selectedLead.notes || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Tanggal Dibuat
                  </div>
                  <div>{formatDate(selectedLead.created_at)}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDetail(false)}
              >
                Tutup
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShowDetail(false);
                  openEdit(selectedLead);
                }}
              >
                <PencilSimple weight="bold" />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {showDelete && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hapus Lead</h3>
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
                Yakin ingin menghapus data{" "}
                <strong>{selectedLead.name}</strong>? Tindakan ini tidak dapat
                dibatalkan.
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
