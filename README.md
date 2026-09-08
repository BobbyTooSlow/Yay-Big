# Yay Big master-data v2

This migration is based on the attached `questions_plus_200(1).json`.

The source file contains **431 total records**:
- **231 previously vetted Items** (IDs below yb-00401) → migrated to `status: "Keep"`
- **200 newly generated, not-yet-reviewed Items** (yb-00401 through yb-00600) → migrated to `status: "Review"`

All Items currently carry `regionTags: ["USCanada"]` as the provisional launch audience. Review Items are NOT playable because the game only selects `status: "Keep"` Items tagged `USCanada` or `Global`.

Files:
- `index.html` — 8-question game with the 0–1000 scoring system, reading `items.json`.
- `dashboard.html` — master Item editor with Review / Keep / Not US / Bad Item workflow and region tags.
- `items.json` — schemaVersion 2 master database containing all 431 records.
- `ITEM_GENERATOR_INSTRUCTIONS.md` — paste into the renamed Item Generator chat.

Important: Nothing is physically deleted from the master database. `BadItem` exists specifically to prevent rejected ideas from being generated again.

## Permanent IDs

The canonical ID format is now `yb-XXXXX` (five zero-padded digits). Existing records were migrated without changing their numeric identity; for example, `yb-0401` became `yb-00401`. The next ID after the current `yb-00600` is `yb-00601`.
