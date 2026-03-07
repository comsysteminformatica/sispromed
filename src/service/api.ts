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
import type { FormFieldsConvenio } from "@/components/Modals/convenio";
import type { FormFieldsClinica } from "@/components/Modals/clinica";
import type { FormFieldsTipoAcesso } from "@/components/Modals/tipo-acesso";
import type { FormFieldsLesao } from "@/components/Modals/lesao";
import type { FormFieldsTratamento } from "@/components/Modals/tratamento";
import type { DashboardVascular } from "@/types/dashboardVascular";

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

export const efetuarLogin = async (
  email: string,
  senha: string
): Promise<string> => {
  const { data } = await api.post("/login", {
    email,
    senha,
  });

  setAccessToken(data.access_token);
  return data.nome;
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

export const consultarAcompanhamentos = async (
  q = "",
  category = ""
): Promise<object> => {
  const { data } = await api.get(`/acompanhamentos`, {
    params: { q, category },
  });
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
  q = "",
  category = ""
): Promise<Paciente[]> => {
  const { data } = await api.get(`/pacientes`, {
    params: { q, category },
  });
  return data;
};

export const consultarPaciente = async (id: number): Promise<Paciente> => {
  const { data } = await api.get(`/pacientes/${id}`);
  return data;
};

export const consultarClinicas = async (
  q = "",
  category = ""
): Promise<Clinica[]> => {
  const { data } = await api.get(`/clinicas`, {
    params: { q, category },
  });
  return data;
};
export const consultarClinica = async (id: number): Promise<Clinica> => {
  const { data } = await api.get(`/clinicas/${id}`);
  return data;
};

export const criarClinica = async (
  body: FormFieldsClinica
): Promise<object> => {
  const { data } = await api.post("/clinicas", body);
  return data;
};

export const editarClinica = async (
  id: number,
  body: FormFieldsClinica
): Promise<object> => {
  const { data } = await api.put(`/clinicas/${id}`, body);
  return data;
};

export const consultarConvenios = async (
  q = "",
  category = ""
): Promise<Convenio[]> => {
  const { data } = await api.get(`/convenios`, {
    params: { q, category },
  });
  return data;
};

export const consultarConvenio = async (id: number): Promise<Convenio> => {
  const { data } = await api.get(`/convenios/${id}`);
  return data;
};

export const criarConvenio = async (
  body: FormFieldsConvenio
): Promise<object> => {
  const { data } = await api.post("/convenios", body);
  return data;
};

export const editarConvenio = async (
  id: number,
  body: FormFieldsConvenio
): Promise<object> => {
  const { data } = await api.put(`/convenios/${id}`, body);
  return data;
};

export const consultarMedicos = async (
  especialidade: number,
  q: string,
  category: string
): Promise<Medico[]> => {
  const { data } = await api.get("/medicos", {
    params: { especialidade, q, category },
  });
  return data;
};

export const consultarMedico = async (id: number): Promise<Medico> => {
  const { data } = await api.get(`/medicos/${id}`);
  return data;
};

export const criarMedico = async (body: object): Promise<object> => {
  const { data } = await api.post("/medicos", body);
  return data;
};

export const editarMedico = async (
  id: number,
  body: object
): Promise<object> => {
  const { data } = await api.put(`/medicos/${id}`, body);
  return data;
};

export const consultarTiposAcessos = async (
  q = "",
  category = ""
): Promise<TipoAcesso[]> => {
  const { data } = await api.get("/tipos-acessos", {
    params: { q, category },
  });
  return data;
};

export const consultarTipoAcesso = async (id: number): Promise<TipoAcesso> => {
  const { data } = await api.get(`/tipos-acessos/${id}`);
  return data;
};

export const criarTipoAcesso = async (
  body: FormFieldsTipoAcesso
): Promise<object> => {
  const { data } = await api.post("/tipos-acessos", body);
  return data;
};

export const editarTipoAcesso = async (
  id: number,
  body: FormFieldsTipoAcesso
): Promise<object> => {
  const { data } = await api.put(`/tipos-acessos/${id}`, body);
  return data;
};

export const consultarLesoes = async (
  q = "",
  category = ""
): Promise<Lesao[]> => {
  const { data } = await api.get(`/lesoes`, {
    params: { q, category },
  });
  return data;
};

export const consultarLesao = async (id: number): Promise<Lesao> => {
  const { data } = await api.get(`/lesoes/${id}`);
  return data;
};

export const criarLesao = async (body: FormFieldsLesao): Promise<object> => {
  const { data } = await api.post("/lesoes", body);
  return data;
};

export const editarLesao = async (
  id: number,
  body: FormFieldsLesao
): Promise<object> => {
  const { data } = await api.put(`/lesoes/${id}`, body);
  return data;
};

export const consultarTratamentos = async (
  q = "",
  category = ""
): Promise<Tratamento[]> => {
  const { data } = await api.get(`/tratamentos`, {
    params: { q, category },
  });
  return data;
};

export const consultarTratamento = async (id: number): Promise<Tratamento> => {
  const { data } = await api.get(`/tratamentos/${id}`);
  return data;
};

export const criarTratamento = async (
  body: FormFieldsTratamento
): Promise<object> => {
  const { data } = await api.post("/tratamentos", body);
  return data;
};

export const editarTratamento = async (
  id: number,
  body: FormFieldsTratamento
): Promise<object> => {
  const { data } = await api.put(`/tratamentos/${id}`, body);
  return data;
};

export const consultarCateteres = async (
  q = "",
  category = ""
): Promise<Cateter[]> => {
  const { data } = await api.get(`/cateteres`, {
    params: { q, category },
  });
  return data;
};

export const consultarDashboardVascular =
  async (): Promise<DashboardVascular> => {
    const { data } = await api.get("vascular/dashboard");
    return data;
  };
