"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AuthPrompt from "./AuthPrompt";

export default function ProtectedContent({
  children,
  message,
  showPreview = false,
  previewContent = null,
}) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar flash de conteúdo durante carregamento
  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  // Se não está autenticado
  if (!session) {
    if (showPreview && previewContent) {
      return (
        <div className="min-h-screen">
          {previewContent}
          <div className="fixed inset-0 bg-linear-to-b from-transparent via-white/50 to-white pointer-events-none" />
          <div className="fixed bottom-0 left-0 right-0 p-4 pointer-events-auto">
            <AuthPrompt message={message} />
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <AuthPrompt message={message} />
      </div>
    );
  }

  // Usuário autenticado, mostrar conteúdo completo
  return children;
}
