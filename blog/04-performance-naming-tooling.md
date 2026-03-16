# CSS Like a Pro, Part 4: Performance, Naming & Tooling

Structure and clean SCSS get you most of the way. The last stretch is **how** you write selectors and properties, **what** you call things, and **what** you do before and after ship. This part covers property usage, naming conventions, performance habits, and debugging—so your “CSS like a pro” stack stays fast and maintainable.

## CSS Property Usage and Performance

**Use shorthand.**  
`margin: 10px 20px;` instead of four separate `margin-*` declarations when they’re the same. Same idea for `padding`, `border`, `background`. Fewer declarations, smaller output, easier reading.

**Be aware of expensive properties.**  
`box-shadow`, `filter`, and heavy animations (especially on many elements) can cost more. That doesn’t mean avoid them—use them where they add value and test on lower-end devices if needed.

**Prefer classes (and the occasional ID) over raw elements.**  
`.card__title` is easier to reason about and override than deep `div > div > h3`. Element selectors are fine for resets or typography; for components and layout, classes scale better.

**Name things clearly.**  
`.card__body` and `.btn--secondary` tell you what they are. `.blue-box` or `.style2` don’t. Descriptive names make debugging and refactors faster.

**Comment when it’s not obvious.**  
Document *why* something is there (e.g. “needed for Safari line-clamp”) or how a utility is meant to be used. Don’t comment the obvious.

## Adopt a Naming Convention

A consistent naming scheme keeps the codebase predictable. Two widely used options:

**BEM (Block Element Modifier)**  
- **Block:** standalone component (e.g. `card`, `btn`).  
- **Element:** part of the block (`card__image`, `card__body`).  
- **Modifier:** variant (`card--vertical`, `btn--secondary`).

This project uses BEM-style naming in the cards and buttons:

- `.card`, `.card__image`, `.card__body`, `.card__title`, `.card__content`  
- `.card--vertical`, `.card--horizontal`, `.card--expanded`  
- `.btn`, `.btn--secondary`, `.btn--lg`, `.btn--rounded`  
- `.badge`, `.badge--danger`, `.badge--small`, `.badge--large`

So: one block, clear elements, modifiers for variants. No deep nesting of classes; the structure is in the names.

**SMACSS (Scalable and Modular Architecture for CSS)**  
Organizes by *role*: base, layout, module, state, theme. You can combine it with BEM for module names (e.g. layout for structure, BEM for components). The 7-1 folder structure aligns well with SMACSS thinking (base/, layout/, components/, themes/).

Pick one convention and stick to it across the project.

## Performance Optimization

**Remove unused CSS.**  
Tools like [PurgeCSS](https://purgecss.com/) strip styles that aren’t used in your HTML/templates. Especially useful with large frameworks or utility-heavy CSS. Integrate it in your build so production bundles stay small.

**Minify and compress.**  
Minification (whitespace and comments removed) and gzip/Brotli compression cut transfer size. Most build tools (Vite, Webpack, Parcel, etc.) have plugins for this. Enable them for production.

**Use frameworks and libraries wisely.**  
Frameworks can improve consistency and speed of development. They can also add a lot of CSS. If you use one, consider importing only what you need or using a build step that removes unused rules.

**Keep the previous points in mind.**  
Shorthand, fewer redundant properties, class-based selectors, and descriptive names all make stylesheets easier to optimize and reason about.

## Debugging and Testing

**Use DevTools.**  
Inspect computed styles, the box model, and which rules override others. Tweak values live to verify before changing source. Learn keyboard shortcuts and the layout/accessibility panels—they save a lot of time.

**Automated tests when it pays off.**  
Tools like Cypress or Playwright can assert that key elements have expected classes or dimensions. Use them for critical layouts or components where regressions would be costly.

**Cross-browser checks.**  
Test in the browsers you support. Services like BrowserStack or real devices help catch compatibility issues. For CSS, focus on layout (Flexbox/Grid), custom properties, and any newer features you use.

## Keeping Up (Without Chasing Every Trend)

- **Specs and docs:** [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS), [CSS-Tricks](https://css-tricks.com/), and the CSS Working Group give you a solid base.  
- **Frameworks and approaches:** Try Tailwind, utility-first patterns, or CSS-in-JS in side projects so you can choose what fits your team and product.  
- **Linting and formatting:** Stylelint (and your formatter) keep style rules consistent and catch common mistakes. Run them in CI.

---

## Wrapping Up the Series

- **Structure:** Pick a folder pattern (e.g. 7-1) and one entry file that imports partials in a clear order.  
- **Modularity:** Partials, variables, and (for theming) CSS custom properties.  
- **Clean SCSS:** Sensible nesting (≈3 levels), mixins for parameterized patterns, @extend for fixed shared patterns.  
- **Quality:** Shorthand, class-based selectors, descriptive names, a naming convention (e.g. BEM), and comments where needed.  
- **Performance:** Purge/minify/compress, and avoid unnecessary duplication and overly expensive properties.  
- **Ongoing:** DevTools, optional automated tests, cross-browser checks, and a bit of reading so you can adopt new features when they’re useful.

You don’t need every possible tool or convention—just a consistent set that keeps your styles reusable, scalable, and maintainable. That’s CSS (and SCSS) like a pro.

---

**Series index:**  
[Part 1 — Why It Matters & Structure](01-why-and-structure.md) · [Part 2 — Modular SCSS & Variables](02-modular-and-variables.md) · [Part 3 — Nesting, Mixins & @extend](03-nesting-mixins-extend.md) · **Part 4 — Performance, Naming & Tooling**
