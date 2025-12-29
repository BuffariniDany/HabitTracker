# Agent Hook — Asset Upload & Validation

**File:** agent-hooks/asset-upload-validation.hook.md

## Purpose
Ensure that all static assets (especially brand and community icons) are properly uploaded, validated, and correctly integrated into the UI.

This hook prevents broken assets, empty files, and incorrect icon usage.

## Scope
Applies to:
- PNG / SVG assets
- Icons used in headers, navigation, or branding areas
- Files located under `/public`

## Validation Rules

### 1. Binary Integrity
When adding or modifying an image asset, Kiro must verify:
- File exists at the expected path
- File size is greater than 0 bytes
- File renders correctly in GitHub preview
- File is a valid image format (PNG/SVG)

❌ **Do not accept placeholder files**  
❌ **Do not accept empty or corrupted assets**

### 2. File Location
Assets must be placed according to conventions:
- `/public/aws-wic-icon.png`

**Rules:**
- No renaming without explicit instruction
- No nesting under unnecessary subfolders
- No duplication of the same asset

### 3. Commit Validation
Before completing the task, Kiro must ensure:
- The asset is staged as a binary file
- The commit message reflects an asset fix or upload
- The pushed file renders correctly on GitHub

**Example commit message:**
```
fix: upload AWS Women in Cloud Buenos Aires icon asset
```

### 4. UI Reference Validation
Kiro must confirm that:
- The UI references the asset using a public-relative path
- The image loads in:
  - Local dev environment
  - Deployed environment
- No console or network errors occur

**Example valid usage:**
```jsx
<img 
  src="/HabitTracker/aws-wic-icon.png" 
  alt="AWS Women in Cloud Buenos Aires" 
  aria-label="AWS Women in Cloud Buenos Aires" 
  className="header-icon" 
/>
```

### 5. Design & Role Enforcement
When validating the asset integration, Kiro must also enforce:
- The icon follows UI Icon Integration rules
- It is treated as a secondary brand marker
- It does not overpower the product title
- It respects sizing and alignment constraints

**Reference:** `agent-hooks/ui-icon-integration.hook.md`

## Completion Criteria
Kiro may only mark the task as complete when:
- ✅ Asset exists and is non-empty
- ✅ Asset renders in GitHub
- ✅ Asset loads in the running app
- ✅ UI layout remains correct
- ✅ No broken links or console errors