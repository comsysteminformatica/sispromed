import logoIcone from "@/assets/images/logo-icone.png";

export default function Cabecalho() {
  return (
    <>
      <header className="items-center grid grid-cols-3 h-15 px-2 bg-secondary">
        <img className="w-10" src={logoIcone} alt="logo" />
        <h1 className="text-white text-center">SISPROMED - Acompanhamento</h1>
      </header>
    </>
  );
}
