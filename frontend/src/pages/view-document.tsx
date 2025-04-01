// frontend/src/pages/view-document.tsx - Update this file

import DashboardLayout from '@/components/layout/dashboard/dashboard-layout';
import { LoginEmailOTP } from '@/types/general-type';
import { useParams } from 'react-router-dom';
import TradeTrustDocumentViewer from '@/components/dashboard/TradeTrustDocumentViewer';

export default function ViewDocument({ token, setToken }: LoginEmailOTP) {
  const { id } = useParams();
  
  return (
    <DashboardLayout>
      <div className="mt-5 h-full w-full">
        <TradeTrustDocumentViewer documentId={id} />
      </div>
    </DashboardLayout>
  );
}