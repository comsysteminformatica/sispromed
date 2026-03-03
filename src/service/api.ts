import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./auth";
import type { Convenio } from "@/types/convenio";
import type { Paciente } from "@/types/paciente";
import type { Clinica } from "@/types/clinica";
import type { Medico } from "@/types/medico";
import type { FormFieldsAcompanhamento } from "@/components/Modals/acompanhamento";
import type { TipoAcesso } from "@/types/tipoAcesso";
import type { Lesao } from "@/types/lesao";
import type { Tratamento } from "@/types/tratamento";
import type { Cateter } from "@/types/cateter";
import type { Acompanhamento } from "@/types/acompanhamento";
import type { FormFieldsPaciente } from "@/components/Modals/paciente";

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

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
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
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = api
          .post("/refresh")
          .then(({ data }) => {
            const newAccessToken = data.access_token;
            setAccessToken(newAccessToken);
            return newAccessToken;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      const newAccessToken = await refreshPromise;

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

export const consultarAcompanhamento = async (
  id: number
): Promise<Acompanhamento> => {
  const { data } = await api.get(`/acompanhamentos/${id}`);
  return data;
};

export const criarAcompanhamento = async (
  body: FormFieldsAcompanhamento
): Promise<object> => {
  const { data } = await api.post("/acompanhamentos", body);
  return data;
};

export const editarAcompanhamento = async (
  id: number,
  body: FormFieldsAcompanhamento
): Promise<object> => {
  const { data } = await api.put(`/acompanhamentos/${id}`, body);
  return data;
};

export const excluirAcompanhamento = async (id: number): Promise<object> => {
  const { data } = await api.delete(`/acompanhamentos/${id}`);
  return data;
};

export const criarPaciente = async (
  body: FormFieldsPaciente
): Promise<object> => {
  const { data } = await api.post("/pacientes", body);
  return data;
};

export const editarPaciente = async (
  id,
  body: FormFieldsPaciente
): Promise<object> => {
  const { data } = await api.put(`/pacientes/${id}`, body);
  return data;
};

export const consultarPacientes = async (
  search: string = ""
): Promise<Paciente[]> => {
  const { data } = await api.get("/pacientes", {
    params: { search },
  });
  return data;
};

export const consultarPaciente = async (id: number): Promise<Paciente> => {
  const { data } = await api.get(`/pacientes/${id}`);
  return data;
};

export const consultarClinicas = async (
  search: string = ""
): Promise<Clinica[]> => {
  const { data } = await api.get("/clinicas", {
    params: { search },
  });
  return data;
};

export const consultarConvenios = async (
  search: string = ""
): Promise<Convenio[]> => {
  const { data } = await api.get("/convenios", {
    params: { search },
  });
  return data;
};

export const consultarMedicos = async (
  especialidade: number,
  search: string = ""
): Promise<Medico[]> => {
  const { data } = await api.get("/medicos", {
    params: { especialidade, search },
  });
  return data;
};

export const consultarTiposAcessos = async (
  search: string = ""
): Promise<TipoAcesso[]> => {
  const { data } = await api.get("/tipos-acessos", {
    params: { search },
  });
  return data;
};

export const consultarLesoes = async (
  search: string = ""
): Promise<Lesao[]> => {
  const { data } = await api.get("/lesoes", {
    params: { search },
  });
  return data;
};

export const consultarTratamentos = async (
  search: string = ""
): Promise<Tratamento[]> => {
  const { data } = await api.get("/tratamentos", {
    params: { search },
  });
  return data;
};

export const consultarCateteres = async (
  search: string = ""
): Promise<Cateter[]> => {
  const { data } = await api.get("/cateteres", {
    params: { search },
  });
  return data;
};
