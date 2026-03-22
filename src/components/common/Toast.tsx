import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
});

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: ToastContextValue = {
    success: (msg) => add("success", msg),
    error: (msg) => add("error", msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => remove(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bg = toast.type === "success" ? "bg-green-900/80 border-green-700" : "bg-red-900/80 border-red-700";
  const text = toast.type === "success" ? "text-green-300" : "text-red-300";

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur ${bg} ${text} min-w-[250px] max-w-sm animate-[slideIn_0.2s_ease-out]`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{toast.message}</span>
        <button onClick={onDismiss} className="opacity-60 hover:opacity-100">
          x
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
