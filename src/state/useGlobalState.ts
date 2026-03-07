import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalState = {
  nome_usuario: string;
  setNomeUsuario: (nome: string) => void;
};

const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      nome_usuario: "",

      setNomeUsuario: (nome) =>
        set({
          nome_usuario: nome,
        }),
    }),
    {
      name: "global-storage",
    }
  )
);

export default useGlobalState;