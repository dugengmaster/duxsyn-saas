# 🏗️ Duxsyn SaaS - Architecture Design Document

**Version**: 1.0  
**Last Updated**: 2025-10-31  
**Author**: Duxsyn Team  
**Status**: Living Document

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design Philosophy](#design-philosophy)
3. [Layer Responsibilities](#layer-responsibilities)
4. [Naming Conventions](#naming-conventions)
5. [Design Patterns](#design-patterns)
6. [Data Flow](#data-flow)
7. [Best Practices](#best-practices)
8. [Examples](#examples)
9. [FAQ](#faq)

---

## 🎯 Architecture Overview

Duxsyn SaaS 採用 **分層架構 (Layered Architecture)** 結合 **容器/展示元件模式 (Container/Presentational Pattern)**，實現清晰的關注點分離與高度可維護性。

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│  Presentation Layer (Pure UI)                       │
│  daisy-ng Components                                │
│  - 純展示元件，無業務邏輯                              │
│  - 可重用、可測試                                     │
│  - selector: daisy-*                                │
└─────────────────────────────────────────────────────┘
                      ↑ 組合使用
┌─────────────────────────────────────────────────────┐
│  Container Layer (Smart Components)                 │
│  Pages & Layouts                                    │
│  - 組合 UI 元件                                       │
│  - 處理用戶互動                                       │
│  - 委託業務邏輯給 Modules                             │
│  - selector: page-*, layout-*                       │
└─────────────────────────────────────────────────────┘
                      ↓ 呼叫
┌─────────────────────────────────────────────────────┐
│  Business Logic Layer                               │
│  Modules (Services, Store, Models)                  │
│  - 業務邏輯實作                                       │
│  - 狀態管理                                          │
│  - API 整合                                          │
│  - 無 UI 元件                                        │
└─────────────────────────────────────────────────────┘
                      ↓ 訪問
┌─────────────────────────────────────────────────────┐
│  Data Access Layer                                  │
│  Core Services, HTTP, WebSocket                     │
│  - API 通訊                                          │
│  - 資料持久化                                        │
│  - 全域配置                                          │
└─────────────────────────────────────────────────────┘
```

### Project Structure

```
projects/
├── lib/                    # daisy-ng (Pure UI Components)
│   └── selector: daisy-*
│
└── client/                 # Duxsyn SaaS Application
    └── src/app/
        ├── pages/          # Container Components (selector: page-*)
        ├── layouts/        # Layout Containers (selector: layout-*)
        ├── modules/        # Business Logic (Services, Store, Models)
        ├── shared/         # Shared Utilities (selector: dux-*)
        └── core/           # Global Infrastructure
```

---

## 💡 Design Philosophy

### Core Principles

1. **關注點分離 (Separation of Concerns)**
   - UI 展示與業務邏輯完全解耦
   - 每一層都有明確且單一的職責

2. **可測試性 (Testability)**
   - 業務邏輯在 Services 中，可獨立測試
   - UI 元件可以 mock Services 進行測試

3. **可重用性 (Reusability)**
   - daisy-ng 元件可用於任何專案
   - Modules 的 Services 可跨 Pages 共用

4. **可維護性 (Maintainability)**
   - 清晰的分層結構，易於理解
   - 修改某層不影響其他層

5. **擴展性 (Scalability)**
   - 新增功能只需新增對應層級的檔案
   - 不會造成既有程式碼的混亂

---

## 📦 Layer Responsibilities

### 1. Presentation Layer (daisy-ng)

**職責：**
- 提供純 UI 元件
- 無業務邏輯、無狀態管理
- 只接收 `@Input()`，發出 `@Output()`

**特徵：**
- Selector: `daisy-*`
- 可獨立發布到 npm
- 可用於任何 Angular 專案

**範例：**
```typescript
@Component({
  selector: 'daisy-button',
  standalone: true,
  template: `
    <button 
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="onClick.emit()">
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  // Angular v20 Signal Inputs
  variant = input<'primary' | 'secondary'>('primary');
  disabled = input(false);
  
  // Angular v20 Signal Outputs
  onClick = output<void>();
  
  // Computed property
  buttonClasses = computed(() => `btn btn-${this.variant()}`);
}
```

---

### 2. Container Layer - Pages

**職責：**
- 路由端點 (Route Endpoints)
- 組合 daisy-ng 元件
- 處理用戶互動事件
- 呼叫 Modules 的 Services
- **不包含業務邏輯**

**特徵：**
- Selector: `page-{domain}-{name}`
- 一個 Page 對應一個路由
- 可能使用多個 Module Services

**範例：**
```typescript
@Component({
  selector: 'page-auth-login',
  standalone: true,
  imports: [DaisyInputComponent, DaisyButtonComponent, DaisyCardComponent, FormsModule],
  template: `
    <daisy-card>
      <h1>Login</h1>
      
      <daisy-input 
        [(ngModel)]="email" 
        placeholder="Email" />
      
      <daisy-input 
        [(ngModel)]="password" 
        type="password" 
        placeholder="Password" />
      
      <daisy-button 
        (click)="onLogin()"
        [loading]="authService.isLoading()">
        Login
      </daisy-button>
      
      @if (authService.error()) {
        <p class="text-error">{{ authService.error() }}</p>
      }
    </daisy-card>
  `
})
export class LoginComponent {
  // Angular v20: Use inject() function
  authService = inject(AuthService);
  
  // Local state
  email = '';
  password = '';
  
  onLogin() {
    // 只負責委託，不處理邏輯
    this.authService.login(this.email, this.password);
  }
}
```

**關鍵設計決策：**
- ✅ Pages 是「薄層」，只負責組合與委託
- ✅ 所有狀態來自 Services (透過 Signal 或 Observable)
- ✅ 不在 Page 中寫業務邏輯

---

### 3. Container Layer - Layouts

**職責：**
- 提供應用程式外殼 (App Shell)
- 組合導航、側邊欄、頁首頁尾
- 處理佈局切換邏輯
- 整合全域 UI 元件

**特徵：**
- Selector: `layout-{type}-{name}`
- 支援多 Layout 模式 (Landing / Auth / Main / Admin)
- 可能使用全域 Services (如 AuthService, ThemeService)

**範例：**
```typescript
@Component({
  selector: 'layout-main-header',
  standalone: true,
  imports: [DaisyNavbarComponent, DuxBreadcrumbComponent],
  template: `
    <daisy-navbar>
      <div class="navbar-start">
        <dux-breadcrumb [items]="breadcrumbs()" />
      </div>
      
      <div class="navbar-end">
        <daisy-dropdown [items]="userMenuItems">
          <daisy-avatar [src]="userService.currentUser()?.avatar" />
        </daisy-dropdown>
      </div>
    </daisy-navbar>
  `
})
export class HeaderComponent {
  userService = inject(UserService);
  router = inject(Router);
  
  breadcrumbs = computed(() => {
    // 從路由產生麵包屑
    return this.generateBreadcrumbs(this.router.url);
  });
  
  userMenuItems = [
    { label: 'Profile', action: () => this.router.navigate(['/profile']) },
    { label: 'Settings', action: () => this.router.navigate(['/settings']) },
    { label: 'Logout', action: () => this.userService.logout() }
  ];
}
```

---

### 4. Business Logic Layer - Modules

**職責：**
- 封裝業務邏輯
- 狀態管理 (使用 Signal Store / NgRx)
- API 整合
- 資料轉換與驗證
- **通常不包含 UI Components**

**特徵：**
- 主要包含 Services, Store, Models
- 可能有極少數 domain-specific components (使用 `dux-` prefix)
- 跨多個 Pages 重用

**目錄結構：**
```
modules/
├── auth/
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── auth-api.service.ts
│   ├── store/
│   │   └── auth.store.ts
│   └── models/
│       ├── user.model.ts
│       └── login-request.model.ts
├── user/
│   ├── services/
│   ├── store/
│   └── models/
└── dashboard/
    ├── services/
    ├── store/
    └── models/
```

**Service 範例：**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // State Management (使用 Signal)
  isLoading = signal(false);
  currentUser = signal<User | null>(null);
  error = signal<string | null>(null);
  
  login(email: string, password: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.http.post<LoginResponse>('/api/auth/login', { email, password })
      .pipe(
        tap(response => {
          // 業務邏輯：儲存 token
          localStorage.setItem('token', response.token);
          this.currentUser.set(response.user);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          // 業務邏輯：導航
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          // 業務邏輯：錯誤處理
          this.error.set(err.message);
        }
      });
  }
  
  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
  
  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
```

**Store 範例 (使用 NgRx Signal Store)：**
```typescript
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState<DashboardState>({
    stats: null,
    isLoading: false,
    error: null
  }),
  withComputed((state) => ({
    hasData: computed(() => !!state.stats()),
    totalUsers: computed(() => state.stats()?.totalUsers ?? 0)
  })),
  withMethods((store, dashboardApi = inject(DashboardApiService)) => ({
    async loadStats() {
      patchState(store, { isLoading: true, error: null });
      
      try {
        const stats = await dashboardApi.getStats();
        patchState(store, { stats, isLoading: false });
      } catch (error) {
        patchState(store, { 
          error: error.message, 
          isLoading: false 
        });
      }
    }
  }))
);
```

---

### 5. Shared Layer

**職責：**
- 提供跨模組的共用元件、指令、Pipes
- 少數業務相關但可重用的 UI 元件
- 工具函式與輔助類別

**特徵：**
- Components: `dux-{name}`
- Directives: `[dux{Name}]`
- Pipes: `dux{Name}`

**範例：**
```typescript
// Shared Component
@Component({
  selector: 'dux-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="breadcrumb">
      @for (item of items(); track item.label) {
        <a [routerLink]="item.route">{{ item.label }}</a>
      }
    </nav>
  `
})
export class BreadcrumbComponent {
  // Angular v20: Signal input
  items = input<BreadcrumbItem[]>([]);
}

// Shared Directive
@Directive({
  selector: '[duxPermission]',
  standalone: true
})
export class PermissionDirective implements OnInit {
  // Angular v20: Signal input
  duxPermission = input.required<string>();
  
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);
  
  ngOnInit() {
    if (this.authService.hasPermission(this.duxPermission())) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

// Shared Pipe
@Pipe({
  name: 'duxDateTime',
  standalone: true
})
export class DateTimePipe implements PipeTransform {
  transform(value: Date | string): string {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
  }
}
```

---

### 6. Core Layer

**職責：**
- 全域基礎設施
- Guards, Interceptors
- 全域配置與常數
- 單例 Services

**範例：**
```typescript
// Guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.createUrlTree(['/auth/login']);
};

// Interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

---

## 🏷️ Naming Conventions

### Component Selectors

| Layer | Prefix | Pattern | Example | Class Name |
|-------|--------|---------|---------|------------|
| **Pages** | `page-` | `page-{domain}-{name}` | `page-auth-login` | `LoginComponent` |
| **Layouts** | `layout-` | `layout-{type}-{name}` | `layout-main-header` | `HeaderComponent` |
| **Modules Components** | `dux-` | `dux-{module}-{name}` | `dux-user-card` | `UserCardComponent` |
| **Shared Components** | `dux-` | `dux-{name}` | `dux-breadcrumb` | `BreadcrumbComponent` |
| **daisy-ng** | `daisy-` | `daisy-{name}` | `daisy-button` | `ButtonComponent` |

### Other Artifacts

| Type | Naming | Example |
|------|--------|---------|
| **Service** | `{Name}Service` | `AuthService`, `UserService` |
| **Store** | `{Name}Store` | `AuthStore`, `DashboardStore` |
| **Model** | `{Name}` or `{Name}Model` | `User`, `LoginRequest` |
| **Guard** | `{name}.guard.ts` | `auth.guard.ts` |
| **Interceptor** | `{name}.interceptor.ts` | `auth.interceptor.ts` |
| **Directive** | `[dux{Name}]` | `[duxPermission]` |
| **Pipe** | `dux{Name}` | `duxDateTime` |

### File Naming

```
{name}.component.ts       # Component
{name}.service.ts         # Service
{name}.store.ts           # Store
{name}.model.ts           # Model/Interface
{name}.guard.ts           # Guard
{name}.interceptor.ts     # Interceptor
{name}.directive.ts       # Directive
{name}.pipe.ts            # Pipe
{name}.util.ts            # Utility
```

---

## 🎨 Design Patterns

### 1. Container/Presentational Pattern

**核心概念：**
- **Presentational Components** (daisy-ng): 只負責展示，無狀態
- **Container Components** (Pages/Layouts): 管理狀態，處理邏輯委託

**優勢：**
- UI 元件高度可重用
- 容易進行 UI 測試
- 業務邏輯集中管理

---

### 2. Dependency Injection

所有 Services 使用 Angular 的 DI 系統：

```typescript
// Service 定義
@Injectable({ providedIn: 'root' })
export class AuthService { }

// Component 注入
export class LoginComponent {
  authService = inject(AuthService);
}
```

---

### 3. Reactive State Management

使用 **Signal** 或 **NgRx Signal Store** 進行狀態管理：

```typescript
// Signal-based state
@Injectable({ providedIn: 'root' })
export class UserService {
  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();
  
  setUser(user: User) {
    this._currentUser.set(user);
  }
}

// Component 使用
export class HeaderComponent {
  userService = inject(UserService);
  
  // Template 中直接使用
  // {{ userService.currentUser()?.name }}
}
```

---

### 4. Single Responsibility Principle

每個檔案、類別、函式只做一件事：

- ✅ Pages 只負責組合與委託
- ✅ Services 只負責業務邏輯
- ✅ Components 只負責 UI 展示
- ✅ Models 只負責類型定義

---

## 🔄 Data Flow

### 典型的使用者互動流程

```
1. User clicks button in Page
   ↓
2. Page calls Module Service
   ↓
3. Service updates state (Signal/Store)
   ↓
4. Service makes API call
   ↓
5. Service updates state with response
   ↓
6. Page automatically re-renders (reactive)
```

### 實際範例：登入流程

```typescript
// 1. User clicks login button
<daisy-button (click)="onLogin()">Login</daisy-button>

// 2. Page delegates to Service
onLogin() {
  this.authService.login(this.email, this.password);
}

// 3. Service handles business logic
login(email: string, password: string) {
  this.isLoading.set(true);  // Update state
  
  this.http.post('/api/login', { email, password })
    .subscribe({
      next: (response) => {
        this.currentUser.set(response.user);  // Update state
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error.set(error.message);  // Update state
      },
      complete: () => {
        this.isLoading.set(false);  // Update state
      }
    });
}

// 4. Page template reacts to state changes
@if (authService.isLoading()) {
  <p>Loading...</p>
}
```

---

## ✅ Best Practices

### Pages & Layouts

1. **保持薄層 (Keep it Thin)**
   ```typescript
   // ❌ Bad - 業務邏輯在 Page
   onLogin() {
     this.http.post('/api/login', data).subscribe(/* ... */);
   }
   
   // ✅ Good - 委託給 Service
   onLogin() {
     this.authService.login(this.email, this.password);
   }
   ```

2. **避免直接操作 DOM**
   ```typescript
   // ❌ Bad
   document.getElementById('modal').style.display = 'block';
   
   // ✅ Good - 使用 daisy-ng 元件
   showModal = signal(true);
   <daisy-modal [open]="showModal()">
   ```

3. **使用 Reactive State**
   ```typescript
   // ✅ Good - 從 Service 取得響應式狀態
   isLoading = this.authService.isLoading;
   
   <daisy-button [loading]="isLoading()">
   ```

---

### Modules

1. **單一職責**
   ```typescript
   // ✅ Good - AuthService 只處理認證
   @Injectable({ providedIn: 'root' })
   export class AuthService {
     login() { }
     logout() { }
     isAuthenticated() { }
   }
   
   // ✅ Good - UserService 處理用戶資料
   @Injectable({ providedIn: 'root' })
   export class UserService {
     getUserProfile() { }
     updateProfile() { }
   }
   ```

2. **使用 Signal 管理狀態**
   ```typescript
   // ✅ Good
   @Injectable({ providedIn: 'root' })
   export class UserService {
     private _users = signal<User[]>([]);
     users = this._users.asReadonly();
     
     addUser(user: User) {
       this._users.update(users => [...users, user]);
     }
   }
   ```

3. **錯誤處理集中化**
   ```typescript
   // ✅ Good
   @Injectable({ providedIn: 'root' })
   export class AuthService {
     error = signal<string | null>(null);
     
     login(email: string, password: string) {
       this.error.set(null);  // 清除舊錯誤
       
       this.http.post('/api/login', { email, password })
         .subscribe({
           error: (err) => {
             this.error.set(this.formatError(err));
           }
         });
     }
   }
   ```

---

### daisy-ng Components

1. **保持純淨 (Keep it Pure)**
   ```typescript
   // ✅ Good - 無副作用，使用 Signal Inputs/Outputs
   @Component({
     selector: 'daisy-button',
     standalone: true,
     template: `<button [class]="classes()"><ng-content /></button>`
   })
   export class ButtonComponent {
     variant = input<'primary' | 'secondary'>('primary');
     onClick = output<void>();
     
     classes = computed(() => `btn btn-${this.variant()}`);
   }
   ```

2. **使用 OnPush 策略**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush  // ✅
   })
   ```

3. **避免注入 Services**
   ```typescript
   // ❌ Bad - daisy-ng 不應依賴業務邏輯
   authService = inject(AuthService);
   
   // ✅ Good - 只透過 Signal Input 接收資料
   isAuthenticated = input(false);
   ```

---

## 📚 Examples

### 完整範例：Dashboard Overview Page

#### 1. Page Component

```typescript
// pages/dashboard/overview/overview.component.ts
@Component({
  selector: 'page-dashboard-overview',
  standalone: true,
  imports: [
    DaisyCardComponent,
    DaisyButtonComponent,
    DuxDashboardWidgetComponent
  ],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      
      @if (dashboardStore.isLoading()) {
        <p>Loading...</p>
      } @else if (dashboardStore.error()) {
        <p class="text-error">{{ dashboardStore.error() }}</p>
      } @else {
        <div class="grid grid-cols-3 gap-4">
          <daisy-card>
            <h3>Total Users</h3>
            <p class="text-4xl">{{ dashboardStore.totalUsers() }}</p>
          </daisy-card>
          
          <daisy-card>
            <h3>Revenue</h3>
            <p class="text-4xl">{{ dashboardStore.stats()?.revenue }}</p>
          </daisy-card>
          
          <daisy-card>
            <h3>Active Sessions</h3>
            <p class="text-4xl">{{ dashboardStore.stats()?.activeSessions }}</p>
          </daisy-card>
        </div>
        
        <daisy-button (click)="onRefresh()">
          Refresh Data
        </daisy-button>
      }
    </div>
  `
})
export class OverviewComponent implements OnInit {
  // Angular v20: Use inject() function
  dashboardStore = inject(DashboardStore);
  
  ngOnInit() {
    this.dashboardStore.loadStats();
  }
  
  onRefresh() {
    this.dashboardStore.loadStats();
  }
}
```

#### 2. Module Service

```typescript
// modules/dashboard/services/dashboard-api.service.ts
@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  // Angular v20: Use inject() function
  private http = inject(HttpClient);
  private apiUrl = '/api/dashboard';
  
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
  
  getChartData(period: string): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.apiUrl}/chart?period=${period}`);
  }
}
```

#### 3. Module Store

```typescript
// modules/dashboard/store/dashboard.store.ts
export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState<DashboardState>({
    stats: null,
    isLoading: false,
    error: null
  }),
  withComputed((state) => ({
    hasData: computed(() => !!state.stats()),
    totalUsers: computed(() => state.stats()?.totalUsers ?? 0),
    revenue: computed(() => state.stats()?.revenue ?? 0)
  })),
  withMethods((store, api = inject(DashboardApiService)) => ({
    async loadStats() {
      patchState(store, { isLoading: true, error: null });
      
      try {
        const stats = await firstValueFrom(api.getStats());
        patchState(store, { stats, isLoading: false });
      } catch (error) {
        patchState(store, { 
          error: error.message, 
          isLoading: false 
        });
      }
    }
  }))
);
```

#### 4. Models

```typescript
// modules/dashboard/models/dashboard.model.ts
export interface DashboardStats {
  totalUsers: number;
  revenue: number;
  activeSessions: number;
  growthRate: number;
}

export interface ChartData {
  labels: string[];
  values: number[];
}
```

---

## ❓ FAQ

### Q1: 為什麼 Modules 通常沒有 Components？

**A:** Modules 專注於業務邏輯，不負責 UI 展示。所有 UI 組合都在 Pages/Layouts 完成。這樣可以：
- 讓業務邏輯更容易測試（無 DOM 依賴）
- 讓 UI 和邏輯完全解耦
- Services 可以跨多個 Pages 重用

如果確實需要 domain-specific 的 UI 元件，可以放在 `modules/{module}/components/` 並使用 `dux-` prefix。

---

### Q2: 這個架構是 MVVM 嗎？

**A:** 不完全是。這個架構是 **Layered Architecture + Container/Presentational Pattern** 的結合，比傳統 MVVM 有更清晰的分層：

| Layer | MVVM | 本架構 |
|-------|------|--------|
| View | Template | daisy-ng + Template |
| ViewModel | Component | Pages (部分職責) |
| Model | Service | Modules Services + Store |

本架構的優勢：
- 比 MVVM 有更好的 UI/邏輯分離
- 符合現代前端最佳實踐 (React/Angular 社群推薦)
- 更容易測試與維護

---

### Q3: Page 和 Module 的命名需要一致嗎？

**A:** 不需要。它們是獨立的關注點：
- **Pages** 按路由組織 (`page-auth-login`, `page-dashboard-overview`)
- **Modules** 按業務領域組織 (`modules/auth`, `modules/dashboard`)

一個 Page 可能使用多個 Modules 的 Services：

```typescript
export class DashboardOverviewComponent {
  userService = inject(UserService);        // modules/user
  analyticsService = inject(AnalyticsService);  // modules/analytics
  notificationService = inject(NotificationService);  // modules/notification
}
```

---

### Q4: 什麼時候應該用 Shared Components (dux-*)?

**A:** 當元件符合以下條件時：
1. 跨多個 Pages 使用
2. 包含業務邏輯（不適合放 daisy-ng）
3. 與 Duxsyn 專案強相關（不適合開源）

範例：
- `dux-breadcrumb` - 整合路由狀態
- `dux-notification-bell` - 包含通知 API 呼叫
- `dux-user-menu` - 包含登出邏輯

如果是純 UI 元件且無業務邏輯，應該放在 daisy-ng。

---

### Q5: 如何處理跨 Module 的資料共享？

**A:** 三種方式：

1. **Service 注入**（推薦）
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class DashboardService {
     userService = inject(UserService);  // 注入其他 Module
     
     getDashboardData() {
       const user = this.userService.currentUser();
       // 使用 user 資料
     }
   }
   ```

2. **Store 共享**
   ```typescript
   export class AnalyticsService {
     userStore = inject(UserStore);  // 訪問其他 Module 的 Store
     
     trackUserAction() {
       const userId = this.userStore.currentUser()?.id;
     }
   }
   ```

3. **Event Bus**（複雜場景）
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class EventBusService {
     private events$ = new Subject<AppEvent>();
     
     emit(event: AppEvent) {
       this.events$.next(event);
     }
     
     on(eventType: string): Observable<AppEvent> {
       return this.events$.pipe(filter(e => e.type === eventType));
     }
   }
   ```

---

### Q6: 如何測試這個架構？

**A:**

**1. Services (最重要，最容易測試)**
```typescript
describe('AuthService', () => {
  it('should login successfully', () => {
    const service = new AuthService(mockHttpClient, mockRouter);
    
    service.login('test@example.com', 'password');
    
    expect(service.isLoading()).toBe(true);
    // 測試 HTTP 呼叫、狀態更新等
  });
});
```

**2. Components (使用 Mock Services)**
```typescript
describe('LoginComponent', () => {
  it('should call authService.login on button click', () => {
    const mockAuthService = { login: jest.fn() };
    const component = new LoginComponent();
    component.authService = mockAuthService;
    
    component.onLogin();
    
    expect(mockAuthService.login).toHaveBeenCalled();
  });
});
```

**3. E2E Tests (完整流程)**
```typescript
test('user can login', async () => {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button');
  
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 📖 References

### Design Patterns
- [Container/Presentational Pattern - Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Angular Architecture Patterns](https://angular.dev/style-guide)
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### Angular Best Practices
- [Angular Style Guide](https://angular.dev/style-guide)
- [NgRx Signal Store](https://ngrx.io/guide/signals)
- [Angular Signals](https://angular.dev/guide/signals)

### Related Articles
- [Layered Architecture](https://en.wikipedia.org/wiki/Multitier_architecture)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)

---

## 📝 Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-31 | Initial architecture document |

---

**本文件為 Living Document，將隨專案演進持續更新。**