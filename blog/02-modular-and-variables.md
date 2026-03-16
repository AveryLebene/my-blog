# CSS Like a Pro, Part 2: Modular SCSS — Partials, Variables & the 7-1 Pattern

A modular approach means breaking styles into small, reusable pieces instead of one huge file. You use **partials**, a **single entry file**, and **variables** so the codebase stays predictable and easy to change. Here’s how that looks in practice, using the 7-1 pattern from this project.

## Use Partial Files

Each logical chunk of styling lives in its own file. Components get their own partials; so do layout, base, and themes.

From this repo:

```
styles/
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _extends.scss
├── base/
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _global.scss
├── components/
│   ├── _buttons.scss
│   ├── _cards.scss
│   ├── _badges.scss
│   ├── _grid.scss
│   └── _switch.scss
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _container.scss
│   └── _content.scss
├── themes/
│   ├── _light.scss
│   └── _dark.scss
└── main.scss
```

The leading `_` makes them SCSS partials (they’re not compiled to their own CSS file). Only `main.scss` is the public entry point.

## One Entry File That Imports Everything

`main.scss` controls order. That order matters: base and variables before components, so components can use them.

```scss
// main.scss
@import "abstracts/variables";
@import "abstracts/mixins";
@import "abstracts/extends";
@import "base/typography";
@import "base/reset";
@import "base/global";

@import "themes/dark";
@import "themes/light";

@import "components/buttons";
@import "components/badges";
@import "components/cards";
@import "components/grid";
@import "components/switch";

@import "layout/header";
@import "layout/footer";
@import "layout/container";
@import "layout/content";
```

One place to see the whole system. Add a new component? Add one line here and create the partial.

## Organize by Feature or Role

Group by **role** (component vs layout vs theme) or by **feature** (auth, dashboard). This project uses role-based 7-1: everything under `components/` is a UI component; everything under `layout/` is structure. That makes “where does this go?” a simple decision.

## Define Reusable Variables

Variables give you one source of truth for colors, spacing, typography, and breakpoints. When the design changes, you change one place.

**Example from `_variables.scss`:**

```scss
// Spacing & sizing
$border-radius: 8px;
$spacing: 16px;
$container-width: 1200px;

// Breakpoints
$xs: 400px;
$sm: 500px;
$md: 650px;
$lg: 992px;
$xl: 1200px;
$xxl: 1400px;
$xxxl: 1800px;

// Font stack
$font-stack: "Plus Jakarta Sans", serif;
$font-logo: "Moo Lah Lah";
```

Components then use `$spacing`, `$border-radius`, and breakpoints instead of magic numbers. Consistency and refactors become trivial.

## Use CSS Custom Properties for Theming

For theme-dependent values (e.g. light/dark), CSS custom properties work great. Variables in SCSS can point to them:

```scss
$text-color: var(--text-color);
$card-bg: var(--card-bg);
$primary-color: var(--primary-color);
```

Themes switch by setting the same custom properties under different selectors:

```scss
// _light.scss
[data-theme="light"] {
  --bg-color: #fbfbfb;
  --text-color: #000;
  --card-bg: #1e1e1e;
  --primary-color: #1e90ff;
  // ...
}

// _dark.scss
[data-theme="dark"] {
  --bg-color: #121212;
  --text-color: #f1f1f1;
  --card-bg: #1e1e1e;
  --primary-color: #1e90ff;
  // ...
}
```

One set of variable names, two (or more) themes. Toggle theme by changing `data-theme` on `<html>` or a wrapper.

---

**Takeaways:** Use partials for every major chunk of UI. One `main.scss` that imports in a clear order. Variables for design tokens; custom properties when you need runtime theming. In the next part we’ll tighten up the actual SCSS: nesting, mixins, and when to use `@extend`.

**Next:** [Part 3 — Writing Cleaner SCSS: Nesting, Mixins & @extend](03-nesting-mixins-extend.md)
