import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Loading from '@/components/ui/loading';

const getFormSchema = (documentType: string) => {
  if (documentType === 'bill-of-lading') {
    return z.object({
      owner: z.string().optional(),
      holder: z.string().optional(),
      blNumber: z.string().min(1, { message: 'BL Number is required' }),
      scac: z.string().min(1, { message: 'SCAC is required' }),
      carrierSignatory: z.string().optional(),
      
      shipperName: z.string().min(1, { message: 'Shipper name is required' }),
      shipperStreet: z.string().optional(),
      shipperCountry: z.string().optional(),
      onwardInlandRouting: z.string().optional(),
      
      consigneeTo: z.string().optional(),
      consigneeName: z.string().optional(),
      
      notifyPartyName: z.string().optional(),
      vessel: z.string().optional(),
      voyageNo: z.string().optional(),
      portOfLoading: z.string().optional(),
      portOfDischarge: z.string().optional(),
      placeOfReceipt: z.string().optional(),
      placeOfDelivery: z.string().optional(),
      
      packages: z.array(
        z.object({
          description: z.string().optional(),
          weight: z.string().optional(),
          measurement: z.string().optional(),
        })
      ).default([]),
      
      carriersReceipt: z.string().optional(),
      placeOfIssue: z.string().optional(),
      numberOfOriginalBL: z.string().optional(),
      dateOfIssue: z.string().optional(),
      shippedOnBoardDate: z.string().optional(),
      termsAndConditions: z.string().optional(),
      carrierSignatureText: z.string().optional(),
      termsOfCarriage: z.string().optional(),
    });
  }
  
  return z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
  });
};

interface DocumentFormProps {
  documentType: string;
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  error?: string | null;
}

export default function DocumentForm({
  documentType,
  initialData,
  onSubmit,
  isSubmitting,
  error
}: DocumentFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formSchema, setFormSchema] = useState<z.ZodObject<any>>(getFormSchema(documentType));
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [packages, setPackages] = useState<Array<{ description: string; weight: string; measurement: string }>>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      
      if (initialData.packages) {
        setPackages(initialData.packages);
      }
    }
  }, [initialData, form]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = {
      ...data,
      packages,
      documentType,
    };
    
    onSubmit(formData);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
    }
  };

  const addPackage = () => {
    setPackages([...packages, { description: '', weight: '', measurement: '' }]);
  };

  const updatePackage = (index: number, field: string, value: string) => {
    const newPackages = [...packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setPackages(newPackages);
  };

  const removePackage = (index: number) => {
    const newPackages = [...packages];
    newPackages.splice(index, 1);
    setPackages(newPackages);
  };

  const renderBillOfLadingForm = () => {
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="shipper">Shipper & Consignee</TabsTrigger>
          <TabsTrigger value="transport">Transport Details</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="additional">Additional Details</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Transferable Record Owner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="holder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Holder</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter holder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="blNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BL Number*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter BL number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scac"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard Carrier Alpha Code (SCAC)*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SCAC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="carrierSignatory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signed for the Carrier</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter carrier signatory" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormLabel>Company Logo</FormLabel>
                <div className="mt-2">
                  <label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border border-blue-500 cursor-pointer hover:bg-blue-50">
                    <Upload size={24} />
                    <span className="mt-2 text-base leading-normal">Upload Company Logo</span>
                    <input type='file' className="hidden" onChange={handleLogoUpload} accept="image/*" />
                  </label>
                  {companyLogo && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {companyLogo.name}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipper" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Shipper</h3>
              <FormField
                control={form.control}
                name="shipperName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter shipper name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-medium mt-6 mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shipperStreet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shipperCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="onwardInlandRouting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Onward Inland Routing</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter routing information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">Consignee</h3>
              <FormField
                control={form.control}
                name="consigneeTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is consigned to (e.g. TO ORDER OF, TO ORDER, etc.)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter consignee type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="consigneeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter consignee name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-medium mt-6 mb-4">Notify Party</h3>
              <FormField
                control={form.control}
                name="notifyPartyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter notify party name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transport" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vessel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vessel</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter vessel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="voyageNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voyage No.</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter voyage number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="portOfLoading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port of Loading</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter port of loading" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="portOfDischarge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port of Discharge</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter port of discharge" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="placeOfReceipt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Receipt</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter place of receipt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="placeOfDelivery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Delivery</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter place of delivery" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Packages</h3>
                <Button type="button" onClick={addPackage} variant="outline">Add Item</Button>
              </div>

              {packages.map((pkg, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Package {index + 1}</h4>
                    <Button type="button" onClick={() => removePackage(index)} variant="ghost" size="sm">Remove</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <FormLabel>Description</FormLabel>
                      <Input 
                        placeholder="Enter description" 
                        value={pkg.description} 
                        onChange={(e) => updatePackage(index, 'description', e.target.value)} 
                      />
                    </div>
                    <div>
                      <FormLabel>Weight</FormLabel>
                      <Input 
                        placeholder="Enter weight" 
                        value={pkg.weight} 
                        onChange={(e) => updatePackage(index, 'weight', e.target.value)} 
                      />
                    </div>
                    <div>
                      <FormLabel>Measurement</FormLabel>
                      <Input 
                        placeholder="Enter measurement" 
                        value={pkg.measurement} 
                        onChange={(e) => updatePackage(index, 'measurement', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              ))}

              {packages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No packages added. Click "Add Item" to add packages.
                </div>
              )}

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="carriersReceipt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrier's Receipt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter carrier's receipt information" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="additional" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="placeOfIssue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Issue of B/L</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter place of issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberOfOriginalBL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of original B/L</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter number of original B/L" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="dateOfIssue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Issue of B/L</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippedOnBoardDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipped on Board Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Signed for Terms and Conditions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter terms and conditions" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="carrierSignatureText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text for signed for carrier</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter carrier signature text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="termsOfCarriage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms Of Carriage</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter terms of carriage" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Attachments</h3>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">Max. total file size: 5MB</p>
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="mb-2">Drag and drop your file(s) here</p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <Button type="button" variant="outline">Browse File</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  };

  const renderFormByType = () => {
    switch (documentType) {
      case 'bill-of-lading':
        return renderBillOfLadingForm();
      default:
        return (
          <div className="p-4 border rounded-md">
            <p className="text-center text-gray-500">
              Form not available for this document type.
            </p>
          </div>
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {renderFormByType()}
        
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loading className="h-4 w-4" />
                <span>Creating Document...</span>
              </div>
            ) : (
              'Create Document'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}