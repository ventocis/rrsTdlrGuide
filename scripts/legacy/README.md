# Legacy one-time importers — not the current pipeline

These two scripts built the original `providers.json` and `courts.json` from
spreadsheets. They are kept for provenance only. **Do not run them.**

Both were already inert when they were moved here: neither was wired to an npm
script, `parse-xlsx.mjs` read a `TX Course Guide.xlsx` that does not exist in
this repo, and both wrote to a root `data/` directory that nothing imported.
That dead directory is what made a July 2026 fix land in a file the site never
reads, so the fix appeared to deploy and changed nothing.

The live data file is `src/data/providers.json`, maintained by hand and by the
TDLR scripts in the parent directory:

| Command | What it does |
|---|---|
| `npm run data:pull` | downloads TDLR's authoritative licence files |
| `npm run data:reconcile` | diffs a snapshot against the live data |
| `npm run data:groups` | proposes operator groupings for review |
| `npm run check:data` | validates the live data before it ships |

If a spreadsheet import is ever wanted again, write it to merge into
`src/data/providers.json` rather than overwrite it — the live file carries
hand-verified corrections the spreadsheets do not have.
