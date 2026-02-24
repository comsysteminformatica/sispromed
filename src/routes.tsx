import { createBrowserRouter } from "react-router";
import Login from "@/pages/Login";
import Agenda from "@/pages/Agenda";
import Dashboard from "@/pages/Dashboard";
import AuthLayout from "@/layouts/AuthLayout";
import AppLayout from "@/layouts/AppLayout";
import Vascular from "@/pages/Vascular";

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
      { path: "/vascular", element: <Vascular /> },
    ],
  },
]);
