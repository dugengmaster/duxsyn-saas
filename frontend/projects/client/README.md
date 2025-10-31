# 🚀 Duxsyn SaaS - Client Application

> Modern SaaS frontend application built with Angular v20+ and Nx Monorepo

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Angular](https://img.shields.io/badge/Angular-v20+-red)
![Nx](https://img.shields.io/badge/Nx-Monorepo-blue)

---

## 📖 About

**Duxsyn SaaS Client** is the main application of the Duxsyn SaaS platform. It provides a comprehensive, multi-layout frontend architecture suitable for enterprise web applications.

### Key Features

- 🎭 **Multi-Layout System** - Landing, Auth, Main, Admin layouts
- 🧩 **Domain-Driven Architecture** - Modular and scalable structure
- 🎨 **UI Components** - Powered by [daisy-ng](../lib/README.md)
- 🔒 **Standalone Components** - Modern Angular architecture
- 📱 **Responsive Design** - Tailwind CSS + DaisyUI
- 🛡️ **Type-Safe** - Full TypeScript coverage

---

## 🏗️ Architecture

```
src/app/
├── core/           # Global services, guards, interceptors
├── layouts/        # App shell & layout containers
├── modules/        # Domain services & business logic
├── pages/          # Routed pages & UI components
├── shared/         # Reusable components, pipes, directives
└── configs/        # API endpoints & environment configs
```

### Dependency Flow

```
pages/ → modules/ → shared/ → core/
  ↓                    ↓
layouts/           daisy-ng (lib)
```

---

## 🎯 Selector Naming Convention

### Component Selectors

| Layer | Prefix | Pattern | Example |
|-------|--------|---------|---------|
| **Pages** | `page-` | `page-{domain}-{name}` | `page-auth-login` |
| **Layouts** | `layout-` | `layout-{type}-{name}` | `layout-main-header` |
| **Shared** | `dux-` | `dux-{name}` | `dux-breadcrumb` |
| **Core** | `app-` | `app-{name}` | (rarely used) |

### Directives

```typescript
// Shared directives (no visible prefix in template)
[duxPermission]="'admin'"
[duxTooltip]="message"
[duxLazyLoad]

// Core directives
[appClickOutside]
[appDebounce]
```

### Pipes

```typescript
// Use 'dux' prefix in pipe names
{{ date | duxDateTime }}
{{ price | duxCurrency }}
{{ status | duxBadge }}
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Nx CLI (recommended)

### Installation

```bash
# Install dependencies (from monorepo root)
npm install

# Serve client application
nx serve client

# Open browser
# http://localhost:4200
```

---

## 🛠️ Development

### Available Commands

```bash
# Development
nx serve client                    # Start dev server
nx serve client --open             # Auto-open browser

# Build
nx build client                    # Production build
nx build client --configuration=development

# Testing
nx test client                     # Run unit tests
nx test client --watch             # Watch mode
nx e2e client-e2e                  # E2E tests

# Code Quality
nx lint client                     # Run linter
nx lint client --fix               # Auto-fix issues
```

### Code Generation

All components use **standalone architecture** with **OnPush** change detection.

#### Generate Pages

```bash
# Auth pages
nx g @nx/angular:c pages/auth/login --project=client --selector=page-auth-login
nx g @nx/angular:c pages/auth/register --project=client --selector=page-auth-register

# Dashboard pages
nx g @nx/angular:c pages/dashboard/overview --project=client --selector=page-dashboard-overview

# User pages
nx g @nx/angular:c pages/user/profile --project=client --selector=page-user-profile
```

#### Generate Layouts

```bash
# Main layout components
nx g @nx/angular:c layouts/main/header --project=client --selector=layout-main-header
nx g @nx/angular:c layouts/main/sidebar --project=client --selector=layout-main-sidebar
nx g @nx/angular:c layouts/main/footer --project=client --selector=layout-main-footer

# Admin layout components
nx g @nx/angular:c layouts/admin/navbar --project=client --selector=layout-admin-navbar
```

#### Generate Shared Components

```bash
# Shared components (uses default 'dux-' prefix)
nx g @nx/angular:c shared/components/breadcrumb --project=client
# Generates: dux-breadcrumb

nx g @nx/angular:c shared/components/notification-bell --project=client
# Generates: dux-notification-bell
```

#### Generate Services

```bash
# Module services (no selector needed)
nx g @nx/angular:service modules/auth/services/auth --project=client
nx g @nx/angular:service modules/user/services/user --project=client
nx g @nx/angular:service modules/dashboard/services/dashboard --project=client
```

#### Generate Directives

```bash
# Shared directives
nx g @nx/angular:directive shared/directives/permission --project=client
# Generates: duxPermission

nx g @nx/angular:directive shared/directives/tooltip --project=client
# Generates: duxTooltip
```

#### Generate Pipes

```bash
# Shared pipes
nx g @nx/angular:pipe shared/pipes/date-time --project=client
# Generates: duxDateTime

nx g @nx/angular:pipe shared/pipes/currency --project=client
# Generates: duxCurrency
```

---

## 📂 Project Structure

```
projects/client/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── services/
│   │   │   └── directives/
│   │   ├── layouts/
│   │   │   ├── landing/
│   │   │   ├── auth/
│   │   │   ├── main/
│   │   │   └── admin/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── user/
│   │   │   └── admin/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── utils/
│   │   └── configs/
│   ├── assets/
│   ├── styles.css
│   └── main.ts
├── public/
├── project.json
└── tsconfig.app.json
```

---

## 🧩 Modules Overview

| Module | Description | Priority | Status |
|--------|-------------|----------|--------|
| **Auth** | Login, registration, password reset | High | ☐ |
| **User** | User profile & account settings | High | ☐ |
| **Dashboard** | User control panel overview | High | ☐ |
| **Admin** | System administration panel | Medium | ☐ |
| **Integration** | External API / MQTT / Webhook | Medium | ☐ |
| **Analytics** | Data visualization & reports | Medium | ☐ |
| **System Monitor** | Health check & monitoring | Medium | ☐ |
| **Audit Log** | Operation tracking & events | Medium | ☐ |

---

## 🎨 Styling Guidelines

### Using daisy-ng Components

```typescript
import { DaisyButtonComponent, DaisyCardComponent } from '@daisy-ng/core';

@Component({
  selector: 'page-dashboard-overview',
  standalone: true,
  imports: [DaisyButtonComponent, DaisyCardComponent],
  template: `
    <daisy-card>
      <h2>Welcome to Dashboard</h2>
      <daisy-button variant="primary" (click)="onAction()">
        Get Started
      </daisy-button>
    </daisy-card>
  `
})
export class DashboardOverviewComponent {}
```

### Custom Shared Components

```typescript
// dux- prefixed business components
import { DuxBreadcrumbComponent } from '@shared/components/breadcrumb';

@Component({
  selector: 'page-user-profile',
  standalone: true,
  imports: [DuxBreadcrumbComponent],
  template: `
    <dux-breadcrumb [items]="breadcrumbItems" />
    <!-- Page content -->
  `
})
export class UserProfileComponent {}
```

---

## 🛡️ Type Safety

### Environment Configuration

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  wsUrl: 'ws://localhost:8000/ws'
};
```

### API Type Definitions

```typescript
// src/app/modules/auth/models/auth.model.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
```

---

## 🚢 Build & Deployment

### Build Configurations

```bash
# Development build
nx build client --configuration=development

# Production build (optimized)
nx build client --configuration=production

# Output location
dist/client/
```

### Bundle Size Budgets

| Type | Warning | Error |
|------|---------|-------|
| Initial | 500 kB | 1 MB |
| Component Style | 4 kB | 8 kB |

---

## 📝 Development Guidelines

### Component Creation Checklist

- [ ] Use appropriate selector prefix (`page-`, `layout-`, `dux-`)
- [ ] Set `standalone: true`
- [ ] Set `changeDetection: OnPush`
- [ ] Use `inlineStyle` for simple components (< 20 lines)
- [ ] Import only required dependencies
- [ ] Add proper TypeScript types
- [ ] Follow naming conventions

### File Naming Convention

```
{name}.component.ts        # Component
{name}.service.ts          # Service
{name}.guard.ts            # Guard
{name}.interceptor.ts      # Interceptor
{name}.pipe.ts             # Pipe
{name}.directive.ts        # Directive
{name}.model.ts            # Type definitions
```

---

## 🔗 Related Documentation

- [Main Project README](../../README.md)
- [Development Plan](../../docs/dev-plan.md)
- [daisy-ng Library](../lib/README.md)
- [API Documentation](../../docs/api/)

---

## 📧 Support

For questions or issues related to the Duxsyn SaaS client:

- Internal Team Channel: `#duxsyn-frontend`
- Issue Tracker: [Project Issues](link-to-your-issue-tracker)

---

**Part of the Duxsyn SaaS Ecosystem** 🚀