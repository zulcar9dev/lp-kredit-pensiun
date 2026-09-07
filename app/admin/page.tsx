"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { fetchLeads, type LeadRow } from "@/lib/actions/leads";
import { formatRupiah } from "@/lib/format";
import {
  fetchBankProducts,
  type BankProductRow,
} from "@/lib/actions/bank-products";

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [banks, setBanks] = useState<BankProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLeads({ limit: 0 }), fetchBankProducts()])
      .then(([l, b]) => {
        setLeads(l.rows);
        setBanks(b);
      })
      .catch((err) => {
        console.error("Gagal memuat data dashboard:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const todayLeads = leads.filter(
    (l) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(l.created_at)) === todayStr
  ).length;
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const processedLeads = leads.filter((l) => l.status === "processed").length;
  const closedLeads = leads.filter((l) => l.status === "closed").length;
  const activeBanks = banks.filter((b) => b.is_active).length;

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

  const bankCounts = leads.reduce(
    (acc, lead) => {
      const bank = lead.interested_bank || "Belum ditentukan";
      acc[bank] = (acc[bank] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const sortedBanks = Object.entries(bankCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  const maxBankCount = Math.max(
    ...sortedBanks.map(([, c]) => c),
    1
  );

  const campaignCounts = leads.reduce(
    (acc, lead) => {
      const campaign = lead.utm_campaign || "Direct / Organic";
      acc[campaign] = (acc[campaign] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const sortedCampaigns = Object.entries(campaignCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const maxCampaignCount = Math.max(
    ...sortedCampaigns.map(([, c]) => c),
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
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  }

  if (loading) {
    return (
      <div className="empty-state" style={{ padding: "4rem" }}>
        <CircleNotch weight="bold" className="animate-spin" />
        <p>Memuat data dashboard...</p>
      </div>
    );
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
          <div className="stat-label">Leads Hari Ini</div>
          <div className="stat-value stat-accent">{todayLeads}</div>
          <div className="stat-note">Masuk hari ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Leads Baru</div>
          <div className="stat-value" style={{ color: "var(--navy-500)" }}>
            {newLeads}
          </div>
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
            {sortedProvinces.length === 0 && (
              <p className="text-muted" style={{ padding: "1rem", fontSize: "var(--text-sm)" }}>Belum ada data</p>
            )}
            {sortedProvinces.map(([province, count]) => (
              <div key={province} className="chart-bar-row">
                <div className="chart-bar-label">{province}</div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill accent"
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

      <div className="dashboard-grid" style={{ marginTop: "24px" }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Leads per Bank Pilihan</h3>
          </div>
          <div className="chart-bar-list">
            {sortedBanks.length === 0 && (
              <p className="text-muted" style={{ padding: "1rem", fontSize: "var(--text-sm)" }}>Belum ada data</p>
            )}
            {sortedBanks.map(([bank, count]) => (
              <div key={bank} className="chart-bar-row">
                <div className="chart-bar-label">{bank}</div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill wa"
                    style={{
                      width: `${(count / maxBankCount) * 100}%`,
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
            <h3 className="card-title">Leads per Kampanye UTM</h3>
          </div>
          <div className="chart-bar-list">
            {sortedCampaigns.length === 0 && (
              <p className="text-muted" style={{ padding: "1rem", fontSize: "var(--text-sm)" }}>Belum ada data</p>
            )}
            {sortedCampaigns.map(([campaign, count]) => (
              <div key={campaign} className="chart-bar-row">
                <div className="chart-bar-label">{campaign}</div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill accent"
                    style={{
                      width: `${(count / maxCampaignCount) * 100}%`,
                    }}
                  >
                    <span className="chart-bar-count">{count}</span>
                  </div>
                </div>
              </div>
            ))}
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
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted" style={{ textAlign: "center", padding: "2rem" }}>
                    Belum ada leads
                  </td>
                </tr>
              )}
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className="table-link">{lead.name}</td>
                  <td className="table-mono">{lead.whatsapp}</td>
                  <td>{lead.pension_type}</td>
                  <td>{formatRupiah(lead.loan_amount)}</td>
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
                    {formatDate(lead.created_at)}
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
