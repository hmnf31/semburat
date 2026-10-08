#!/usr/bin/env python3
"""Simulator pendapatan SEMBURAT, 24 bulan, tiga skenario.

Semua angka adalah ASUMSI yang bisa Anda ubah lewat argumen atau dengan mengedit PARAMS.
Ini alat berpikir, bukan ramalan. Ganti dengan data nyata Search Console/AdSense begitu ada.

Contoh:
  python tools/revenue_simulator.py
  python tools/revenue_simulator.py --scenario dasar --rpm-ad 20000 --rpm-aff 10000
  python tools/revenue_simulator.py --csv hasil.csv
"""
from __future__ import annotations

import argparse
import csv

# Setiap skenario punya kurva sendiri (bulan -> pageview/hari, diinterpolasi linear di antara titik).
#  - buruk : traffic stagnan (konten tipis/tidak konsisten/tidak terindeks baik). Iklan baru disetujui terlambat.
#  - dasar : pertumbuhan wajar untuk situs baru yang konsisten dan fokus niche.
#  - baik  : sekitar 2x skenario dasar. Optimistis dan jarang terjadi; jangan jadikan target perencanaan.
SCENARIOS = {
    "buruk": {
        "anchors": [(0, 0), (1, 5), (3, 40), (6, 200), (12, 400), (24, 500)],
        "ads_from_month": 9, "aff_from_month": 6, "sponsor_mult": 0.0,
    },
    "dasar": {
        "anchors": [(0, 0), (1, 10), (3, 150), (6, 1500), (9, 5000), (12, 12000), (18, 45000), (24, 90000)],
        "ads_from_month": 4, "aff_from_month": 3, "sponsor_mult": 1.0,
    },
    "baik": {
        "anchors": [(0, 0), (1, 20), (3, 300), (6, 3000), (9, 10000), (12, 24000), (18, 90000), (24, 180000)],
        "ads_from_month": 3, "aff_from_month": 2, "sponsor_mult": 1.5,
    },
}

PARAMS = {
    "rpm_ad": 20_000,        # Rp per 1.000 pageview (iklan display, setelah disetujui)
    "rpm_aff": 10_000,       # Rp per 1.000 pageview (afiliasi, bila ada konten bernuansa beli)
    "reinvest_share": 0.35,  # porsi pendapatan yang diinvestasikan kembali
    "domain_cost_year": 200_000,
    # sponsor skenario dasar: (mulai_bulan, Rp/bulan)
    "sponsor": [(9, 1_000_000), (12, 3_000_000), (18, 8_000_000)],
}


def pageviews_per_day(month: int, scenario: str) -> float:
    anchors = SCENARIOS[scenario]["anchors"]
    for (m0, v0), (m1, v1) in zip(anchors, anchors[1:]):
        if m0 <= month <= m1:
            return v0 + (v1 - v0) * (month - m0) / (m1 - m0)
    return float(anchors[-1][1])


def simulate(scenario: str, p: dict) -> list[dict]:
    cfg = SCENARIOS[scenario]
    rows = []
    cumulative = 0.0
    for month in range(1, 25):
        pvd = pageviews_per_day(month, scenario)
        pv_month = pvd * 30
        ad = pv_month / 1000 * p["rpm_ad"] if month >= cfg["ads_from_month"] else 0.0
        aff = pv_month / 1000 * p["rpm_aff"] if month >= cfg["aff_from_month"] else 0.0
        sponsor = 0.0
        for start, amount in p["sponsor"]:
            if month >= start:
                sponsor = amount * cfg["sponsor_mult"]
        total = ad + aff + sponsor
        reinvest = total * p["reinvest_share"]
        domain = p["domain_cost_year"] / 12
        net = total - reinvest - domain
        cumulative += net
        rows.append({
            "bulan": month, "pageview_per_hari": round(pvd), "pageview_per_bulan": round(pv_month),
            "iklan": round(ad), "afiliasi": round(aff), "sponsor": round(sponsor),
            "total": round(total), "reinvestasi": round(reinvest), "bersih_setelah_domain": round(net),
            "kumulatif_bersih": round(cumulative),
        })
    return rows


def fmt(n: float) -> str:
    return f"{n:,.0f}".replace(",", ".")


def print_table(name: str, rows: list[dict], months: list[int]) -> None:
    print(f"\n## Skenario {name.upper()}")
    print("| Bulan | Pageview/hari | Iklan | Afiliasi | Sponsor | Total (Rp) | Kumulatif bersih* (Rp) |")
    print("|---|---|---|---|---|---|---|")
    for r in rows:
        if r["bulan"] in months:
            print(f"| {r['bulan']} | {fmt(r['pageview_per_hari'])} | {fmt(r['iklan'])} | {fmt(r['afiliasi'])} | "
                  f"{fmt(r['sponsor'])} | {fmt(r['total'])} | {fmt(r['kumulatif_bersih'])} |")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--scenario", choices=list(SCENARIOS) + ["semua"], default="semua")
    ap.add_argument("--rpm-ad", type=int, default=PARAMS["rpm_ad"])
    ap.add_argument("--rpm-aff", type=int, default=PARAMS["rpm_aff"])
    ap.add_argument("--csv", help="simpan semua baris ke file CSV")
    args = ap.parse_args()

    p = {**PARAMS, "rpm_ad": args.rpm_ad, "rpm_aff": args.rpm_aff}
    scenarios = list(SCENARIOS) if args.scenario == "semua" else [args.scenario]
    milestones = [1, 3, 6, 9, 12, 18, 24]

    print(f"Asumsi: RPM iklan Rp {fmt(p['rpm_ad'])}, RPM afiliasi Rp {fmt(p['rpm_aff'])}, "
          f"reinvestasi {int(p['reinvest_share']*100)}%, biaya domain Rp {fmt(p['domain_cost_year'])}/tahun.")
    all_rows = []
    for s in scenarios:
        rows = simulate(s, p)
        print_table(s, rows, milestones)
        all_rows += [{"skenario": s, **r} for r in rows]

    print("\n* Kumulatif bersih = total pendapatan dikurangi reinvestasi dan domain. BELUM termasuk biaya API/LLM "
          "berbayar (di luar reinvestasi) dan nilai waktu Anda sebagai operator/editor. Pajak tidak dihitung.")
    if args.csv:
        with open(args.csv, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(all_rows[0].keys()))
            w.writeheader()
            w.writerows(all_rows)
        print(f"\nCSV disimpan: {args.csv}")


if __name__ == "__main__":
    main()
