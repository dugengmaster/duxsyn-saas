## 🌐 Angular 多 Layout 架構設計 — `feature.md`

### 🎯 目標

建立一個可同時支援 `welcome`、`auth`、`app` 三種版型（layout）的高擴充 Angular 架構，並確保：

* `/login` 可直接對應 Auth Layout（非 `/auth/login`）
* 可根據路由動態切換 Layout
* 支援 lazy loading 與 route data 配置
* 維持乾淨與可擴充的專案結構

---

### 🏗️ 專案目錄結構建議

```bash
src/
 ├─ app/
 │   ├─ core/             # 全域服務、守衛、interceptor、layoutType 控制
 │   ├─ layouts/          # Layout 元件 (Auth / App / Public)
 │   │   ├─ auth-layout/
 │   │   ├─ app-layout/
 │   │   └─ public-layout/
 │   ├─ pages/            # 實際頁面邏輯
 │   │   ├─ auth/
 │   │   │   └─ login/
 │   │   │       ├─ login.component.ts
 │   │   │       ├─ login.component.html
 │   │   │       └─ login.component.scss
 │   │   ├─ dashboard/
 │   │   └─ welcome/
 │   ├─ app-routing.module.ts
 │   └─ app.component.*
```

---

### 🔒 路由設定

#### ✅ `/login` 掛載 Auth Layout

```ts
{
  path: 'login',
  component: AuthLayoutComponent,
  children: [
    {
      path: '',
      loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
      data: { layout: 'auth' }
    },
  ],
}
```

➡️ 實際網址：`/login`
➡️ 使用 `<app-auth-layout>` 容器渲染登入畫面。

---

### 🧱 Layout 實作位置

**檔案位置：** `app/layouts/auth-layout/`

```html
<!-- auth-layout.component.html -->
<div class="auth-container">
  <div class="auth-card">
    <router-outlet></router-outlet>
  </div>
</div>
```

```scss
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f6fa;
}
```

---

### 🧠 AppComponent 動態 Layout 控制

```ts
this.router.events.subscribe(e => {
  if (e instanceof NavigationEnd) {
    const layout = this.router.routerState.root.firstChild?.snapshot.data['layout'];
    this.layoutType = layout ?? 'public';
  }
});
```

> 根據路由 meta data 自動切換 layoutType，預設為 `public`。

---

### 💡 Layout 判斷策略

| Layout 類型 | 對應路由前綴                                | 使用範例     |
| --------- | ------------------------------------- | -------- |
| `public`  | `/welcome`, `/about`                  | 公開首頁與行銷頁 |
| `auth`    | `/login`, `/register`                 | 登入與註冊區域  |
| `app`     | `/dashboard`, `/devices`, `/settings` | 登入後主應用   |

---

### ⚙️ Lazy Loading 設定

```ts
{
  path: 'app',
  component: AppLayoutComponent,
  loadChildren: () => import('./pages/app/app.module').then(m => m.AppModule),
  data: { layout: 'app' }
}
```

➡️ `/app/**` 下的所有子路由都會自動使用 App Layout。

---

### 🧩 技術重點摘要

* **集中式 Layout 控制**：透過 `layoutType` 與 `router.data` 控制模板顯示。
* **低維護成本**：減少多重 layout 重複樣板。
* **可延展性強**：支援 SSR / 多品牌 / Multi-tenant 結構。
* **客家精神**：一層 app.component.html 同時掌控三種 Layout。 💰

---

### 🗺️ Mermaid 路由結構圖

```mermaid
graph TD
A[AppComponent] -->|layoutType=public| B[PublicLayout]
A -->|layoutType=auth| C[AuthLayout]
A -->|layoutType=app| D[AppLayout]
B --> E[/welcome]
C --> F[/login]
D --> G[/dashboard]
D --> H[/devices]
```

---

### ✅ 總結

| 功能                      | 實作方式                       | 優點              |
| ----------------------- | -------------------------- | --------------- |
| `/login` 使用 Auth Layout | Root-level children + data | URL 簡潔、結構清晰     |
| 多 layout 管理             | 放在 `/layouts/`             | 重用性高、可擴充        |
| Route 控制                | 透過 `data.layout`           | 無需 if/else 路徑判斷 |
| 懶加載                     | `loadChildren`             | 啟動快速、bundle 小   |

---

✨ **延伸應用**

* 加入 `LayoutType` enum 管理所有 layout key。
* 用 directive (`*showIfApp`) 控制元件顯示邏輯。
* 未來支援多品牌或多主題切換。
