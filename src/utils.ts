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

export function formatarCPF(value: string) {
  const digits = (value ?? "").replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  return value;
}
