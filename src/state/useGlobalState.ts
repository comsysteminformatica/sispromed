import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalState = {
  nomeUsuario: string;
  setNomeUsuario: (nome: string) => void;
  perfilUsuario: number;
  setPerfilUsuario: (perfil: number) => void;
  empresaUsuario: string;
  setEmpresaUsuario: (usuario: string) => void;
  resetState: () => void;
};

const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      nomeUsuario: "",
      perfilUsuario: 2,
      empresaUsuario: "",

      setNomeUsuario: (nome) => set({ nomeUsuario: nome }),
      setPerfilUsuario: (perfil) => set({ perfilUsuario: perfil }),
      setEmpresaUsuario: (empresa) => set({ empresaUsuario: empresa }),

      resetState: () => {
        set(useGlobalState.getInitialState());
        localStorage.removeItem("global-storage");
      },
    }),
    {
      name: "global-storage",
    }
  )
);

export default useGlobalState;
