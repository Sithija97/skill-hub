import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const AUTH_SKIP_URLS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

const flushQueue = (token: string) => {
  queue.forEach((cb) => cb(token));
  queue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3002/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    const is401 = error.response?.status === 401;
    const alreadyRetried = originalRequest._retry === true;
    const isSkippedUrl = AUTH_SKIP_URLS.some((url) =>
      originalRequest.url?.includes(url),
    );
    const hasToken = Boolean(useAuthStore.getState().accessToken);

    if (is401 && !alreadyRetried && !isSkippedUrl && hasToken) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post<{ accessToken: string }>(
          `${import.meta.env.VITE_API_URL ?? "http://localhost:3002/api"}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        useAuthStore.getState().setAccessToken(data.accessToken);
        flushQueue(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
