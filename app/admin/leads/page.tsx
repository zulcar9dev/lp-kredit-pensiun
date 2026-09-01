"use client";

import { useState, useMemo } from "react";
import { MOCK_LEADS, type Lead } from "@/lib/admin-data";
import {
  Plus,
  X,
  PencilSimple,
  Trash,
  MagnifyingGlass,
  Eye,
} from "@phosphor-icons/react/dist/ssr";

const EMPTY_LEAD: Omit<Lead, "id" | "createdAt"> = {
  name: "",
  whatsapp: "",
  pensionType: "PNS",
  province: "",
  loanAmount: 0,
  interestedBank: "",
  status: "new",
  utmSource: "",
  utmCampaign: "",
  notes: "",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pensionFilter, setPensionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Omit<Lead, "id" | "createdAt">>(
    EMPTY_LEAD
  );

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.whatsapp.includes(search);
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const matchPension =
        pensionFilter === "all" || l.pensionType === pensionFilter;
      return matchSearch && matchStatus && matchPension;
    });
  }, [leads, search, statusFilter, pensionFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  function openAdd() {
    setEditingLead(null);
    setFormData(EMPTY_LEAD);
    setShowModal(true);
  }

  function openEdit(lead: Lead) {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      whatsapp: lead.whatsapp,
      pensionType: lead.pensionType,
      province: lead.province,
      loanAmount: lead.loanAmount,
      interestedBank: lead.interestedBank,
      status: lead.status,
      utmSource: lead.utmSource,
      utmCampaign: lead.utmCampaign,
      notes: lead.notes,
    });
    setShowModal(true);
  }

  function openDetail(lead: Lead) {
    setSelectedLead(lead);
    setShowDetail(true);
  }

  function openDelete(lead: Lead) {
    setSelectedLead(lead);
    setShowDelete(true);
  }

  function handleSave() {
    if (editingLead) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === editingLead.id ? { ...l, ...formData } : l
        )
      );
    } else {
      const newLead: Lead = {
        ...formData,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setLeads((prev) => [newLead, ...prev]);
    }
    setShowModal(false);
  }

  function handleDelete() {
    if (selectedLead) {
      setLeads((prev) => prev.filter((l) => l.id !== selectedLead.id));
    }
    setShowDelete(false);
  }

  function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
        <h1>Leads</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <Plus weight="bold" />
          Tambah Lead
        </button>
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
                setCurrentPage(1);
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
            <option value="processed">Proses</option>
            <option value="closed">Selesai</option>
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
            <option value="PNS">PNS</option>
            <option value="TNI/Polri">TNI/Polri</option>
            <option value="BUMN">BUMN</option>
            <option value="Swasta">Swasta</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>WhatsApp</th>
                <th>Jenis Pensiun</th>
                <th>Provinsi</th>
                <th>Pinjaman</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <MagnifyingGlass weight="bold" />
                      <p>Tidak ada data ditemukan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((lead) => (
                  <tr key={lead.id}>
                    <td className="table-link">{lead.name}</td>
                    <td className="table-mono">{lead.whatsapp}</td>
                    <td>{lead.pensionType}</td>
                    <td>{lead.province}</td>
                    <td>{formatRupiah(lead.loanAmount)}</td>
                    <td>
                      <span className={`badge badge-${lead.status}`}>
                        {lead.status === "new"
                          ? "Baru"
                          : lead.status === "contacted"
                            ? "Dihubungi"
                            : lead.status === "processed"
                              ? "Proses"
                              : "Selesai"}
                      </span>
                    </td>
                    <td className="text-muted text-sm">
                      {formatDate(lead.createdAt)}
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
                <div className="form-group">
                  <label className="form-label">Provinsi</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.province}
                    onChange={(e) => updateField("province", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Jumlah Pinjaman</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.loanAmount}
                    onChange={(e) =>
                      updateField("loanAmount", Number(e.target.value))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bank yang Diminati</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.interestedBank}
                    onChange={(e) =>
                      updateField("interestedBank", e.target.value)
                    }
                  />
                </div>
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
                        e.target.value as Lead["status"]
                      )
                    }
                  >
                    <option value="new">Baru</option>
                    <option value="contacted">Dihubungi</option>
                    <option value="processed">Proses</option>
                    <option value="closed">Selesai</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">UTM Source</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.utmSource}
                    onChange={(e) => updateField("utmSource", e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">UTM Campaign</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.utmCampaign}
                  onChange={(e) =>
                    updateField("utmCampaign", e.target.value)
                  }
                />
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
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                {editingLead ? "Simpan Perubahan" : "Tambah Lead"}
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
                  <div className="font-bold">{selectedLead.pensionType}</div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Provinsi
                  </div>
                  <div className="font-bold">{selectedLead.province}</div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Pinjaman
                  </div>
                  <div className="font-bold text-accent">
                    {formatRupiah(selectedLead.loanAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Bank Diminati
                  </div>
                  <div className="font-bold">
                    {selectedLead.interestedBank || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    Status
                  </div>
                  <span className={`badge badge-${selectedLead.status}`}>
                    {selectedLead.status === "new"
                      ? "Baru"
                      : selectedLead.status === "contacted"
                        ? "Dihubungi"
                        : selectedLead.status === "processed"
                          ? "Proses"
                          : "Selesai"}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    UTM Source
                  </div>
                  <div>{selectedLead.utmSource || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted font-semibold">
                    UTM Campaign
                  </div>
                  <div>{selectedLead.utmCampaign || "-"}</div>
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
                  <div>{formatDate(selectedLead.createdAt)}</div>
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
