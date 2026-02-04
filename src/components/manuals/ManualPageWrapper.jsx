"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AuthPrompt from "@/components/AuthPrompt";
import CronogramaInterativo from "@/components/CronogramaInterativo";
import ManualDetailView from "@/components/manuals/ManualDetailView";

export default function ManualPageWrapper({
  manual,
  detailedContent,
  manualId,
}) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar flash durante carregamento
  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  // Se não está autenticado, mostrar prompt
  if (!session) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <AuthPrompt message="Este manual contém conteúdo exclusivo para membros. Crie sua conta gratuita para acompanhar seu progresso e desbloquear todos os recursos!" />
      </div>
    );
  }

  // Usuário autenticado, mostrar conteúdo
  if (detailedContent) {
    return <CronogramaInterativo data={detailedContent} manualId={manualId} />;
  }

  return <ManualDetailView manual={manual} detailedContent={detailedContent} />;
}
