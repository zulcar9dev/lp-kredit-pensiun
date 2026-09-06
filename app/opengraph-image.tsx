import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Kredit Pensiun — Sudah pensiun, masih butuh dana? Saya bantu urus sampai cair.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          backgroundColor: "#0B2547",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "#F26F21",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            K
          </div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
            Kredit Pensiun
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 66,
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          Sudah Pensiun, Masih Butuh Dana? Saya Bantu Urus Sampai Cair.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            color: "#B8CDE5",
            maxWidth: 940,
          }}
        >
          Gratis konsultasi via WhatsApp. Pilihan produk dari beberapa bank
          mitra, disesuaikan dengan dana pensiun Bapak/Ibu.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 22,
            color: "#84A8CF",
          }}
        >
          Agen pemasaran independen — bukan bagian dari bank mana pun.
        </div>
      </div>
    ),
    size
  );
}
