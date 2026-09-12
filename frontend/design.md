# X-Pense Design System

## Design Read
- **artifact**: Web Application (Expense Tracker)
- **audience**: Power users, tech-adjacent individuals seeking a distinctive financial tool
- **visual-language**: Maximalist Swiss Brutalism / Editorial Brutalism
- **mode**: greenfield
- **visual-variance**: 8
- **motion-intensity**: 7
- **information-density**: 6
- **asset-dependence**: 2
- **brand-fidelity**: 9

## Core Philosophy
The bar is striking, memorable, and utilitarian. It rejects the standard "SaaS AI aesthetic" (no purple gradients, no soft shadows, no rounded soft cards). Everything is sharp, bordered, and highly contrasting. The design draws inspiration from receipt printers, Swiss poster design, and industrial interfaces.

## 1. Typography
We rely on a two-font pairing that contrasts massive, character-rich display text with a functional, geometric body font.

- **Display Font**: `Bricolage Grotesque` (Google Fonts)
  - Used for: Hero headings, massive graphic typography, primary numbers/balances.
  - Styling: Always uppercase, `font-black`, tight tracking (`tracking-tighter`), massive sizes.
- **Body Font**: `Archivo` (Google Fonts)
  - Used for: Labels, body text, inputs, secondary information.
  - Styling: Standard tracking, robust weights (`font-bold` for labels).

## 2. Color Palette
The palette is stark and restrictive, using high-contrast utilitarian colors. No gradients. No opacity fades (unless necessary for background noise).

- **Brutal Background**: `#f4f4f0` (Warm off-white, akin to thermal receipt paper)
- **Brutal Black**: `#0a0a0a` (Near-pitch black for borders, primary text, and deep shadows)
- **Primary Accent (Safety Orange)**: `#ff3300` (Used for critical actions, warnings, and highlighting)
- **Secondary Accent (Cobalt Blue)**: `#0037ff` (Used for alternate emphasis, branding graphics, and active states)

*(Note: These are defined in `index.css` via Tailwind `@theme` variables: `--color-brutal-bg`, `--color-brutal-black`, etc.)*

## 3. Structural Patterns & Borders
- **Borders**: Everything structural (inputs, buttons, layout divisions) must have a heavy `3px solid #0a0a0a` border. No border radii (sharp corners only).
- **Brutalist Shadows**: Elements that are interactive or elevated use a solid black offset shadow rather than a blurred drop shadow.
  - Default: `box-shadow: 8px 8px 0px 0px var(--color-brutal-black);`
  - Interactive (Hover): Translate up/left and increase shadow.
  - Interactive (Active): Translate down/right (press in) and decrease shadow.
- **Background Noise**: Subtle radial-gradient dot patterns (e.g., 2px dots spaced every 32px) are used to give empty areas a drafting-paper or blueprint feel.

## 4. Motion Strategy
Animations should feel mechanical, deliberate, and snappy, never floaty or soft.
- **Easing**: `[0.25, 1, 0.5, 1]` (custom cubic bezier for a fast-snap-and-settle feel).
- **Transitions**: Translation-based (sliding in on X or Y axis) combined with opacity.
- **Micro-interactions**: Hovering over buttons pushes icons on the X-axis (e.g., ArrowRight sliding).

## 5. UI Components Checklist
When building new pages (Dashboards, Transactions, Settings), adhere to these rules:
1. **Inputs**: White background, 3px black border, massive text. Focus state changes border color to an accent (Blue or Orange) with no soft outline rings.
2. **Buttons**: Solid color fills (Accent or Black), 3px black border, solid black offset shadow. Text is always uppercase and bold.
3. **Layout**: Favor asymmetry. Break the grid with massive typography on one side and structured data on the other. Allow typography to bleed or blend (`mix-blend-difference`).

## References
- Fonts imported in `index.html`.
- Custom utilities (`.brutal-shadow`, `.brutal-border`, scrollbars, selection) defined in `src/index.css`.
