import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "./auth";

export const api = axios.create({
  baseURL: "http://10.1.1.190:8080/",
});

api.interceptors.request.use((config: any) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refresh_token = getRefreshToken();

      if (!refresh_token) {
        throw new Error("Sem refresh token");
      }

      const { data } = await axios.post("http://localhost:9000/refresh", {
        refresh_token,
      });

      setTokens(data);

      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

      return api(originalRequest);
    } catch (err) {
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);

export const efetuarLogin = async (usuario: string, senha: string) => {
  const { data } = await api.post("login", {
    usuario,
    senha,
  });
  setTokens(data);
};

export const efetuarTeste = async () => {
  const { data } = await api.get("teste");
  return data;
};
