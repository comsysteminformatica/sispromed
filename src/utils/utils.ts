import { useEffect, useState } from "react";

export const ufs = [
  "AC",
  "AL",
  "AM",
  "AP",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PB",
  "PR",
  "PA",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "TO",
  "SE",
  "BA",
];

export function useDebounce(value: string, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function validarCPF(cpf: string) {
  const strCPF = String(cpf).replace(/\D/g, "");
  if (strCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(strCPF)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(strCPF[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(strCPF[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(strCPF[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(strCPF[10]);
}
