import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleAlert, CircleX, Trash2, Info } from "lucide-react";

export default function Alerta({
  isOpen,
  setIsOpen,
  type = "info",
  titulo = "Aviso",
  descricao = "",
  cancelar = "Cancelar",
  continuar = "Confirmar",
  onCancel = () => {},
  onConfirm = () => {},
}: any) {
  const getIcone = (): any => {
    switch (type) {
      case "error":
        return {
          icon: <CircleX className="text-red-400" width={32} height={32} />,
          bg: "bg-red-50",
          confirmVariant: "destructive",
        };
      case "delete":
        return {
          icon: <Trash2 className="text-red-400" width={32} height={32} />,
          bg: "bg-red-50",
          confirmVariant: "destructive",
        };
      case "warning":
        return {
          icon: (
            <CircleAlert className="text-yellow-400" width={32} height={32} />
          ),
          bg: "bg-yellow-50",
          confirmVariant: "warning",
        };
      default:
        return {
          icon: <Info className="text-blue-400" width={32} height={32} />,
          bg: "bg-blue-50",
          confirmVariant: "default",
        };
    }
  };

  const { icon, bg, confirmVariant } = getIcone();

  const handleCancel = () => {
    onCancel?.();
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div
              className={`${bg} w-14 h-14 rounded-2xl flex justify-center items-center`}
            >
              {icon}
            </div>
          </div>
          <DialogTitle className="text-center">{titulo}</DialogTitle>
          <DialogDescription className="text-center break-all">
            {descricao}
          </DialogDescription>
        </DialogHeader>

        <div
          className={`flex ${type === "error" || type === "delete" ? "justify-center" : "justify-between"} mt-4`}
        >
          {type !== "error" && type !== "delete" && (
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-32 h-8 text-sm"
            >
              {cancelar}
            </Button>
          )}
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            className={`h-8 text-sm ${type === "error" || type === "delete" ? "w-full" : "w-32"}`}
          >
            {continuar}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
