"use client";

import Link from "next/link";
import { MOCK_LEADS, MOCK_BANK_PRODUCTS } from "@/lib/admin-data";

export default function AdminDashboardPage() {
  const leads = MOCK_LEADS;
  const banks = MOCK_BANK_PRODUCTS;

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const processedLeads = leads.filter((l) => l.status === "processed").length;
  const closedLeads = leads.filter((l) => l.status === "closed").length;
  const activeBanks = banks.filter((b) => b.isActive).length;

  const provinceCounts = leads.reduce(
    (acc, lead) => {
      acc[lead.province] = (acc[lead.province] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const sortedProvinces = Object.entries(provinceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const maxProvinceCount = Math.max(
    ...sortedProvinces.map(([, c]) => c),
    1
  );

  const statusCounts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    processed: leads.filter((l) => l.status === "processed").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };
  const statusColors = {
    new: "var(--navy-500)",
    contacted: "var(--amber-500)",
    processed: "var(--accent)",
    closed: "var(--emerald-500)",
  };
  const statusLabels = {
    new: "Baru",
    contacted: "Dihubungi",
    processed: "Proses",
    closed: "Selesai",
  };
  const totalForDonut = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  let donutGradient = "";
  let cumulativePercent = 0;
  const donutParts = (Object.entries(statusCounts) as [string, number][]).map(
    ([status, count]) => {
      const percent = totalForDonut > 0 ? (count / totalForDonut) * 100 : 0;
      const start = cumulativePercent;
      cumulativePercent += percent;
      return `${statusColors[status as keyof typeof statusColors]} ${start}% ${cumulativePercent}%`;
    }
  );
  donutGradient = `conic-gradient(${donutParts.join(", ")})`;

  const recentLeads = [...leads]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

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
    });
  }

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Leads</div>
          <div className="stat-value stat-navy">{totalLeads}</div>
          <div className="stat-note">Semua data pengajuan</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Leads Baru</div>
          <div className="stat-value stat-accent">{newLeads}</div>
          <div className="stat-note">Belum dihubungi</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Dalam Proses</div>
          <div className="stat-value" style={{ color: "var(--amber-700)" }}>
            {processedLeads}
          </div>
          <div className="stat-note">Sedang diproses bank</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Selesai (Cair)</div>
          <div className="stat-value stat-emerald">{closedLeads}</div>
          <div className="stat-note">Kredit sudah cair</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Leads per Provinsi</h3>
          </div>
          <div className="chart-bar-list">
            {sortedProvinces.map(([province, count]) => (
              <div key={province} className="chart-bar-row">
                <div className="chart-bar-label">{province}</div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill bni"
                    style={{
                      width: `${(count / maxProvinceCount) * 100}%`,
                    }}
                  >
                    <span className="chart-bar-count">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Status Leads</h3>
          </div>
          <div className="donut-wrap">
            <div
              className="donut"
              style={{ background: donutGradient }}
            />
            <div className="donut-legend">
              {(Object.entries(statusCounts) as [string, number][]).map(
                ([status, count]) => (
                  <div key={status} className="legend-item">
                    <div
                      className="legend-dot"
                      style={{
                        background:
                          statusColors[status as keyof typeof statusColors],
                      }}
                    />
                    {statusLabels[status as keyof typeof statusLabels]}: {count}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">Leads Terbaru</h3>
          <Link href="/admin/leads" className="btn btn-sm btn-secondary">
            Lihat Semua
          </Link>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>WhatsApp</th>
                <th>Jenis Pensiun</th>
                <th>Pinjaman</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="table-link">{lead.name}</td>
                  <td className="table-mono">{lead.whatsapp}</td>
                  <td>{lead.pensionType}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h3 className="card-title">Bank Mitra Aktif</h3>
          <Link
            href="/admin/bank-products"
            className="btn btn-sm btn-secondary"
          >
            Kelola
          </Link>
        </div>
        <div className="stat-grid" style={{ marginBottom: 0 }}>
          <div className="stat-card">
            <div className="stat-label">Bank Aktif</div>
            <div className="stat-value stat-emerald">{activeBanks}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Produk</div>
            <div className="stat-value stat-navy">{banks.length}</div>
          </div>
        </div>
      </div>
    </>
  );
}
