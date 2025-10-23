# Mocks 目錄

此目錄存放所有 Mock 資料，用於開發和測試環境。

## 檔案說明

### `auth.mock.data.ts`
認證相關的 Mock 資料，包含：
- 測試帳號密碼
- 模擬使用者資訊
- 模擬 Tokens
- Token 生成函數

## 使用方式

```typescript
import { MOCK_CREDENTIALS, MOCK_USER } from 'src/mocks';

// 使用預設測試帳號
console.log(MOCK_CREDENTIALS.username); // 'admin'
console.log(MOCK_CREDENTIALS.password); // 'admin123'
```

## 測試帳號

**預設測試帳號：**
- Username: `admin`
- Password: `admin123`

## 注意事項

⚠️ 此目錄的資料僅供開發和測試使用，**不應包含在正式環境的 build 中**。