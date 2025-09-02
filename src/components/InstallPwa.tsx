"use client";

import { usePWAInstall } from "@/hooks/usePwa";
import Storage from "@/utils/Storage";
import { useEffect, useState } from "react";

export const InstallButton = () => {
  const [isVisible, setIsVisible] = useState(true);

  const { canInstall, handleInstallClick } = usePWAInstall();

  useEffect(() => {
    const show = Storage.get("show-install-pwa", true);
    setIsVisible(show);
  }, []);

  if (!isVisible || !canInstall) {
    return null;
  }

  function handleNotShow() {
    setIsVisible(false);
    Storage.set("show-install-pwa", false);
  }

  function handleInstall() {
    handleInstallClick();

    handleNotShow();
  }

  return (
    <div className="fixed top-2 right-2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-background/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg shadow-black/10 dark:shadow-black/20 p-6 max-w-sm">
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
            Instalar aplicativo
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
            Acesse rapidamente sem abrir o navegador.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleNotShow}
            className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            Não mostrar
          </button>

          <button
            onClick={handleInstall}
            className="flex-1 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors cursor-pointer "
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
};
