# 🎨 VISUAL GUIDE - Restaurant Avis Email Flow

---

## 🗺️ FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────┐
│                     PAGE CHOIX AUTH                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │   La Belle Assiette                              │  │
│  │   "Donnez votre avis"                            │  │
│  │                                                  │  │
│  │   [Continuer avec Google] (Bleu)                 │  │
│  │                     ou                           │  │
│  │   [Tester avec un email] (Outline)               │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                           ↓ (Click email)
┌─────────────────────────────────────────────────────────┐
│                  FORMULAIRE EMAIL                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Tester rapidement                              │  │
│  │   "Donnez votre avis pour La Belle Assiette"     │  │
│  │                                                  │  │
│  │   Email* [test-qa-123@demo.fr]                   │  │
│  │   Nom    [Test QA User]                          │  │
│  │   Note*  [☆ ★★★★★] (Excellent!)                 │  │
│  │   Commentaire [Excellent test coverage!]         │  │
│  │                                                  │  │
│  │   [Envoyer mon avis] (Gradient amber)            │  │
│  │                                                  │  │
│  │   Retour au choix d'authentification             │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                           ↓ (POST /api/avis/reviews)
┌─────────────────────────────────────────────────────────┐
│                    API RESPONSE                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  {                                               │  │
│  │    "participantId": "aaaa...",                   │  │
│  │    "reviewId": "bbbb..."                         │  │
│  │  }                                               │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                           ↓ (Redirect)
┌─────────────────────────────────────────────────────────┐
│                      PAGE ROUE                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │   Tentez votre chance!                           │  │
│  │   "Tournez la roue pour découvrir votre cadeau"  │  │
│  │                                                  │  │
│  │            ╭─────────────╮                       │  │
│  │          ╱         ↓      ╲                      │  │
│  │        ╱  ☕ Café    🍰 Dessert   ╲              │  │
│  │      ╱       💰 -10%  🍹 Cocktail   ╲            │  │
│  │    ╱  🥗 Entrée   🥤 Boisson        ╲          │  │
│  │    ╭─────────────────────────────────╮            │  │
│  │    │  ○ (rotates...)                 │            │  │
│  │    ╰─────────────────────────────────╯            │  │
│  │                                                  │  │
│  │   [Tournez la roue!] (Animation 4s)             │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                  ↓ (After 4s animation)
┌─────────────────────────────────────────────────────────┐
│                 PAGE CADEAU GAGNÉ                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │            ✨ ✨ ✨ CONFETTI ✨ ✨ ✨              │  │
│  │                  ☕ (Bounce)                      │  │
│  │           Félicitations !                        │  │
│  │          Vous avez gagné                         │  │
│  │                                                  │  │
│  │      ┌──────────────────────────┐                │  │
│  │      │    Café Offert           │                │  │
│  │      │  Un café offert à        │                │  │
│  │      │  présenter au serveur    │                │  │
│  │      └──────────────────────────┘                │  │
│  │                                                  │  │
│  │     🔔 Présentez cet écran au serveur           │  │
│  │        pour récupérer votre cadeau               │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 📐 LAYOUT RESPONSIVE

### MOBILE (375px - iPhone SE)

```
┌─────────────────────────────────────────┐
│ La Belle Assiette                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Donnez votre avis               │   │
│  │ Choisissez votre mode...        │   │
│  │                                 │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │ Continuer avec Google     │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  │             ou                  │   │
│  │                                 │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │ Tester avec un email      │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│ px-4 padding (16px)                     │
└─────────────────────────────────────────┘

FORMULAIRE:
┌─────────────────────────────────────────┐
│ La Belle Assiette                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Tester rapidement               │   │
│  │ Donnez votre avis pour...       │   │
│  │                                 │   │
│  │ Email*                          │   │
│  │ [........................]      │   │
│  │                                 │   │
│  │ Nom (optionnel)                 │   │
│  │ [........................]      │   │
│  │                                 │   │
│  │ Votre note                      │   │
│  │ ☆ ☆ ☆ ☆ ☆ (Excellent!)         │   │
│  │                                 │   │
│  │ Commentaire (optionnel)         │   │
│  │ ┌─────────────────────────────┐ │   │
│  │ │                             │ │   │
│  │ └─────────────────────────────┘ │   │
│  │                                 │   │
│  │ [Envoyer mon avis]             │   │
│  │ (Gradient amber)                │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│ Retour au choix d'authentification      │
└─────────────────────────────────────────┘

ROUE:
┌─────────────────────────────────────────┐
│                                         │
│ Tentez votre chance!                    │
│                                         │
│        ╭──────────╮                    │
│      ╱       ↓       ╲                  │
│    ╱    ☕ 🍰 💰  ╲                   │
│   ╱     🍹 🥗 🥤    ╲                  │
│   ╭─────────────────────╮              │
│   │      ● (center)     │              │
│   ╰─────────────────────╯              │
│                                         │
│ [Tournez la roue!]                     │
│ (full width, max-w-[280px])            │
│                                         │
└─────────────────────────────────────────┘

CADEAU:
┌─────────────────────────────────────────┐
│      ✨ CONFETTI ✨                     │
│                                         │
│              ☕                          │
│                                         │
│        Félicitations!                   │
│      Vous avez gagné                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Café Offert                   │   │
│  │   Un café offert à présenter     │   │
│  │   au serveur                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔔 Présentez cet écran au       │   │
│  │    serveur pour récupérer votre  │   │
│  │    cadeau                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│ p-5 padding (20px)                      │
└─────────────────────────────────────────┘
```

