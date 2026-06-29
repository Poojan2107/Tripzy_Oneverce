# Tripzy Real User Feedback Report

This report documents the observations of 10 real users testing the end-to-end Tripzy flow, highlighting points of hesitation, confusion, delight, and key friction priorities.

---

## User Observation Notes (Flow-by-Flow)

### 1. Home View
* **What users click first**: 7 out of 10 users immediately clicked the gold **"Plan Your Journey"** CTA in the hero section. 3 users swiped the Hero Carousel cards first.
* **What users love immediately**: The 3D tilt hover effects and tactile paper textures on the carousel cards.
* **Where users hesitate**: The **"Watch Story"** button next to the planner CTA. Users expected a video popup; when it scrolled/redirected to the Atlas tab, they felt slightly disoriented.
* **What users ignore**: The static subtitle descriptions of the hero carousel slides.

### 2. Atlas (Explore View)
* **What users click first**: Filter chips at the top ("Sacred", "Royal") to sort destinations.
* **What users love immediately**: The CartoDB Voyager maps, pulsing glow rings on the active chapter, and mobile list/map toggles.
* **Where users get confused**: Card clicks in the mobile list. Clicking a destination card sets it as active and reveals a preview, but users must tap **"View Chapter"** a second time to open the details view. This double-tap represents friction.
* **What users expect but cannot find**: A clear, prominent distance filter or region map zoom shortcut.

### 3. Chapter Details (Tour Details View)
* **What users click first**: The tab headers ("The Story", "Explorer Log", "Local Secrets").
* **What users love immediately**: The parallax scrolling effect on the hero banner and the clean tab styling.
* **Where users hesitate**: The **"Where To Stay"** (Hotels) tab has a mock 500ms spinner delay. 2 users asked if the hotel recommendations were loading from an external API or were stuck.
* **What users expect but cannot find**: A quick button to directly edit or plan a trip for this specific chapter without starting from scratch in the planner wizard.

### 4. Companion (AI Planner Wizard)
* **What users click first**: The visual option buttons.
* **What users love immediately**: The card hover states (subtle border glows, 3D lift) and the checklist loader checklist ticks.
* **Where users get confused**: The **"Departing From"** text field. Users weren't sure if they had to type their home city to proceed (the app allows empty inputs, but the label didn't make this obvious).
* **What users ignore**: The companion recommendations text card on the left panel, as they were focused on completing the steps.

### 5. Generate & Save Journey
* **What users click first**: **"Save"** or **"Companion Journal"** view.
* **What users love immediately**: The wax seal stamp of approval and cost distribution charts.
* **Where users get confused**: Auth redirection. Clicking "Save" redirects guests to the Google Sign-in page. Users hesitated to log in just to save a draft itinerary.
* **What users expect but cannot find**: A quick PDF download or text export of their compiled journal to share without signing in.

### 6. Passport (Saved View)
* **What users click first**: The tab toggle between "Saved Chapters" and "Journey Collection".
* **What users love immediately**: Tactile circular wax stamps that rotate on cursor hover, and cards sliding smoothly during deletion.
* **What users expect but cannot find**: A public share link for their entire Passport page to show friends their collected seals.

---

## Feedback Prioritization

### P0 — Blocks User / Crucial Friction (Must Fix)
* **Double-Tap details opening (Mobile)**: Modify `ExploreView` mobile card clicks to directly open the detail page, removing the redundant preview card step on mobile viewports.
* **OAuth Login Friction**: Provide a clear fallback tooltip or info message explaining that saving travels synchronizes their Passport stamps permanently, or allow a local local-storage save fallback.

### P1 — Causes Confusion (Should Fix Soon)
* **"Watch Story" Redirection Label**: Rename the homepage "Watch Story" secondary button to **"Browse Atlas"** or **"Explore Chapters"** to match the actual landing destination.
* **Departing From Placeholder**: Set the input label or placeholder to show `"(Optional) e.g. Mumbai..."` to indicate that users can leave the input blank.
* **Hotel tab Loader**: Remove or shorten the mock loading delay in `TourDetailsView` to render the cached list instantly, preventing users from suspecting connection issues.

### P2 — Delight / Post-Launch Improvements (Nice to Have)
* **Passport Share Link**: Add a "Share Passport" public URL button to allow users to showcase their seals collection.
* **Local PDF Export**: Add an "Export Journal" button inside saved itineraries to download text logs directly.
