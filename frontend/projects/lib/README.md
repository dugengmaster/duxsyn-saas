# 🌼 daisy-ng

> DaisyUI Components for Angular - A modern, accessible UI component library

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Angular](https://img.shields.io/badge/Angular-v20+-red)
![DaisyUI](https://img.shields.io/badge/DaisyUI-v5+-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 About

**daisy-ng** is an open-source Angular component library that wraps [DaisyUI](https://daisyui.com/) with native Angular components. It provides:

- 🎨 **DaisyUI Design System** - Beautiful, themeable components
- 🔧 **Angular Native** - Built with Angular Standalone Components
- ♿ **Accessible** - WCAG 2.1 compliant
- 📦 **Tree-shakable** - Optimized bundle size
- 🎭 **Themeable** - Support for DaisyUI's 30+ themes
- ⚡ **Performance** - OnPush change detection strategy

---

## 🚀 Installation

```bash
npm install @daisy-ng/core
```

### Prerequisites

- Angular >= 20.0.0
- Tailwind CSS >= 3.0.0
- DaisyUI >= 5.0.0

---

## 🎯 Quick Start

### 1. Install DaisyUI

```bash
npm install -D daisyui@latest
```

### 2. Configure Tailwind

```javascript
// tailwind.config.js
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
```

### 3. Import Components

```typescript
import { DaisyButtonComponent } from '@daisy-ng/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DaisyButtonComponent],
  template: `
    <daisy-button variant="primary">Click Me</daisy-button>
  `
})
export class AppComponent {}
```

---

## 📦 Available Components

### Atoms

| Component | Selector | Status |
|-----------|----------|--------|
| Button    | `<daisy-button>` | ☐ |
| Badge     | `<daisy-badge>` | ☐ |
| Avatar    | `<daisy-avatar>` | ☐ |
| Chip      | `<daisy-chip>` | ☐ |
| Icon      | `<daisy-icon>` | ☐ |

### Molecules

| Component | Selector | Status |
|-----------|----------|--------|
| Input     | `<daisy-input>` | ☐ |
| Checkbox  | `<daisy-checkbox>` | ☐ |
| Radio     | `<daisy-radio>` | ☐ |
| Toggle    | `<daisy-toggle>` | ☐ |
| Card      | `<daisy-card>` | ☐ |

### Organisms

| Component | Selector | Status |
|-----------|----------|--------|
| Modal     | `<daisy-modal>` | ☐ |
| Drawer    | `<daisy-drawer>` | ☐ |
| Table     | `<daisy-table>` | ☐ |
| Dropdown  | `<daisy-dropdown>` | ☐ |
| Navbar    | `<daisy-navbar>` | ☐ |

---

## 🎨 Component Development Guide

### Template & Style Strategy

All components use **inline templates and styles** by default for optimal npm distribution:

```typescript
@Component({
  selector: 'daisy-button',
  standalone: true,
  template: `
    <button [class]="buttonClasses" [disabled]="disabled">
      <ng-content />
    </button>
  `,
  styles: `:host { display: inline-block; }`
})
```

#### When to Extract Files

| Template Size | Strategy |
|--------------|----------|
| < 30 lines   | Keep inline ✅ |
| 30-50 lines  | Consider extracting |
| > 50 lines   | Use external files ⚠️ |

**Complex components** (Modal, Table, Form) should use external template files:

```
modal/
├── modal.component.ts
├── modal.component.html
└── modal.component.css
```

### Generating Components

```bash
# Simple component (uses inline by default)
nx g @nx/angular:c button --project=lib
# Generates: button.component.ts (inline template & style)

# Complex component (manually create external files)
nx g @nx/angular:c modal --project=lib
# Then extract template and styles to separate files
```

### Component Structure

```typescript
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'daisy-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      [class]="buttonClasses"
      [disabled]="disabled"
      [type]="type">
      <ng-content />
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `
})
export class DaisyButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'accent' = 'primary';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  get buttonClasses(): string {
    return `btn btn-${this.variant} btn-${this.size}`;
  }
}
```

---

## 🛠️ Development

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/your-org/daisy-ng.git
cd daisy-ng

# Install dependencies
npm install

# Start development server
nx serve demo
```

### Available Commands

```bash
# Build library
nx build lib

# Run tests
nx test lib

# Lint
nx lint lib

# Generate component
nx g @nx/angular:c components/[name] --project=lib
```

### Project Structure

```
projects/lib/
├── src/
│   ├── components/
│   │   ├── button/
│   │   ├── badge/
│   │   └── ...
│   ├── directives/
│   ├── pipes/
│   ├── services/
│   └── public-api.ts
├── README.md
└── package.json
```

---

## 📚 Documentation

- [Component API Reference](./docs/api/)
- [Theming Guide](./docs/theming.md)
- [Accessibility Guidelines](./docs/accessibility.md)
- [Migration Guide](./docs/migration.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-component`)
3. Follow the [Component Guidelines](./docs/component-guidelines.md)
4. Write tests and ensure coverage
5. Commit your changes (`git commit -m 'feat: add new component'`)
6. Push to the branch (`git push origin feature/new-component`)
7. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add daisy-button component
fix: resolve modal backdrop issue
docs: update installation guide
style: format code with prettier
refactor: simplify checkbox logic
test: add button component tests
chore: update dependencies
```

---

## 📦 Publishing to npm

```bash
# Build the library
nx build lib --configuration=production

# Navigate to dist
cd dist/lib

# Publish (requires npm account)
npm publish --access public
```

---

## 🔗 Related Projects

- [DaisyUI](https://daisyui.com/) - The CSS component library
- [Tailwind CSS](https://tailwindcss.com/) - The utility-first CSS framework
- [Angular](https://angular.dev/) - The web framework

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/your-org/daisy-ng/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/daisy-ng/discussions)
- **Email**: contact@daisy-ng.dev

---

**Built with 🌼 for the Angular community**