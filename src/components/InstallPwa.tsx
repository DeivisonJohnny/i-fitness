// components/InstallButton.tsx

import { usePWAInstall } from "@/hooks/usePwa";
import React from "react";

export const InstallButton = () => {
  const { canInstall, handleInstallClick } = usePWAInstall();

  // O botão só será renderizado se a instalação for possível
  if (!canInstall) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#0070f3",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "10px",
      }}
    >
      Instalar App
    </button>
  );
};
