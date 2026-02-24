import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./auth";
import type { Acompanhamento } from "@/components/Acompanhamentos/columns";

export const api = axios.create({
  baseURL: "http://localhost:8086",
  withCredentials: true,
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

    if (originalRequest.url === "/refresh") {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { data } = await api.post("/refresh");

      const newAccessToken = data.access_token;

      setAccessToken(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (err) {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);

export const efetuarLogin = async (email: string, senha: string) => {
  const { data } = await api.post("/login", {
    email,
    senha,
  });

  setAccessToken(data.access_token);
};

export const efetuarLoginGoogle = async (id_token: string) => {
  const { data } = await api.post("/login/google", {
    id_token,
  });

  setAccessToken(data.access_token);
};

export const efetuarLogout = async () => {
  await api.post("/logout");

  clearAccessToken();
  window.location.href = "/login";
};

export const consultarAcompanhamentos = async (): Promise<Acompanhamento[]> => {
  const { data } = await api.get("/acompanhamentos");
  return data;
};
