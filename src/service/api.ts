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
import type { FormFieldsPaciente } from "@/components/Modals/paciente";
import type { FormFieldsConvenio } from "@/components/Modals/convenio";
import type { FormFieldsClinica } from "@/components/Modals/clinica";
import type { FormFieldsTipoAcesso } from "@/components/Modals/tipo-acesso";
import type { FormFieldsLesao } from "@/components/Modals/lesao";
import type { FormFieldsTratamento } from "@/components/Modals/tratamento";
import type { DashboardVascular } from "@/types/dashboardVascular";
import type { FormFieldsLesaoAcompanhamento } from "@/components/Modals/lesao-acompanhamento";
import type { FormFieldsTratamentoAcompanhamento } from "@/components/Modals/tratamento-acompanhamento";
import type { FormFieldsPrazoDoppler } from "@/components/Modals/prazo-doppler";
import type { FormFieldsUsuario } from "@/components/Modals/usuario";
import type { Usuario } from "@/types/usuario";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_DEVELOPMENT === "TRUE"
      ? `http://${import.meta.env.VITE_IP_DEVELOPMENT}:8086`
      : `https://${import.meta.env.VITE_IP_PRODUCTION}:8086`,
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
): Promise<any> => {
  const { data } = await api.post("/login", {
    email,
    senha,
  });

  setAccessToken(data.access_token);

  return data;
};

export const efetuarLoginGoogle = async (id_token: string) => {
  const { data } = await api.post("/login/google", {
    id_token,
  });

  setAccessToken(data.access_token);
  return data;
};

export const efetuarLogout = async () => {
  await api.post("/logout");

  clearAccessToken();
  window.location.href = "/login";
};

export const consultarAcompanhamentos = async (
  tipo = "",
  category = "",
  q = ""
): Promise<any> => {
  const { data } = await api.get(`/acompanhamentos`, {
    params: { tipo, category, q },
  });
  return data;
};

export const consultarAcompanhamento = async (
  id: number
): Promise<any> => {
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
  id: number | null | undefined,
  body: FormFieldsAcompanhamento
): Promise<object> => {
  const { data } = await api.put(`/acompanhamentos/${id}`, body);
  return data;
};

export const excluirAcompanhamento = async (id: number): Promise<any> => {
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
  id: number | undefined,
  body: FormFieldsPaciente
): Promise<object> => {
  const { data } = await api.put(`/pacientes/${id}`, body);
  return data;
};

export const consultarPacientes = async (
  tipo = "",
  category = "",
  q = ""
): Promise<Paciente[]> => {
  const { data } = await api.get(`/pacientes`, {
    params: { tipo, category, q },
  });
  return data;
};

export const consultarPaciente = async (id: number): Promise<Paciente> => {
  const { data } = await api.get(`/pacientes/${id}`);
  return data;
};

