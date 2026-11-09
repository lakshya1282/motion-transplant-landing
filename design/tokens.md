# Design System Tokens

## Colors (Strictly No Gradients)
```css
:root {
  --color-bg: #FFFFFF;
  --color-surface-subtle: #F6F6F8;
  --color-surface-card: #FFFFFF;
  --color-surface-dark: #0A0A0C;
  --color-surface-dark-card: #141418;
  --color-ink-primary: #0A0A0C;
  --color-ink-secondary: #52525A;
  --color-ink-tertiary: #8E8E98;
  --color-ink-inverse: #FFFFFF;
  --color-border-hairline: #E5E5EB;
  --color-border-dark: #222228;
  --color-spot: #FF3B00; /* Cadmium vermilion surgical accent */
  --color-spot-subtle: #FFF0EB;
  --color-spot-glow: #FF3B00;
  --color-success: #00B341;
  --color-warning: #FF9900;
}
```

## Typography
```css
:root {
  --font-serif-display: 'Bodoni Moda', Georgia, serif;
  --font-sans: 'Familjen Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;

  --text-display: 900 italic clamp(3.2rem, 8.5vw, 9rem) / 0.94 var(--font-serif-display);
  --text-h1: 700 clamp(2.4rem, 5.5vw, 5.2rem) / 1.02 var(--font-sans);
  --text-h2: 700 clamp(1.8rem, 3.5vw, 3.4rem) / 1.1 var(--font-sans);
  --text-h3: 600 clamp(1.2rem, 2vw, 1.8rem) / 1.25 var(--font-sans);
  --text-lead: 500 clamp(1.1rem, 1.6vw, 1.45rem) / 1.5 var(--font-sans);
  --text-body: 400 1rem / 1.6 var(--font-sans);
  --text-code: 500 0.88rem / 1.5 var(--font-mono);
  --text-micro: 600 0.72rem / 1.2 var(--font-mono);
}
```

## Motion Tokens
```css
:root {
  --ease-snappy: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-mechanical: cubic-bezier(0.7, 0, 0.2, 1);
  --ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
  --duration-micro: 180ms;
  --duration-card: 450ms;
  --duration-stage: 800ms;
}
```

