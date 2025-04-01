import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard/dashboard-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginEmailOTP } from '@/types/general-type';
import { UploadFile } from '@/components/dashboard/upload-file';
import { SelectForm } from '@/components/ui/select-form';
import { ImageDrageAndDrop } from '@/assets';
import TradeTrustDocumentHandler from '@/components/dashboard/TradeTrustDocumentHandler';

const text = 'Drag & drop or click your TradeTrust file to view its contents';
const formatFiles = '.tt';

export default function VerifyDocument({ token, setToken }: LoginEmailOTP) {
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [alertView, setAlertView] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const handleSelectExchange = (value: string) => {
    setSelectedExchange(value);
    setAlertView(false);
  };

  return (
    <DashboardLayout>
      <div className="mt-5 flex h-full w-full flex-col justify-start">
        <h1>Verify Document</h1>
        <p className="md:text-base">
          Upload or drag and drop your document below to verify it.
        </p>

        <div className="mt-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upload">Upload Document</TabsTrigger>
              <TabsTrigger value="tradetrust">TradeTrust Document</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <div className="mt-5 mb-5 flex items-center gap-3">
                <p>Verify your document on</p>
                <SelectForm onSelect={handleSelectExchange} error={alertView} />
              </div>
              <div className="lg flex flex-col-reverse justify-center gap-10 lg:flex-row lg:justify-between">
                <UploadFile
                  mode="Verifiable"
                  desc={text}
                  formatFile={formatFiles}
                  selectedExchange={selectedExchange}
                  alertView={alertView}
                  setAlertView={setAlertView}
                />

                <div className="h-full w-auto basis-[50%]">
                  <img
                    src={ImageDrageAndDrop}
                    className="h-full w-fit object-cover object-center"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tradetrust">
              <TradeTrustDocumentHandler />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}