export const consultarClinicas = async (
  tipo = "",
  category = "",
  q = ""
): Promise<Clinica[]> => {
  const { data } = await api.get(`/clinicas`, {
    params: { tipo, category, q },
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
  id: number | undefined,
  body: FormFieldsClinica
): Promise<object> => {
  const { data } = await api.put(`/clinicas/${id}`, body);
  return data;
};

export const consultarConvenios = async (
  tipo = "",
  category = "",
  q = ""
): Promise<Convenio[]> => {
  const { data } = await api.get(`/convenios`, {
    params: { tipo, category, q },
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
  id: number | undefined,
  body: FormFieldsConvenio
): Promise<any> => {
  const { data } = await api.put(`/convenios/${id}`, body);
  return data;
};

export const consultarMedicos = async (
  especialidade: number,
  tipo = "",
  category = "",
  q = ""
): Promise<Medico[]> => {
  const { data } = await api.get("/medicos", {
    params: { especialidade, tipo, category, q },
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
  id: number | undefined,
  body: object
): Promise<object> => {
  const { data } = await api.put(`/medicos/${id}`, body);
  return data;
};

export const consultarTiposAcessos = async (
  tipo = "",
  category = "",
  q = ""
): Promise<TipoAcesso[]> => {
  const { data } = await api.get("/tipos-acessos", {
    params: { tipo, category, q },
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
  id: number | undefined,
  body: FormFieldsTipoAcesso
): Promise<object> => {
  const { data } = await api.put(`/tipos-acessos/${id}`, body);
  return data;
};

export const consultarLesoes = async (
  tipo = "",
  category = "",
  q = ""
): Promise<Lesao[]> => {
  const { data } = await api.get(`/lesoes`, {
    params: { tipo, category, q },
  });
  return data;
};

export const consultarLesao = async (id: number): Promise<Lesao> => {
  const { data } = await api.get(`/lesoes/${id}`);
  return data;
};

export const consultarLesoesAcompanhamento = async (
  id: number
): Promise<any> => {
  const { data } = await api.get(`/lesoes/acompanhamento/${id}`);
  return data;
};

export const consultarLesaoAcompanhamento = async (
  id: number
): Promise<any> => {
  const { data } = await api.get(`/lesao/acompanhamento/${id}`);
  return data;
};

export const criarLesao = async (body: FormFieldsLesao): Promise<object> => {
  const { data } = await api.post("/lesoes", body);
  return data;
};

export const criarLesaoAcompanhamento = async (
  id: number,
  body: FormFieldsLesaoAcompanhamento
): Promise<object> => {
  const { data } = await api.post(`/lesoes/acompanhamento/${id}`, body);
  return data;
};

export const editarLesao = async (
  id: number | undefined,
  body: FormFieldsLesao
): Promise<object> => {
  const { data } = await api.put(`/lesoes/${id}`, body);
  return data;
};

export const editarLesaoAcompanhamento = async (
  id: number | undefined,
  body: FormFieldsLesaoAcompanhamento
): Promise<object> => {
  const { data } = await api.put(`/lesoes/acompanhamento/${id}`, body);
  return data;
};

export const excluirLesaoAcompanhamento = async (
  id: number
): Promise<any> => {
  const { data } = await api.delete(`/lesoes/acompanhamento/${id}`);
  return data;
};

export const consultarTratamentos = async (
  tipo = "",
  q = "",
  category = ""
): Promise<Tratamento[]> => {
  const { data } = await api.get(`/tratamentos`, {
    params: { tipo, q, category },
  });
  return data;
};

export const consultarTratamentosAcompanhamento = async (
  id: number
): Promise<any> => {
  const { data } = await api.get(`/tratamentos/acompanhamento/${id}`);
  return data;
};

export const consultarTratamento = async (id: number): Promise<Tratamento> => {
  const { data } = await api.get(`/tratamentos/${id}`);
  return data;
};

export const consultarTratamentoAcompanhamento = async (
  id: number
): Promise<any> => {
  const { data } = await api.get(`/tratamento/acompanhamento/${id}`);
  return data;
};

export const criarTratamento = async (
  body: FormFieldsTratamento
): Promise<object> => {
  const { data } = await api.post("/tratamentos", body);
  return data;
};

export const criarTratamentoAcompanhamento = async (
  id: number,
  body: FormFieldsTratamentoAcompanhamento
): Promise<object> => {
  const { data } = await api.post(`/tratamentos/acompanhamento/${id}`, body);
  return data;
};

export const editarTratamento = async (
  id: number | undefined,
  body: FormFieldsTratamento
): Promise<object> => {
  const { data } = await api.put(`/tratamentos/${id}`, body);
  return data;
};

export const editarTratamentoAcompanhamento = async (
  id: number | undefined,
  body: FormFieldsTratamentoAcompanhamento
): Promise<object> => {
  const { data } = await api.put(`/tratamentos/acompanhamento/${id}`, body);
  return data;
};

export const excluirTratamentoAcompanhamento = async (
  id: number
): Promise<any> => {
  const { data } = await api.delete(`/tratamentos/acompanhamento/${id}`);
  return data;
};

export const consultarCateteres = async (
  tipo = "",
  category = "",
  q = ""
): Promise<Cateter[]> => {
  const { data } = await api.get(`/cateteres`, {
    params: { tipo, category, q },
  });
  return data;
};

export const consultarDashboardVascular =
  async (): Promise<DashboardVascular> => {
    const { data } = await api.get("/vascular/dashboard");
    return data;
  };

export const consultarPrazoDoppler = async (): Promise<any> => {
  const { data } = await api.get("/empresa/prazo-doppler");
  return data;
};

export const editarPrazoDoppler = async (
  body: FormFieldsPrazoDoppler
): Promise<any> => {
  const { data } = await api.put("/empresa/prazo-doppler", body);
  return data;
};

export const consultarUsuarios = async (): Promise<any[]> => {
  const { data } = await api.get("/usuarios");
  return data;
};

export const consultarUsuario = async (id: number): Promise<Usuario> => {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
};

export const criarUsuario = async (
  body: FormFieldsUsuario
): Promise<any> => {
  const { data } = await api.post(`/usuarios`, body);
  return data;
};

export const editarUsuario = async (
  id: number | undefined,
  body: FormFieldsUsuario
): Promise<any> => {
  const { data } = await api.put(`/usuarios/${id}`, body);
  return data;
};

export const consultarEmpresas = async (): Promise<any> => {
  const { data } = await api.get(`/empresas`);
  return data;
};

export const escolherEmpresa = async (id: number): Promise<any> => {
  const { data } = await api.post("/empresa/escolher", {
    id,
  });

  setAccessToken(data.access_token);
  return data;
};
