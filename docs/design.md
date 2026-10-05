# Design plan

Brief: the portfolio of a backend engineer who lives in Neovim and Gruvbox.
Audience: internship recruiters (5 seconds, skimming) and engineers (curious, will poke at it).
Primary job: say who, where now, what's wanted (Summer 2027 internships), and give resume + email. Then show depth.

## Pass 1

### Concept
The page *is* an open Neovim buffer, `touseef.md`. Not a terminal costume around a
landing page. The structure a vim user sees every day carries the content: a
line-number gutter, folds, a statusline, `~` past end of buffer. Nothing is in a card.

### Colour (Gruvbox dark hard, used as syntax, never as decoration)
| token     | hex       | role                                                   |
|-----------|-----------|--------------------------------------------------------|
| `--bg`    | `#1d2021` | the buffer                                             |
| `--fg`    | `#ebdbb2` | text                                                   |
| `--dim`   | `#928374` | comments, gutter, `##` markers, tildes                 |
| `--cursor`| `#fabd2f` | cursor line number and the block cursor, nothing else  |
| `--head`  | `#fe8019` | markdown headings (the text after `##`)                |
| `--str`   | `#b8bb26` | strings / numbers that matter (metrics)                |
| `--link`  | `#83a598` | links (underlined, like vim's `markdownUrl`)           |
| `--kw`    | `#d3869b` | keywords in the one code block                         |
Surfaces: `--bg1 #282828` (cursorline, statusline right side), `--bg3 #3c3836` (rules).

### Type
- **Monaspace Neon** (variable, wght 300–800, wdth 100–125): everything.
  The name is set at wdth 125, wght 800, so the type itself is the display element.
- **Monaspace Radon** (handwriting-style): only comments (`# …`, `-- …`), standing in
  for italic comments in a good colourscheme. Two clearly different voices, one family.
- Scale (Elements-style, ratio about 1.333): 13 / 15 / 20 / clamp(34, 7vw, 64).
  One line = 1.65em; every vertical gap is a whole number of lines.

### Layout
Left aligned, ragged right, measure 72ch, a colorcolumn hairline at 80ch (desktop only).

```
desktop (1440)                                   mobile (375)
 bufferline: touseef.md  work  log  stack  mail  | touseef.md            [≡]
---------------------------------------------------+------------------------
  3 |                                              |  1 |
  2 | Mohammed Touseef Ansari    (wide, heavy)     |  0 | Mohammed
  1 |                                              |  1 | Touseef
 12 | Working on autonomous driving at Inverted AI |  2 | Ansari
  1 | in Vancouver. Looking for Summer 2027        |  3 | Working on autonomous
  2 | internships.                                 |  4 | driving at Inverted…
  3 | [resume] [github] [linkedin] [email]█        |  5 | [resume] [email]
  4 |                                              |    | [github] [linkedin]
  5 | ## work                                      |  6 |
  6 | ▸ portcullis    go   rate limiter, <1ms  2026|  7 | ## work
  7 | ▸ fastSQL-qe    py   10M-row SQL engine  2026|  8 | ▸ portcullis    2026
    |   ...                                        |    |   go, rate limiter
    | ## log                                       |    |
    | * 2026  Inverted AI  autonomous driving      |    |
    | |                                            |    |
    | * 2025  Markaba  automation intern           |    |
    |   ...                                        |    |
    | ## stack  (lua table)                        |    |
    | ## mail   (commit buffer)                    |    |
  ~ |                                              |  ~ |
---------------------------------------------------+------------------------
 NORMAL  touseef.md · work      12:1   34%       | NORMAL  work   34%
```

### Principles
1. **Boldness spent in one place:** the live buffer (relativenumber gutter + cursorline +
   statusline reacting as you scroll). Everything else is quiet text.
2. Every structural device means what it means in vim. A fold hides detail, the gutter
   counts lines, the statusline reports state. Nothing is ornamental.
3. Recruiter path first: name, current role, ask, resume, email above the fold at 375px.
4. Motion only answers the reader (fold opens, cursor moves, mode changes), plus one
   ~600ms startup moment on first visit.

## Pass 2: review against the brief

What I'd produce for any "dev portfolio, terminal theme" and what changed here:

- **Fake shell with `$ whoami` typed out:** the genre default. Changed to a buffer you
  *read*, not a shell you watch. No typewriter.
- **Near-black + one bright accent (frontend-design tell #2):** Gruvbox is pinned by the
  brief, but yellow is limited to the cursor. The rest is muted multi-hue syntax colour
  with meaning.
- **Hairline rules + zero radius (tell #3):** only the two lines vim actually draws
  (colorcolumn, statusline edge). No section dividers; headings and blank lines separate.
- **Middle-dot meta strings (tell #5):** none in copy or project rows; aligned columns
  separate fields. (The statusline separator above is drawn as a vim `│` in the build.)
- **`→` on links and list markers (tell #5):** removed. Lists use `-` like markdown.
- **Accent on one word of the name (tell: single-word accent):** the old yellow
  "Touseef" goes. The name is one colour; its width and weight do the work.
- **Removed one accessory:** the floating `profile.lua` card. It repeated the hero.
  Its idea moves to `## stack`, written as a Lua table, where code carries real information.
- **Dropped from the earlier plan:** `:colorscheme` variants. Fun, but a second bold idea
  competing with the buffer. It can come back later as an easter egg if wanted.

## v2 (after Impeccable critique + Taste redesign audit)

Score before: 26/36 Nielsen (72%, "Good"; heuristic 10 n/a). Changes:
- **Gutter:** `set number` by default; the first j/k/:/za switches on `relativenumber`
  (`:set relativenumber` echoes). Vim users get the effect, recruiters get calm numbers.
- **Hero:** lead set at 19-20px (16px on phones) with the filter facts in bold fg: Inverted AI,
  UBC graduating May 2028, Summer 2027 internship. `resume.pdf` is the one inverted
  (visual-selection) link; email/github/linkedin are plain underlines. No brackets.
- **Sections renamed for recruiters:** projects, experience, stack, contact.
- **Fold rows carry proof:** metric in `--str` inside the closed row; portcullis open by default.
  Repeated "-- the fun part:" scaffold removed; each comment says its own thing.
- **Contrast:** `--comment #a89984` (AA on bg and bg1) for readable secondary text;
  `--nontext #928374` only for gutter, tildes, `##` markers. Field edges `--rule #7c6f64` (3:1).
- **Git graph:** the `|` rail is drawn (pseudo-element), so wrapped bullets keep it. Dates in git
  range form `2025-07..2025-10` (no en dash).
- **Contact:** plain language, no `#`-comment jargon, no `:wq` auto-submit while typing;
  Ctrl+Enter or the button; email + copy as the fallback. Page ends on the ask (resume).
- **One authored moment:** first visit only, the buffer draws top to bottom (~550ms, steps,
  no easing) then vim's `"touseef.md" NL` message; skipped on repeat visits and reduced motion.
- **Browser surfaces themed:** selection, scrollbar, caret, focus ring (cursor yellow).
- **Cursor block** hidden on rows holding a button or field.
- Rejected from the audits (brief wins): light mode, 1-accent rule (hues are syntax),
  65ch measure (72ch = textwidth), eased transitions, grain/texture.
- Deferred to the build: images inside folds (gruvboxify wallpaper, rootstock graph),
  meta/OG/favicon, real resume.pdf, Pages Function for contact.

## v3: editor with splits (visuals over text)

Feedback on v2: "very text heavy". The single-buffer concept made every section lines of text.
v3 keeps the identity and recomposes it as an nvim session with splits:
- **Hero:** name, three `key value` facts (now / school / seeking), links, and a live split
  `sim.lua`: a top-down traffic sim on a road grid (signals, car-following, a yellow ego car
  drawing its planned path and perception brackets around nearby agents). The Inverted AI nod.
  Canvas 2D, no libraries, paused off screen and in hidden tabs, one settled frame under reduced motion.
- **Projects:** a Telescope picker. Results list (name, lang, metric, year) plus a preview pane
  with a generated SVG architecture diagram per project (`src/components/Diagram.tsx`, specs in
  `src/data/projects.ts`). Type to filter; j/k, arrows, click; Enter opens the repo.
  Under 900px the preview opens inline under the selected result.
- **Dropped:** folds, the colorcolumn (it cut through the splits), the per-project prose.
- Search uses the CSS Custom Highlight API, so React-owned DOM is never mutated.
- First screen at 1440x900 holds about 20 words of body copy plus the sim and a diagram.
