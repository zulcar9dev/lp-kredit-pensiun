"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { fetchLeads, type LeadRow } from "@/lib/actions/leads";
import { fetchWaClicks } from "@/lib/actions/wa-clicks";
import { formatRupiah } from "@/lib/format";
import { pensionDbToLabel } from "@/lib/constants";
import {
  fetchBankProducts,
  type BankProductRow,
} from "@/lib/actions/bank-products";
import type { WaClick } from "@/lib/types/database";

const RELATION_LABELS: Record<string, string> = {
  sendiri: "Diri sendiri",
  orang_tua: "Orang tua",
};

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [banks, setBanks] = useState<BankProductRow[]>([]);
  const [waClicks, setWaClicks] = useState<WaClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLeads({ limit: 0 }), fetchBankProducts(), fetchWaClicks()])
      .then(([l, b, c]) => {
        setLeads(l.rows);
        setBanks(b);
        setWaClicks(c);
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
  // PRD §6.5: kartu "bulan ini" (KPI volume 10–25 lead/bln) — zona Asia/Jakarta
  const monthStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
  const monthLeads = leads.filter(
    (l) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
      }).format(new Date(l.created_at)) === monthStr
  ).length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const qualifiedLeads = leads.filter((l) => l.status === "qualified").length;
  const approvedLeads = leads.filter((l) => l.status === "approved").length;
  const activeBanks = banks.filter((b) => b.is_active).length;

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const waClicksWeek = waClicks.filter(
    (c) => new Date(c.created_at).getTime() >= weekAgo
  ).length;

  const relationCounts = leads.reduce(
    (acc, lead) => {
      const key = lead.applicant_relation || "sendiri";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const sortedRelations = Object.entries(relationCounts).sort(
    ([, a], [, b]) => b - a
  );
  const maxRelationCount = Math.max(
    ...sortedRelations.map(([, c]) => c),
    1
  );

  // PRD §6.5: chart distribusi jenis pensiun (label ramah via mapping DB)
  const pensionCounts = leads.reduce(
    (acc, lead) => {
      const key = lead.pension_type || "-";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const sortedPensions = Object.entries(pensionCounts).sort(
    ([, a], [, b]) => b - a
  );
  const maxPensionCount = Math.max(
    ...sortedPensions.map(([, c]) => c),
    1
  );

  const clickCampaignCounts = waClicks.reduce(
    (acc, click) => {
      const campaign = click.utm_campaign || "Direct / Organic";
      acc[campaign] = (acc[campaign] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const campaignCounts = leads.reduce(
    (acc, lead) => {
      const campaign = lead.utm_campaign || "Direct / Organic";
      acc[campaign] = (acc[campaign] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // PRD §6.5: tabel gabungan leads & klik WA per campaign (union kedua sumber)
  const campaignRows = Array.from(
    new Set([
      ...Object.keys(clickCampaignCounts),
      ...Object.keys(campaignCounts),
    ])
  )
    .map((campaign) => ({
      campaign,
      leads: campaignCounts[campaign] ?? 0,
      clicks: clickCampaignCounts[campaign] ?? 0,
    }))
    .sort((a, b) => b.leads - a.leads || b.clicks - a.clicks)
    .slice(0, 10);

  const statusCounts = {
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    approved: leads.filter((l) => l.status === "approved").length,
    rejected: leads.filter((l) => l.status === "rejected").length,
    invalid: leads.filter((l) => l.status === "invalid").length,
  };
  const statusColors = {
    new: "var(--navy-500)",
    contacted: "var(--amber-500)",
    qualified: "var(--accent)",
    approved: "var(--emerald-500)",
    rejected: "var(--red-500)",
    invalid: "var(--stone-400)",
  };
  const statusLabels = {
    new: "Baru",
    contacted: "Dihubungi",
    qualified: "Kualifikasi",
    approved: "Disetujui",
    rejected: "Ditolak",
    invalid: "Invalid",
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
          <div className="stat-label">Leads Bulan Ini</div>
          <div className="stat-value stat-accent">{monthLeads}</div>
          <div className="stat-note">Masuk bulan berjalan</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Klik WA (7 hari)</div>
          <div className="stat-value" style={{ color: "var(--wa, #25d366)" }}>
            {waClicksWeek}
          </div>
          <div className="stat-note">Klik CTA WhatsApp</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Leads Baru</div>
          <div className="stat-value" style={{ color: "var(--navy-500)" }}>
            {newLeads}
          </div>
          <div className="stat-note">Belum dihubungi</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Kualifikasi</div>
          <div className="stat-value" style={{ color: "var(--amber-700)" }}>
            {qualifiedLeads}
          </div>
          <div className="stat-note">Layak diajukan ke bank</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Disetujui (Cair)</div>
          <div className="stat-value stat-emerald">{approvedLeads}</div>
          <div className="stat-note">Kredit sudah cair</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Distribusi Pengajuan</h3>
          </div>
          <div className="chart-bar-list">
            {sortedRelations.length === 0 && (
              <p className="text-muted" style={{ padding: "1rem", fontSize: "var(--text-sm)" }}>Belum ada data</p>
            )}
            {sortedRelations.map(([relation, count]) => (
              <div key={relation} className="chart-bar-row">
                <div className="chart-bar-label">
                  {RELATION_LABELS[relation] || relation}
                </div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill accent"
                    style={{
                      width: `${(count / maxRelationCount) * 100}%`,
                    }}
                  >
                    <span className="chart-bar-count">{count}</span>
                  </div>
                </div>
              </div>
            ))}
            <p
              className="text-muted"
              style={{ padding: "0.75rem 1rem 0", fontSize: "var(--text-sm)", fontWeight: 700 }}
            >
              Jenis Pensiun
            </p>
            {sortedPensions.length === 0 && (
              <p className="text-muted" style={{ padding: "1rem", fontSize: "var(--text-sm)" }}>Belum ada data</p>
            )}
            {sortedPensions.map(([pension, count]) => (
              <div key={pension} className="chart-bar-row">
                <div className="chart-bar-label">
                  {pensionDbToLabel(pension)}
                </div>
                <div className="chart-bar-track">
                  <div
                    className="chart-bar-fill accent"
                    style={{
                      width: `${(count / maxPensionCount) * 100}%`,
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

      <div className="card" style={{ marginTop: "24px" }}>
        <div className="card-header">
          <h3 className="card-title">Performa per Kampanye</h3>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Kampanye</th>
                <th>Leads</th>
                <th>Klik WA</th>
              </tr>
            </thead>
            <tbody>
              {campaignRows.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-muted" style={{ textAlign: "center", padding: "2rem" }}>
                    Belum ada data
                  </td>
                </tr>
              )}
              {campaignRows.map((row) => (
                <tr key={row.campaign}>
                  <td className="table-link">{row.campaign}</td>
                  <td>{row.leads}</td>
                  <td>{row.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <td>{pensionDbToLabel(lead.pension_type)}</td>
                  <td>{formatRupiah(lead.loan_amount)}</td>
                  <td>
                    <span className={`badge badge-${lead.status}`}>
                      {lead.status === "new"
                        ? "Baru"
                        : lead.status === "contacted"
                          ? "Dihubungi"
                          : lead.status === "qualified"
                            ? "Kualifikasi"
                            : lead.status === "approved"
                              ? "Disetujui"
                              : lead.status === "rejected"
                                ? "Ditolak"
                                : "Invalid"}
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
