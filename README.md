# UNSEEN SIDE — Premium Virtual Model Portfolio & Private Admin Dashboard

A high-end digital fashion editorial and virtual model platform featuring **Krish-Kartik** under the brand **UNSEEN SIDE**.

---

## 1. Visual Identity & Editorial Design System

* **Aesthetic**: Brutalist high-fashion editorial inspired by luxury creative studio portfolios.
* **Color Palette**:
  * Deep Black: `#080808`
  * Crimson Red: `#E50920` (Hover: `#FF1A2E`, Glow: `rgba(229, 9, 32, 0.25)`)
  * Crisp White (`#FFFFFF`) & Muted Grey (`#8A8A93`) typography
  * Hairline Dark-Grey Separators (`#1F1F23`, `#27272A`)
* **Monumental Typography**:
  * Massive brutalist background display text (*"UNSEEN"*) layered behind the foreground model photograph.
  * Modern architectural grotesque typography (*Syne*, *Space Grotesk*, *Bebas Neue*).
* **Live Status Beacon**: Pulsing crimson red availability indicator (*"• AVAILABLE FOR S/S 2027 CAMPAIGNS"*).

---

## 2. Preserved Original Virtual Model Photography

The application uses exclusively the user's authentic virtual model photographs stored in `/public/images/model/`:

| Image ID | Editorial Feature | Resolution | Format |
|---|---|---|---|
| `MAG4HVhB6wU` | Hero Dominant Foreground & Look 02 | 768 × 1344 | PNG |
| `MAG4HXn1Ddc` | Studio Portrait Frame | 1024 × 1024 | PNG |
| `MAG4HcPeUYw` | Look 01 (Redefine Your Style) | 768 × 1344 | PNG |
| `MAG4HYR_A7w` | Look 03 (Elevate Every Look) | 1349 × 2400 | JPG |
| `MAG4HSPewnY` | Studio Series No. 01 | 1024 × 1024 | PNG |
| `MAG4HfGCyb8` | Studio Series No. 02 | 1024 × 1033 | JPG |
| `MAG4HWV5JEs` | Studio Series No. 03 | 1024 × 1024 | PNG |
| `MAG4TnGu_Jk` | Unfold Your Bold Side | 1079 × 770 | JPG |
| `MAG4HQvAr1w` | The Art Of Effortless Dressing | 2048 × 2048 | JPG |
| `MAG4TkFm208` | 3 Sides: The Bold | 1740 × 2400 | JPG |
| `MAG4TkcgeSk` | 3 Sides: The Elegant | 1744 × 2184 | JPG |
| `MAG4TmjoRGk` | 3 Sides: The Wild | 950 × 1155 | JPG |
| `MAG4HrL4MzU` | Archive Full Silhouette | 1600 × 2400 | PNG |
| `MAG4HaRUIzo` | Archive Signature Frame | 1024 × 1024 | PNG |

---

## 3. Dedicated Private Admin Dashboard (`/admin`)

Access via route `/admin` (or `#/admin`):
* **Security & Authentication**: Firebase Authentication with Google Sign-In. Access restricted to administrator account (`gdayoota@gmail.com`).
* **Image Management**:
  * Upload new model photographs (local file drag-and-drop or path input).
  * Instant image preview before saving.
  * Edit look metadata: title, caption, category, series, alt text, and order.
  * Replace an existing image file without deleting the record.
  * Delete looks with confirmation modal.
  * Reorder looks with move-up controls.
  * Toggle publish / unpublish (only published items appear on the public site).
  * Search and filter by category or status.
* **Website Content Editor**:
  * Edit hero backdrop text (*"UNSEEN"*), headline, subtitle, hero image selection, about manifesto, contact info, social links, and footer.
  * All mutations persist in Cloud Firestore collection `/content/site_content`.
* **Inquiries Inbox**:
  * Review collaboration submissions in real time.
  * Status workflows (*New*, *Reviewed*, *Archived*).
* **One-Click Seeding**: Seed Firestore with the authentic original images and reference copy.

---

## 4. Full-Stack Express Server & Development

```bash
# Start development server (Node.js Express + Vite middleware)
npm run dev

# Run TypeScript linter
npm run lint

# Compile production bundle
npm run build

# Start production server
npm start
```
