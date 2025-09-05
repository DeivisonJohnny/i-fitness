"use client";

import { usePWAInstall } from "@/hooks/usePwa";
import Storage from "@/utils/Storage";
import { useEffect, useState } from "react";
import { GoShare } from "react-icons/go";

export const InstallButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { canInstall, handleInstallClick } = usePWAInstall();

  useEffect(() => {
    const show = Storage.get("show-install-pwa", true);
    const isiOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isiOSDevice);

    if (show) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible || !canInstall) return null;

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
            {isIOS
              ? "Instale o I Fitness no seu dispositivo iOS"
              : "Instale o I Fitness no seu dispositivo"}
          </h3>

          {isIOS ? (
            <ul className="text-gray-600 dark:text-gray-400 text-xs mt-1 list-disc list-inside">
              <li>
                1. Toque no ícone (<GoShare />) de compartilhamento
              </li>
              <li>
                2. Toque em Adicionar à tela inicial ou Add to home screen
              </li>
              <li>3. Toque em Adicionar</li>
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
              Toque em "Instalar" para adicionar o aplicativo à sua tela
              inicial.
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleNotShow}
            className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            Não mostrar
          </button>

          {!isIOS && (
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              Instalar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
