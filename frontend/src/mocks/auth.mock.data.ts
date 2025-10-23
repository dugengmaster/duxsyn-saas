/**
 * Mock 認證資料
 * 用於開發和測試環境
 */

export const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const MOCK_USER = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User'
};

export const MOCK_TOKENS = {
  access: 'mock-access-token-' + Date.now(),
  refresh: 'mock-refresh-token-' + Date.now()
};

/**
 * 生成新的 Mock Tokens
 * 用於刷新 token 時返回不同的值
 */
export function generateMockTokens() {
  return {
    access: 'mock-access-token-' + Date.now(),
    refresh: 'mock-refresh-token-' + Date.now()
  };
}

/**
 * 生成刷新後的 Access Token
 */
export function generateRefreshToken() {
  return {
    access: 'mock-refreshed-token-' + Date.now()
  };
}