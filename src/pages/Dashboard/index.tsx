import { Button } from "@/components/ui/button";
import { efetuarLogout } from "@/service/api";

export default function Dashboard() {
  const handleLogout = async () => {
    await efetuarLogout();
  };

  return (
    <>
      <Button onClick={handleLogout}>Sair</Button>
    </>
  );
}
