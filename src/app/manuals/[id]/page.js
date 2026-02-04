import { notFound } from 'next/navigation';
import { getManualById, getManualDetails } from '@/data/database';
import ManualPageWrapper from '@/components/manuals/ManualPageWrapper';

export default async function ManualPage({ params }) {
  // Await params antes de acessar suas propriedades (Next.js 15+)
  const { id } = await params;

  const manual = getManualById(id);

  if (!manual) {
    notFound();
  }

  // Carregar dados detalhados se disponíveis
  let detailedContent = null;
  if (manual.hasDetails) {
    detailedContent = getManualDetails(id);
  }

  return <ManualPageWrapper manual={manual} detailedContent={detailedContent} manualId={id} />;
}
