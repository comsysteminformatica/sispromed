import { createBrowserRouter } from "react-router";
import Login from "@/pages/login";
import Agenda from "@/pages/agenda";
import AuthLayout from "@/layouts/AuthLayout";
import Dashboard from "./pages/Vascular/dashboard";
import Pacientes from "./pages/Vascular/pacientes";
import Convenios from "./pages/Vascular/convenios";
import Nefrologistas from "./pages/Vascular/nefrologistas";
import TiposAcesso from "./pages/Vascular/tipos-acesso";
import Cateteres from "./pages/Vascular/cateteres";
import Lesoes from "./pages/Vascular/lesoes";
import Clinicas from "./pages/Vascular/clinicas";
import Tratamentos from "./pages/Vascular/tratamentos";
import Acompanhamentos from "./pages/Vascular/acompanhamentos";
import Usuarios from "./pages/usuarios";
import AppLayoutVascular from "@/layouts/AppLayoutVascular";

export const router = createBrowserRouter([
  { path: "*", element: <Login /> },
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <Login /> }],
  },
  {
    element: <AppLayoutVascular />,
    children: [
      { path: "/vascular/dashboard", element: <Dashboard /> },
      { path: "/vascular/acompanhamentos", element: <Acompanhamentos /> },
      { path: "/vascular/pacientes", element: <Pacientes /> },
      { path: "/vascular/convenios", element: <Convenios /> },
      { path: "/vascular/clinicas", element: <Clinicas /> },
      { path: "/vascular/nefrologistas", element: <Nefrologistas /> },
      { path: "/vascular/tipos-acesso", element: <TiposAcesso /> },
      { path: "/vascular/lesoes", element: <Lesoes /> },
      { path: "/vascular/tratamentos", element: <Tratamentos /> },
      { path: "/vascular/usuarios", element: <Usuarios /> },
    ],
  },
]);
