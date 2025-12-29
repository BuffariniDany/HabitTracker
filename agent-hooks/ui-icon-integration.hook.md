# Agent Hook — UI Icon Integration

**File:** agent-hooks/ui-icon-integration.hook.md

## Purpose
Guide Kiro to correctly integrate the AWS Women in Cloud Buenos Aires icon into the web UI without overpowering the product identity.

## Context
The AWS Women in Cloud Buenos Aires icon is a community affiliation badge, not the product logo. It must visually support the UI while keeping the product name as the primary focal point.

## Behavioral Rules

### Icon Role
- Treat the icon as a secondary brand marker
- Do not present it as the main logo
- Do not rely on embedded text inside the icon for readability

### Size & Scaling
- Desktop height: 32–40px
- Mobile height: 28–32px
- Preserve aspect ratio at all times
- Never crop or stretch the hexagon shape

### Layout & Alignment
- Position the icon to the left of the product title
- Vertically center-align with the title text
- Maintain horizontal spacing of 12–16px
- The icon must not shift or misalign the title

### Visual Weight
Reduce visual dominance by applying:
- Slight opacity reduction (90–95%), or
- Subtle desaturation
- Avoid glow stacking with card borders or gradients

### Background Interaction
- Icon background must remain transparent
- Avoid double framing (icon border + card border)
- Ensure contrast without overpowering the headline

### Responsive Behavior
On small screens:
- Reduce icon size further, or
- Hide the icon while preserving textual reference elsewhere
- Do not allow icon wrapping or vertical stacking in headers

### Accessibility
Always include:
- `aria-label="AWS Women in Cloud Buenos Aires"`
- Icon must not be the sole indicator of community affiliation

## Anti-Patterns (Disallowed)
- Using the icon at logo-scale size
- Centering the icon above the product title
- Applying stronger hover effects than the title
- Treating the badge as the product's primary brand

## Expected Outcome
- Clear visual hierarchy: Product first, community second
- Clean and professional SaaS/PWA layout
- Icon enhances trust without distracting
- Consistent across desktop and mobile

## Instruction to Kiro
When generating UI code or layout decisions:
- Enforce these rules automatically
- Prefer simplicity and restraint
- Ask only if a design decision violates these constraints