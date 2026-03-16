# CSS Like a Pro, Part 3: Writing Cleaner SCSS — Nesting, Mixins & @extend

Once your files and variables are in place, the next step is writing SCSS that stays readable and DRY. That comes down to **nesting** (used sparingly), **mixins** (reusable logic and parameters), and **@extend** (shared patterns without duplication). Here’s how to use each, with examples from this project.

## Nesting — But Not Too Much

Nesting mirrors your HTML and keeps related rules together. Overdo it and you get long selectors and high specificity. A simple rule: **keep nesting to about 3 levels max**.

**Good use (from `_cards.scss`):**

```scss
.card {
  background-color: $card-bg;
  border-radius: 8px;
  // ...

  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  &__body {
    padding: $spacing;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
  }

  &--vertical {
    display: flex;
    flex-direction: column;
    .card__image { height: 200px; }
    .card__body { flex-grow: 1; }
  }

  &--horizontal {
    display: flex;
    flex-direction: row;
    .card__image { height: 100%; width: 50%; }
    .card__body { flex-grow: 1; width: 50%; }
  }
}
```

`&` keeps BEM-style names (`.card__body`, `.card--vertical`) without repeating `.card`. One level of modifiers and elements—easy to read and refactor. If you find yourself going deeper, pull some of it into a new block or partial.

## Mixins — Reusable Logic With Parameters

Mixins are like functions: they take parameters and output a block of CSS. Use them for repeated patterns that need to **vary** (e.g. colors, sizes, breakpoints).

**Example from `_mixins.scss`:**

```scss
@mixin button-style($bg-color, $text-color) {
  background-color: $bg-color;
  color: $text-color;
  padding: 10px 20px;
  border-radius: $border-radius;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    opacity: 0.8;
  }
}

@mixin flex-layout($justify: center, $align: center, $direction: row) {
  display: flex;
  justify-content: $justify;
  align-items: $align;
  flex-direction: $direction;
}
```

**Usage in `_buttons.scss`:**

```scss
.btn {
  font-weight: bold;
  @include button-style($primary-color, white);

  &--secondary {
    @include button-style($secondary-color, white);
  }
}
```

Same pattern, different colors—no duplicated property blocks. Mixins are ideal when you need **parameters** or **logic** (loops, conditionals). The project also uses a responsive grid mixin that generates breakpoint-based classes with a configurable gap and column count—exactly the kind of thing mixins are for.

## @extend — Shared Patterns Without Parameters

`@extend` lets one selector inherit the styles of another (or a placeholder). The compiler groups selectors in the output, so you avoid repeating the same declaration block. Use it for **fixed** shared patterns; don’t overuse it or your output can get messy.

**Placeholder in `_extends.scss`:**

```scss
%nav-shared {
  padding: 15px 44px;
  background-color: $nav-bg;
  color: $text-color;
  @include flex-layout(space-between);
  width: 100%;
  @media screen and (max-width: 556px) {
    padding: 20px 14px;
  }
}
```

**Usage in `_header.scss`:**

```scss
header {
  @extend %nav-shared;
  .__logo {
    font-family: $font-logo;
  }
}
```

So: one definition of “nav bar look,” shared by `header` (and any other element that extends `%nav-shared`). No parameters—just “this block looks like that block.”

## When to Use @extend vs Mixin

| | @extend | @mixin |
|--|--------|--------|
| Avoids code duplication | ✅ | ✅ |
| Can pass parameters | ❌ | ✅ |
| Groups selectors in output | ✅ | ❌ (duplicates block) |
| Best for fixed shared patterns | ✅ | — |
| Best for parameterized logic | — | ✅ |

Rule of thumb: **shared look with no variation** → placeholder + `@extend`. **Same pattern with different values or logic** → mixin.

## Line-Clamp Example — Mixin + Loop

Combining a mixin with a loop keeps utility classes DRY:

```scss
@mixin line-clamp($max) {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $max;
  line-clamp: $max;
  overflow: hidden;
}

@for $i from 1 through 10 {
  .line-clamp-#{$i} {
    @include line-clamp($i);
  }
}
```

You get `.line-clamp-1` through `.line-clamp-10` without writing ten nearly identical blocks. That’s the kind of clarity and maintainability you’re aiming for.

---

**Takeaways:** Nest lightly (≈3 levels), use the `&` for BEM. Prefer mixins when you need parameters or logic; use @extend for fixed shared patterns. In the next part we’ll cover performance, naming conventions, and tooling.

**Next:** [Part 4 — Performance, Naming & Tooling](04-performance-naming-tooling.md)