### DESKTOP (1920px)

```
                     ┌─────────────────────────────────────┐
                     │   La Belle Assiette                 │
                     │                                     │
                     │  ┌─────────────────────────────┐    │
                     │  │ Donnez votre avis           │    │
                     │  │ Choisissez votre mode...    │    │
                     │  │                             │    │
                     │  │  ┌───────────────────────┐  │    │
                     │  │  │ Continuer avec Google │  │    │
                     │  │  └───────────────────────┘  │    │
                     │  │                             │    │
                     │  │            ou               │    │
                     │  │                             │    │
                     │  │  ┌───────────────────────┐  │    │
                     │  │  │ Tester avec un email  │  │    │
                     │  │  └───────────────────────┘  │    │
                     │  │                             │    │
                     │  └─────────────────────────────┘    │
                     │                                     │
                     │ max-w-md (448px) - centré           │
                     └─────────────────────────────────────┘

ROUE:
                          ┌─────────────────────┐
                          │ Tentez votre chance!│
                          │                     │
                          │   ╭──────────╮      │
                          │ ╱      ↓       ╲    │
                          │╱    ☕ 🍰 💰    ╲  │
                          │   🍹 🥗 🥤       ╲  │
                          │ ╭──────────────────╮│
                          │ │    ● (center)    ││
                          │ ╰──────────────────╯│
                          │                     │
                          │[Tournez la roue!]  │
                          │ max-w-sm (384px)    │
                          └─────────────────────┘

CADEAU:
                    ┌──────────────────────────────┐
                    │   ✨ ✨ CONFETTI ✨ ✨      │
                    │                              │
                    │            ☕                 │
                    │                              │
                    │   Félicitations !            │
                    │   Vous avez gagné            │
                    │                              │
                    │ ┌────────────────────────┐   │
                    │ │  Café Offert           │   │
                    │ │  Un café offert à      │   │
                    │ │  présenter au serveur  │   │
                    │ └────────────────────────┘   │
                    │                              │
                    │ ┌────────────────────────┐   │
                    │ │🔔 Présentez cet écran │   │
                    │ │   au serveur           │   │
                    │ │   pour récupérer votre │   │
                    │ │   cadeau               │   │
                    │ └────────────────────────┘   │
                    │                              │
                    │ max-w-md (448px) - centré    │
                    │ p-8 padding (32px)           │
                    └──────────────────────────────┘
```

---

## 🎨 COLOR SCHEME

### Palette principale
```
Button Google:      #2563EB (Blue-600)
                    #1D4ED8 (Blue-700) - Hover

Button Email:       White background
                    #D1D5DB Border (Gray-300)
                    #111827 Text (Gray-900)

Roue background:    Gradient conic (6 couleurs)
                    Voir seed.sql

Button Spin:        #F59E0B → #EA8C55 (Amber → Orange)
                    #D97706 → #DC2626 (Hover)

Cadeau background:  #FAFAF8 (Amber-50 gradient)
                    #F5F5F0 (to)

Instructions:       #111827 (Gray-900) background
                    #FFFFFF Text (White)

Texte standard:     #374151 (Gray-700)
Texte light:        #6B7280 (Gray-500)
Erreur:             #EF4444 (Red-500)
Success:            N/A (redirection)
```

