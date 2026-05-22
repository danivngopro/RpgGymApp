const tokenKey = 'gymrpg.authToken';

export type TokenStorage = {
  getToken: () => string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
};

export const localStorageTokenStorage: TokenStorage = {
  getToken: () => window.localStorage.getItem(tokenKey),
  setToken: (token) => window.localStorage.setItem(tokenKey, token),
  clearToken: () => window.localStorage.removeItem(tokenKey)
};
