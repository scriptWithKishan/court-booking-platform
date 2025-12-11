# Tailwind CSS v4 Migration Notes

## What Changed

This project has been upgraded to **Tailwind CSS v4**, which brings several improvements and simplifications:

### 1. Simplified Installation
- **Before (v3):** Required `tailwindcss`, `postcss`, and `autoprefixer`
- **After (v4):** Only requires `tailwindcss@next`

### 2. No PostCSS Configuration
- **Before (v3):** Needed `postcss.config.js` file
- **After (v4):** PostCSS config is no longer needed - file has been removed

### 3. Updated CSS Import Syntax
- **Before (v3):**
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- **After (v4):**
  ```css
  @import "tailwindcss";
  ```

### 4. Custom Styles Approach
- **Before (v3):** Used `@layer` and `@apply` directives
- **After (v4):** Custom styles written in vanilla CSS for better compatibility

## Installation

To install Tailwind CSS v4:

```bash
cd frontend
npm install -D tailwindcss@next
```

## Configuration

The `tailwind.config.js` file remains similar but simplified:
- No `plugins` array needed
- Standard `content`, `theme`, and `extend` configuration

## Benefits

1. **Faster builds** - Optimized build process
2. **Simpler setup** - Fewer dependencies and configuration files
3. **Better performance** - Improved CSS generation
4. **Modern approach** - Uses native CSS features where possible

## Compatibility

All existing Tailwind utility classes work exactly the same. The only changes are in the setup and custom CSS syntax.
