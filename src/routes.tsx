import { createBrowserRouter } from "react-router";
import Login from "@/pages/Login";
import Agenda from "@/pages/Agenda";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Vascular/Pacientes";
import Convenios from "./pages/Vascular/Convenios";
import Nefrologistas from "./pages/Vascular/Nefrologistas";
import TiposAcesso from "./pages/Vascular/TiposAcesso";
import Cateteres from "./pages/Vascular/Cateteres";
import Lesoes from "./pages/Vascular/Lesoes";
import Clinicas from "./pages/Vascular/Clinicas";
import Tratamentos from "./pages/Vascular/Tratamentos";
import Acompanhamentos from "./pages/Vascular/Acompanhamentos";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/agenda",
        element: <Agenda />,
      },
      { path: "/vascular/dashboard", element: <Dashboard /> },
      { path: "/vascular/acompanhamentos", element: <Acompanhamentos /> },
      { path: "/vascular/pacientes", element: <Pacientes /> },
      { path: "/vascular/convenios", element: <Convenios /> },
      { path: "/vascular/clinicas", element: <Clinicas /> },
      { path: "/vascular/nefrologistas", element: <Nefrologistas /> },
      { path: "/vascular/tipos-acesso", element: <TiposAcesso /> },
      { path: "/vascular/cateteres", element: <Cateteres /> },
      { path: "/vascular/lesoes", element: <Lesoes /> },
      {
        path: "/vascular/tratamentos",
        element: <Tratamentos />,
      },
    ],
  },
]);