### Confetti colors
```
🟡 #fbbf24 (Amber-300)
🟠 #f59e0b (Amber-500)
🔴 #ef4444 (Red-500)
🟣 #8b5cf6 (Violet-500)
🔵 #3b82f6 (Blue-500)
🟢 #10b981 (Emerald-500)
```

---

## ⏱️ ANIMATION TIMELINE

### Wheel Spin Animation
```
Time    Rotation    State           Speed
─────────────────────────────────────────────
0ms     0°          Button pressed   0°/ms
500ms   45°         Accelerating     0.09°/ms
1000ms  180°        Peak speed       0.18°/ms
2000ms  360°        Decelerating     0.18°/ms
3000ms  495°        Slowing down     0.135°/ms
4000ms  630°        Stop             0°/ms
4200ms  630°        Reveal prize     -

Easing: cubic-bezier(0.17, 0.67, 0.12, 0.99)
```

### Confetti Animation
```
Time    Burst          Particles   Spread
──────────────────────────────────────────
0ms     Center         100         70°
100ms   (Continuing...)
300ms   Left + Right   60 each     55°
1000ms  Peak
2000ms  Fading out
3000ms  Done

Library: canvas-confetti
```

### Bounce Icon Animation
```
Time    Transform           Repeat
──────────────────────────────────
0ms     translateY(0px)     Infinite
1000ms  translateY(-8px)    (2s cycle)
2000ms  translateY(0px)

Easing: ease-in-out
Cycle: 2000ms (2s)
```

---

## 📱 BREAKPOINTS APPLIQUÉS

### Tailwind Breakpoints utilisés
```
Default     < 640px (Mobile)
sm:         ≥ 640px (Tablet+)

Cumulatif:
- Mobile: default styles
- Tablet+: default + sm: overrides
```

### Exemples d'application
```
text-[10px] sm:text-xs
├─ Mobile (375px):  10px
└─ Desktop (1920px): 12px

w-10 h-10 sm:w-12 sm:h-12
├─ Mobile:  40px × 40px
└─ Desktop: 48px × 48px

p-6 sm:p-8
├─ Mobile:  24px padding
└─ Desktop: 32px padding
```

---

## 🔘 BUTTON STATES

### "Envoyer mon avis" Button
```
State          Appearance              Cursor
──────────────────────────────────────────────
Default        Solid bg (bg-white)     pointer
Hover          shadow-lg               pointer
Active         scale-95                pointer
Disabled       shadow-none             not-allowed
Loading        Spinner visible         not-allowed
              Text: "Envoi en cours..."
```

### "Tournez la roue !" Button
```
State          Appearance              Cursor
──────────────────────────────────────────────
Default        Gradient orange         pointer
Hover          Darker gradient         pointer
              scale(1.02)
              shadow-xl
Active         scale(0.98)             pointer
Disabled       scale-100               not-allowed
              shadow-none
Spinning       Spinner visible         not-allowed
              Text: "La roue tourne..."
```

---

## ✨ SHADOW & ELEVATION

```
Component          Shadow Class   Elevation
──────────────────────────────────────────────
Form card          shadow-lg      Large
Wheel container    shadow-2xl     Extra Large
Prize icon bg      shadow-xl      Extra Large
Buttons (default)  shadow-md      Medium
Buttons (hover)    shadow-lg      Large
Instructions box   shadow-lg      Large
```

---

## 📏 SPACING REFERENCE

### Padding scale
```
p-2  = 8px
p-3  = 12px
p-4  = 16px
p-5  = 20px
p-6  = 24px   ← Mobile default
p-8  = 32px   ← Desktop default
```

### Gap scale
```
gap-2  = 8px
gap-4  = 16px
gap-6  = 24px  ← Standard vertical
gap-8  = 32px  ← Large vertical
```

### Margin scale
```
mt-6  = 24px   ← "Retour" button top margin
```

---

## 🎯 CLICK TARGETS

### Minimum size (accessible)
```
Target       Width × Height   Actual
───────────────────────────────────
Button       Full × 48px      ✅ 56px
Star rating  44px × 44px      ✅ varies
Input field  Full × 48px      ✅ Auto
Link text    Auto × 24px      ⚠️ Small
```

---

**Generated by:** QA-Guard (Claude Code)
**Date:** 2026-03-07

