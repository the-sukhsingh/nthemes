# Next Theme OneShot 🎨

A CLI utility to scaffold `next-themes` setup in Next.js projects with ready-to-use **ThemeProvider** and **ThemeToggle** components - inspired by [shadcn/ui](https://ui.shadcn.com/).

## Features ✨

- ⚡ **One-command setup** - Initialize theme components instantly
- 🎯 **Next-themes integration** - Pre-configured ThemeProvider component
- 🌙 **Dark mode toggle** - Ready-to-use ThemeToggle component
- 📝 **TypeScript support** - Choose between JS and TS
- 🎨 **Customizable styling** - Uses Tailwind CSS classes (easily customizable)
- 🚀 **Zero config** - Works out of the box

## Installation

```bash
npm install -g nthemes
```

Or use it directly with npx:

```bash
npx nthemes
```

## Quick Start

1. **Run the CLI in your Next.js project:**

```bash
nthemes
```

2. **Follow the prompts:**
   - Choose where to create components (default: `src/components`)
   - Select TypeScript or JavaScript
   - Choose which components to create (ThemeProvider, ThemeToggle, or both)


3. **Wrap your app with ThemeProvider:**

**In `app/layout.tsx` (App Router):**

```tsx
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Or in `pages/_app.tsx` (Pages Router):**

```tsx
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

4. **Use ThemeToggle component:**

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

## Generated Files

### ThemeProvider.tsx/jsx

A wrapper component that:
- Initializes next-themes with system preference detection
- Provides theme context to your application
- Handles client-side hydration safely
- Exports `useTheme()` hook for theme access

### ThemeToggle.tsx/jsx

A ready-to-use button component that:
- Toggles between light and dark themes
- Shows appropriate icons based on current theme
- Includes built-in Tailwind CSS styling
- Handles mounting to prevent hydration mismatches

## Customization

### Change component styling

Both generated components use Tailwind CSS classes. You can customize them by editing the files directly:

```tsx
// In ThemeToggle.tsx - modify className to your liking
<button className="your-custom-classes">
  {/* icon */}
</button>
```

### Add to your design system

Treat the generated files as templates. Feel free to:
- Modify styling to match your design
- Add additional features (theme previews, etc.)
- Create variants of the toggle component

## Configuration

### ThemeProvider options

The generated ThemeProvider accepts all [next-themes options](https://github.com/pacocoursey/next-themes#api):

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
  themes={['light', 'dark', 'custom']}
  // ... any other next-themes option
>
  {children}
</ThemeProvider>
```

## Requirements

- Node.js 14.0.0 or higher
- Next.js 12.0.0 or higher
- React 16.8.0 or higher

## Troubleshooting

### Theme not applying on page load

Make sure ThemeProvider is wrapping your entire app and is placed in the root layout. The components handle hydration mismatch by checking if mounted.

### Flash of unstyled content (FOUC)

This is handled by the ThemeProvider component which waits for mounting before rendering. No additional configuration needed.

### TypeScript errors

If you get TypeScript errors after generation, ensure you have `next-themes` installed:

```bash
npm install next-themes
```

## License

ISC

## Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## Inspired by

This package is inspired by the excellent work of [shadcn/ui](https://ui.shadcn.com/) in making component scaffolding simple and elegant.
