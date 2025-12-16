# Design Tokens - Menkiki

## Spacing Scale (base: 4px)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Icon gaps, micro adjustments |
| `sm` | 8px | Inline spacing, small gaps |
| `md` | 12px | Component internal padding |
| `base` | 16px | Standard spacing, card padding |
| `lg` | 20px | Section margins |
| `xl` | 24px | Large gaps, safe area additions |
| `2xl` | 32px | Major section separators |
| `3xl` | 48px | Screen-level spacing |

## Safe Areas

| Token | iOS Value | Usage |
|-------|-----------|-------|
| `safeTop` | `insets.top` | Dynamic Island/notch clearance |
| `safeTopPadded` | `insets.top + 16` | Content below status bar |
| `safeBottom` | `insets.bottom` | Home indicator clearance |
| `safeBottomPadded` | `insets.bottom + 8` | Content above home indicator |
| `tabBarHeight` | 70px | Floating tab bar |
| `tabBarMargin` | 20px | Horizontal margins |
| `tabBarBottom` | 24px | Bottom margin (add safeBottom) |

## Colors - Overlay System

| Token | Value | Usage |
|-------|-------|-------|
| `overlay.light` | `rgba(0,0,0,0.3)` | Subtle darkening |
| `overlay.medium` | `rgba(0,0,0,0.5)` | Text background |
| `overlay.heavy` | `rgba(0,0,0,0.7)` | Modal backgrounds |
| `overlay.gradient` | `transparent → rgba(0,0,0,0.8)` | Camera bottom fade |

## Colors - Text on Camera

| Token | Value | Usage |
|-------|-------|-------|
| `camera.title` | `#FFFFFF` | Main titles |
| `camera.subtitle` | `rgba(255,255,255,0.9)` | Secondary text |
| `camera.hint` | `rgba(255,255,255,0.7)` | Tertiary hints |
| `camera.shadow` | `rgba(0,0,0,0.8)` | Text shadow color |

## Text Shadows (Camera Overlay)

```
textShadow: {
  color: 'rgba(0,0,0,0.8)',
  offset: { width: 0, height: 1 },
  radius: 4
}
```

## Typography - Camera HUD

| Style | Size | Weight | Shadow |
|-------|------|--------|--------|
| `hud.title` | 28px | 700 | Yes |
| `hud.subtitle` | 14px | 400 | Yes |
| `hud.hint` | 15px | 500 | Yes |

## Touch Targets

| Token | Value | Usage |
|-------|-------|-------|
| `minTouchTarget` | 44px | Minimum tappable area |
| `iconButton` | 48px | Standard icon button |
| `shutterButton` | 76px | Camera capture button |
| `tabIcon` | 44px | Tab bar icons |

## Iconography

| Token | Value | Usage |
|-------|-------|-------|
| `icon.sm` | 16px | Inline icons |
| `icon.md` | 20px | Standard icons |
| `icon.lg` | 24px | Prominent icons |
| `icon.xl` | 32px | Feature icons |
| `icon.strokeWidth` | 2 | Default stroke |
| `icon.opacity.active` | 1.0 | Active state |
| `icon.opacity.inactive` | 0.6 | Inactive state |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius.sm` | 8px | Small elements |
| `radius.md` | 12px | Cards, buttons |
| `radius.lg` | 16px | Large cards |
| `radius.xl` | 20px | Focus frame corners |
| `radius.full` | 9999px | Pills, circles |

## Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| `z.camera` | 0 | Camera feed |
| `z.overlay` | 10 | Gradient overlays |
| `z.hud` | 20 | HUD elements |
| `z.controls` | 30 | Buttons, tabs |
| `z.modal` | 100 | Modals, sheets |
