'use client';

import ProtectedContent from '@/components/ProtectedContent';
import CronogramaInterativo from '@/components/CronogramaInterativo';
import ManualDetailView from '@/components/manuals/ManualDetailView';

export default function ManualPageWrapper({ manual, detailedContent, manualId }) {
  // Se tem conteúdo detalhado, usar CronogramaInterativo
  if (detailedContent) {
    return (
      <ProtectedContent
        message="Este manual contém conteúdo interativo exclusivo para membros. Crie sua conta gratuita para acompanhar seu progresso e desbloquear todos os recursos!"
        showPreview={true}
        previewContent={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {detailedContent.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-800 mb-2">
                  {detailedContent.subtitle}
                </p>
                <p className="text-sm md:text-base text-gray-700 max-w-3xl mx-auto">
                  {detailedContent.description}
                </p>
              </div>
            </div>
          </div>
        }
      >
        <CronogramaInterativo data={detailedContent} manualId={manualId} />
      </ProtectedContent>
    );
  }

  // Caso contrário, usar a visualização padrão
  return (
    <ProtectedContent
      message="Este manual contém conteúdo exclusivo para membros. Crie sua conta gratuita para acessar!"
      showPreview={false}
    >
      <ManualDetailView manual={manual} detailedContent={detailedContent} />
    </ProtectedContent>
  );
}
