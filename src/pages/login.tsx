import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import clinica from "@/assets/images/clinica.svg";
import { useNavigate } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";

import useGlobalState from "@/state/useGlobalState";

import logo from "@/assets/images/logo4.png";

import {
  efetuarLogin,
  efetuarLoginGoogle,
  efetuarLogout,
} from "@/service/api.ts";
import { toast } from "sonner";

const schema = z.object({
  email: z.email("Email inválido"),
  senha: z.string().min(8, "A senha deve conter no mínimo 8 caracteres"),
});

type FormFields = z.infer<typeof schema>;

export default function Login() {
  const resetState = useGlobalState((state) => state.resetState);
  const setNome = useGlobalState((state) => state.setNomeUsuario);
  const setPerfil = useGlobalState((state) => state.setPerfilUsuario);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const [isMostrarSenha, setIsMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const { email, senha } = data;
      const response = await efetuarLogin(email, senha);
      setNome(response.nome);
      setPerfil(response.perfil);
      navigate("/vascular/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          message: error.response?.data?.message ?? "Erro ao fazer login",
        });
      }
    }
  };

  async function logout() {
    resetState();
    await efetuarLogout();
  }

  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      <main className="grid md:grid-cols-2 container mx-auto h-screen">
        <section className="hidden md:flex flex-col justify-center items-center">
          <img src={clinica} alt="clinica" />
        </section>
        <section className="flex flex-col justify-center items-center">
          <img src={logo} alt="Sispromed" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full max-w-lg p-4"
          >
            <section className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} id="email" type="email" />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="senha">Senha</Label>
                <div className="flex gap-2 relative">
                  <Input
                    {...register("senha")}
                    id="senha"
                    type={isMostrarSenha ? "text" : "password"}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setIsMostrarSenha(!isMostrarSenha)}
                    className="absolute end-0 text-zinc-400"
                  >
                    {isMostrarSenha ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>
                {errors.senha && (
                  <p className="text-red-500 text-sm">{errors.senha.message}</p>
                )}
              </div>
            </section>
            <section>
              <Button
                size="lg"
                className="w-full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Carregando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </section>
            {errors.root && (
              <p className="text-red-500 text-sm">{errors.root.message}</p>
            )}
            <section className="flex items-center gap-4">
              <hr className="w-full border-zinc-300" />
              <span className="text-sm text-zinc-400">OU</span>
              <hr className="w-full border-zinc-300" />
            </section>
            <section>
              <GoogleLogin
                onSuccess={async (credentialResponse: any) => {
                  try {
                    const response = await efetuarLoginGoogle(
                      credentialResponse.credential
                    );
                    setNome(response.nome);
                    setPerfil(response.perfil);
                    navigate("/vascular/dashboard");
                  } catch (error) {
                    if (error instanceof AxiosError) {
                      setError("root", {
                        message:
                          error.response?.data?.message ??
                          "Erro ao fazer login",
                      });
                    }
                  }
                }}
                
                onError={(error) => {
                  toast.error("Erro ao realizar login");
                }}
              />
            </section>
          </form>
        </section>
      </main>
    </>
  );
}
