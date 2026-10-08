"""Implementasi REFERENSI aturan inti SEMBURAT (dari PRD).

Tujuan: spesifikasi yang bisa dijalankan. Bandingkan perilakunya dengan implementasi Anda
di services/ lalu sesuaikan satu sama lain. Jangan menimpa kode Anda dengan file ini.
"""
from __future__ import annotations

import re
import unicodedata

# ---------- Trend scoring (PRD bagian 11.2) ----------
WEIGHTS = {
    "velocity": 0.25,
    "search_interest": 0.20,
    "source_count": 0.15,
    "relevance": 0.15,
    "freshness": 0.10,
    "monetization": 0.10,
}
RISK_PENALTY = 0.15  # dikurangkan dari skor


def trend_score(signals: dict, normalize: bool = False) -> float:
    """Semua sinyal berskala 0-100. Hasil dijepit 0-100.

    CATATAN: bobot positif PRD berjumlah 95%, jadi skor maksimum 95 bila risiko 0.
    Ambang 'Priority' (90-100) tetap dapat dicapai, tetapi skor 100 tidak mungkin.
    Setel normalize=True bila ingin skala penuh 0-100.
    """
    total = sum(WEIGHTS[k] * float(signals.get(k, 0)) for k in WEIGHTS)
    if normalize:
        total = total / sum(WEIGHTS.values())
    total -= RISK_PENALTY * float(signals.get("risk", 0))
    return max(0.0, min(100.0, total))


def trend_action(score: float) -> str:
    if score >= 90:
        return "priority"
    if score >= 75:
        return "generate"
    if score >= 60:
        return "queue"
    if score >= 40:
        return "monitor"
    return "ignore"


# ---------- Klasifikasi risiko (PRD bagian 17) ----------
HIGH_RISK_KEYWORDS = [
    # politik
    "pemilu", "pilkada", "presiden", "partai", "korupsi", "demo", "kerusuhan",
    # kriminal / hukum / tuduhan
    "pembunuhan", "pembunuh", "kriminal", "narkoba", "tersangka", "ditangkap", "penipuan",
    "pelecehan", "kekerasan", "gugatan", "pidana", "diduga",
    # kesehatan
    "penyakit", "vaksin", "kanker", "diabetes", "obat", "gejala", "diagnosis",
    # saran keuangan
    "investasi", "saham", "kripto", "trading", "pinjol", "bodong",
    # anak, bencana, kejadian darurat
    "anak di bawah umur", "gempa", "banjir", "tsunami", "bencana", "korban",
    "meninggal", "tewas", "terorisme",
]
MEDIUM_RISK_KEYWORDS = [
    "kontroversi", "dikritik", "viral", "komplain", "keluhan", "boikot", "dihujat",
    "klarifikasi", "cancel", "skandal", "tagihan", "paylater",
]


def classify_risk(text: str) -> str:
    """Pengklasifikasi KONSERVATIF berbasis kata kunci. Dipakai sebagai lantai pengaman:
    hasil final sebaiknya max(keyword, klasifikasi LLM). Kata kunci tidak pernah menurunkan risiko."""
    t = text.lower()
    if any(re.search(rf"\b{re.escape(k)}\b", t) for k in HIGH_RISK_KEYWORDS):
        return "high"
    if any(re.search(rf"\b{re.escape(k)}\b", t) for k in MEDIUM_RISK_KEYWORDS):
        return "medium"
    return "low"


# ---------- Quality score (PRD bagian 16) ----------
QUALITY_WEIGHTS = {
    "accuracy": 0.25,
    "source_quality": 0.15,
    "originality": 0.15,
    "completeness": 0.10,
    "seo": 0.10,
    "readability": 0.10,
    "brand_fit": 0.05,
    "visual": 0.05,
    "risk_adjustment": 0.05,  # 100 = aman, 0 = sangat berisiko
}


def quality_score(parts: dict) -> float:
    return sum(QUALITY_WEIGHTS[k] * float(parts.get(k, 0)) for k in QUALITY_WEIGHTS)


# ---------- Aturan publish (PRD bagian 16 + soft launch) ----------
def publish_decision(score: float, risk: str, sensitive: bool = False, auto_publish_enabled: bool = False) -> str:
    """Kembalikan: auto_publish | editorial_review | regenerate | reject.

    - Topik sensitif / risiko selain 'low' tidak pernah auto publish.
    - Selama soft launch, auto_publish_enabled=False: skor >= 90 pun masuk review.
    """
    if score < 60:
        return "reject"
    if score < 75:
        return "regenerate"
    if sensitive or risk in ("medium", "high"):
        return "editorial_review"
    if score >= 90 and auto_publish_enabled:
        return "auto_publish"
    return "editorial_review"


# ---------- Slug ----------
def slugify(text: str, max_len: int = 80) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii").lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    if len(text) <= max_len:
        return text
    cut = text[:max_len]
    if "-" in cut:
        cut = cut[: cut.rfind("-")]
    return cut.strip("-")


# ---------- Deteksi duplikat tren / judul ----------
STOPWORDS = {"yang", "di", "ke", "dan", "dari", "untuk", "dengan", "ini", "itu", "apa", "saja", "adalah", "pada", "the", "a", "of"}


PREFIXES = ("meng", "meny", "mem", "men", "me", "ter", "ber", "di", "pe")


def _stem(word: str) -> str:
    """Stemmer awalan Indonesia yang SANGAT ringan (hanya awalan, sisa minimal 4 huruf).

    Cukup untuk menyamakan 'terbaru'~'baru' dan 'mengubah'~'ubah'. Keterbatasan: 'berubah' -> 'rubah'.
    Untuk produksi, tambahkan perbandingan semantik (embedding) sesuai PRD bagian 40.
    """
    for pre in PREFIXES:
        if word.startswith(pre) and len(word) - len(pre) >= 4:
            return word[len(pre):]
    return word


def _tokens(title: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", slugify(title).replace("-", " "))
    return {_stem(w) for w in words if w not in STOPWORDS and len(w) > 1}


def title_similarity(a: str, b: str) -> float:
    ta, tb = _tokens(a), _tokens(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / len(ta | tb)


def is_duplicate(a: str, b: str, threshold: float = 0.6) -> bool:
    return title_similarity(a, b) >= threshold


# ---------- Kredit visual (PRD bagian 20) ----------
def build_credit(asset: dict) -> str:
    """Hasilkan teks kredit dari data aset. Mengembalikan string kosong bila tidak perlu kredit."""
    kind = asset.get("license_type", "")
    creator = asset.get("creator") or asset.get("source_name") or ""
    source = asset.get("source_name") or ""
    if kind == "ai_generated":
        return "Ilustrasi dibuat dengan AI oleh SEMBURAT"
    if kind == "original":
        return ""
    if kind in ("official", "press_kit"):
        who = source or creator
        return f"Gambar: {who} (media kit resmi)" if kind == "press_kit" else f"Gambar: {who}"
    if kind in ("licensed", "public_domain"):
        text = f"Gambar: {creator}" if creator else "Gambar"
        if source and source != creator:
            text += f" / {source}"
        lic = asset.get("license_name")
        return f"{text}, {lic}" if lic else text
    return f"Gambar: {creator or source}".strip()
