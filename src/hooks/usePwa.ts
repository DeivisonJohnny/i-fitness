// hooks/usePWAInstall.ts

import { useState, useEffect } from "react";

// Tipagem para o evento BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  // Estado para armazenar o evento que aciona o prompt
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  // Estado para verificar se o PWA já foi instalado (ou se o banner foi dispensado)
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Previne que o mini-infobar padrão do Chrome apareça
      event.preventDefault();

      // Armazena o evento para que possa ser acionado mais tarde.
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    // Ouve o evento que indica que o PWA pode ser instalado
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Ouve o evento que indica que a instalação foi concluída
    window.addEventListener("appinstalled", () => {
      // Limpa o prompt e marca como instalado
      setInstallPrompt(null);
      setIsInstalled(true);
    });

    // Função de limpeza para remover os event listeners
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", () => {
        setInstallPrompt(null);
        setIsInstalled(true);
      });
    };
  }, []);

  const handleInstallClick = async () => {
    // Se não houver prompt, não faz nada
    if (!installPrompt) {
      return;
    }

    // Mostra o prompt de instalação
    await installPrompt.prompt();

    // Espera o usuário responder ao prompt
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("Usuário aceitou a instalação do PWA");
      setIsInstalled(true);
    } else {
      console.log("Usuário recusou a instalação do PWA");
    }

    // O prompt só pode ser usado uma vez, então limpamos o estado
    setInstallPrompt(null);
  };

  return {
    canInstall: installPrompt !== null && !isInstalled,
    handleInstallClick,
  };
};
