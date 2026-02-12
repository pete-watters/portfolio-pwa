---
title: "SVGs in React Apps"
description: "Exploring different approaches to using SVGs in React applications — inline embedding vs image tags, and the trade-offs of each."
pubDate: 2019-12-16
tags: ["svg", "react", "javascript"]
---

I have been a fan of using SVGs as my go-to image format in web applications for a long time. They have some key advantages:

- They are **code** and can be managed as such very easily using source control and are easily editable
- **Flexibility** in scale and colouring
- **Compact** file sizes
- **SEO friendly** as XML files

There are a couple of common approaches to using SVGs in React apps, each with their own trade-offs.

## Inline SVGs

Embedding SVG code directly in your markup gives you full CSS control:

```html
<div>
  <svg height="210" width="400">
    <path d="M150 0 L75 200 L225 200 Z" />
  </svg>
</div>
```

You can then style them with CSS, including changing colours:

```css
svg {
  fill: green;
}
```

This approach enables full CSS manipulation, which is great for icons and small graphics. However, it becomes impractical for larger projects — inlining complex, reused SVGs across many components inflates your bundle size unnecessarily.

## Image Tags

The alternative is treating SVGs like any other image:

```html
<img src="my.svg" />
```

This technique enables on-demand lazy loading while keeping SVGs out of your application bundle. The trade-off is that CSS-based colour modification is no longer available, though scaling still works perfectly.

## Which to choose?

For small, frequently reused icons that need colour changes — go inline. For larger, decorative graphics — use image tags and keep your bundle lean.
