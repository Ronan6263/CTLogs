# Landing Page + Schedule System Plan

## Overview
Add a landing/home screen with animated cards for navigation, and a full weekly schedule system with drag-and-drop crew assignment.

---

## Phase 1: Landing Page (Home Screen)

### What changes
- After login, instead of going straight to the locations grid, show a **home screen** with 3 animated cards:
  1. **Schedule** — for everyone
  2. **Dispatch** — admin only (hidden for crew/guest)
  3. **Locations** — for everyone

- Each card has an icon, title, and subtle entrance animation (staggered fade-up)
- Clicking a card navigates to that section (show/hide pattern matching existing app)

### Navigation changes
- Add a new `#homeScreen` div between auth and the current app content
- Current `#mainContent` (locations grid) becomes one "page"
- New `#scheduleScreen` becomes another "page"
- Sidebar and topbar remain visible on all pages
- Sidebar gets a **Home** button to return to landing
- Logo click also returns to home

### State management
- New variable: `currentPage = 'home' | 'locations' | 'schedule' | 'dispatch'`
- `navigateTo(page)` function handles show/hide transitions

---

## Phase 2: Database Schema for Schedule

### New Supabase tables

**`job_types`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| name | text | e.g. "TOWER CLEAN", "SAND FILTER" |
| color | text | Hex color, e.g. "#0070C0" |
| sort_order | int | Display ordering |

**`schedule_weeks`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| week_start | date | Sunday of the week |
| created_by | uuid (FK profiles) | |
| created_at | timestamptz | |

**`schedule_jobs`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| week_id | uuid (FK schedule_weeks) | |
| day | int | 0=Sun, 1=Mon, ..., 6=Sat |
| job_type_id | uuid (FK job_types) | |
| title | text | Custom job title (e.g. "STAMFORD HOSPITAL") |
| notes | text | Popup notes for the job |
| sort_order | int | Vertical position within the day column |

**`schedule_assignments`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | |
| job_id | uuid (FK schedule_jobs) | |
| crew_name | text | Name (e.g. "JESSE", "JAHDAI") |
| sort_order | int | Order within job |

> Using `crew_name` as text rather than FK to profiles, because:
> - Many crew members may not have app accounts
> - The schedule references ~30+ names, many are field workers without logins
> - Matches the current spreadsheet workflow

---

## Phase 3: Schedule UI

### Layout (matches their current spreadsheet)
- **Header row**: Day names with dates (SUNDAY - MAR 22ND, MONDAY - MAR 23rd, etc.)
- **Grid below**: Each column = 1 day, cells are job blocks stacked vertically
- **Each job block**: Colored header bar (job type color) + job title + crew names listed below
- **Week navigation**: Arrow buttons to go prev/next week, "This Week" button to jump to current

### Read-only mode (crew & guest)
- Clean grid display identical to their spreadsheet but styled to match the app
- Click/tap a job title → popup shows notes if any
- Scrollable on mobile (horizontal scroll for the 7-day grid)

### Admin mode (additions)
- **Bottom crew panel**: A hover-triggered drawer at the bottom of the screen (like the sidebar but bottom)
  - Lists all available crew names as draggable chips
  - When a name is dragged onto a job, it gets added to that job's assignment list
  - The name disappears from the available pool (for that week)
  - Dragging a name off a job (or clicking X) returns it to the pool
- **Add job**: Button at bottom of each day column to add a new job block
- **Delete job**: X button on job blocks (admin only)
- **Edit job title**: Click to edit inline
- **Job notes**: Click note icon on job → popup to edit
- **Reorder**: Drag jobs within a column to reorder
- **Auto-save**: Changes save to Supabase as they happen (debounced)

### Job type colors (from user's spreadsheet)
| Type | Color |
|------|-------|
| SAND FILTER | #D2691E (brown/orange) |
| CW TANKS | #00B050 (green) |
| TOWER CLEAN | #0070C0 (blue) |
| ICE MACHINES | #FFFF00 (yellow) |
| DISINFECTION | #00B0F0 (light blue) |
| OTHER | #FF6600 (orange) |
| WATER WALLS | #FF00FF (magenta/pink) |
| DWD | #00B050 (green) |
| AHUS | #FFC0CB (pink) |

### Personnel section
- The spreadsheet has PERSONNEL columns (rightmost) showing crew grouped by location (MIDDLEFIELD, WEST HAVEN)
- This maps to the bottom crew panel — all available crew for the week

---

## Phase 4: Implementation Order

1. **Landing page HTML/CSS/JS** — home screen with 3 cards, navigation function
2. **Supabase table creation** — SQL for the 4 new tables + RLS policies
3. **Schedule screen skeleton** — week grid layout, header, day columns
4. **Job type management** — seed the default types, admin can add/edit
5. **Schedule CRUD** — create/read weeks, add/remove jobs
6. **Crew assignment** — drag-and-drop with HTML5 Drag API
7. **Bottom crew panel** — hover drawer with available names
8. **Job notes popup** — click job title to view/edit notes
9. **Week navigation** — prev/next arrows, current week button
10. **Mobile responsiveness** — horizontal scroll, touch-friendly drag

---

## Pending Questions

1. **The new logo file** — user said it's in D:\Dev\CTLogs but I only found `logo.png` (the old one). Need the user to confirm the AMC logo filename/location so I can replace it and upload to the Images bucket.

2. **Crew names** — should I seed a default list from the spreadsheet screenshot, or start empty and let admins add them?

3. **Mobile visit flickering bug** — still needs to be addressed (separate from this plan). The rapid scrolling on mobile when accessing visit entries.
