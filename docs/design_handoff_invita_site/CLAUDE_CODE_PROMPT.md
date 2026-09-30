Implement the Invita "Lapis & Bone + Modern" redesign in this Next.js repo (ahmedayad1210/invita).

Read `design_handoff_invita_site/README.md` first. The `.dc.html` files next to it are the high-fidelity HTML design references. Recreate them with the repo's own components, i18n (`src/messages`) and data (`src/data`). Don't copy the HTML or `support.js`.

Order of work:
1. Replace the colour tokens with Lapis & Bone: bone `#F2EDE3`, lapis `#0D2551`, champagne `#C3A15A`, gold-text `#8A6E2E`, ink `#171A20`, plus the full scale in the README.
2. Rebuild Home as the 19 sections in the README order. Use the EN/AR copy verbatim from the `EN`/`AR` objects in `Invita Home.dc.html`.
3. Apply the Modern layer spec as the default styling: pill nav, inset rounded panels, display type, hero glow, grain, focus ring.
4. Carry the tokens through the IV Menu, Science, Partners and Drip pages.
5. Include all 4 doctor reels (`uploads/AQ*.mp4`). Optimize the videos and images.
6. Verify RTL, reduced motion, the ≤760px and ≤860px breakpoints, and every WhatsApp deep link.
