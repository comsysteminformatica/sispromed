import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, beforeEach } from "vitest";
import Login from "@/pages/Login";

beforeEach(() => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
});

describe("Verifica botão entrar", () => {
  it("Deve ficar desativado quando carregando", () => {
    const inputUsuario = screen.getByLabelText(/usuário/i);
    const inputSenha = screen.getByLabelText(/senha/i);
    const button = screen.getByRole("button", { name: /entrar/i });

    fireEvent.change(inputUsuario, { target: { value: "teste" } });
    fireEvent.change(inputSenha, { target: { value: "12345678" } });
    fireEvent.click(button);

    expect(button).toBeDisabled();
  });
});

describe("Verifica inputs", () => {
  it("Deve mostrar mensagem de erro no input Usuário por conter caracteres menor que o mínimo", async () => {
    const botao = screen.getByRole("button", {
      name: /entrar/i,
    });
    const input = screen.getByLabelText(/usuário/i);

    fireEvent.change(input, { target: { value: "11" } });
    fireEvent.click(botao);

    const mensagem = await screen.findByText(
      "O nome deve conter no mínimo 3 caracteres"
    );

    expect(mensagem).toBeInTheDocument();
  });

  it("Deve mostrar mensagem de erro no input Senha por conter caracteres menor que o mínimo", async () => {
    const botao = screen.getByRole("button", { name: /entrar/i });
    const input = screen.getByLabelText(/senha/i);

    fireEvent.change(input, { target: { value: "1111111" } });
    fireEvent.click(botao);

    const mensagem = await screen.findByText(
      "A senha deve conter no mínimo 8 caracteres"
    );

    expect(mensagem).toBeInTheDocument();
  });
});
