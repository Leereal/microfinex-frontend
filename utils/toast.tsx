import { Toast } from "primereact/toast";
import { useRef } from "react";

interface ToastProps {
  summary: string;
  detail: string;
}

export const useToast = () => {
  const toast = useRef<Toast | null>(null);

  const showSuccess = ({ summary, detail }: ToastProps) => {
    if (toast.current) {
      toast.current.show({
        severity: "success",
        summary: summary,
        detail: detail,
        life: 3000,
      });
    }
  };

  const showInfo = ({ summary, detail }: ToastProps) => {
    if (toast.current) {
      toast.current.show({
        severity: "info",
        summary: summary,
        detail: detail,
        life: 3000,
      });
    }
  };

  const showWarn = ({ summary, detail }: ToastProps) => {
    if (toast.current) {
      toast.current.show({
        severity: "warn",
        summary: summary,
        detail: detail,
        life: 3000,
      });
    }
  };

  const showError = ({ summary, detail }: ToastProps) => {
    if (toast.current) {
      toast.current.show({
        severity: "error",
        summary: summary,
        detail: detail,
        life: 3000,
      });
    }
  };

  return { showSuccess, showInfo, showWarn, showError };
};
