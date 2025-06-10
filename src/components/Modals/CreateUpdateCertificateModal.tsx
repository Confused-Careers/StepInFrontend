import React, {  ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Certificates } from "@/utils/interfaces";
import { Textarea } from "../ui/textarea";

interface CreateUpdateCertificateModalProps {
  addCertificate: Certificates | null;
  handleInputChange: (target:string,e: string) => void;
  handleClose: () => void;
  handleSubmit: (e:FormEvent<HTMLFormElement>) => void;
  addCertificateLoading:boolean;
}
const CreateUpdateCertificateModal: React.FC<CreateUpdateCertificateModalProps> = ({addCertificate,addCertificateLoading, handleInputChange, handleSubmit,handleClose }) => {
 

  // Don't render anything if modal is not open
  if (!addCertificate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="container max-w-md h-[90%] overflow-y-auto p-0">
        <Card className="border-primary/20 bg-background/90 backdrop-blur-md ">
          <CardHeader>
            <CardTitle>{addCertificate?.id?'Update Certification':"Add New Certification"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otpCode">Organisation Name</Label>
                <Input
                  type="text"
                  value={addCertificate.issuingOrganization}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('issuingOrganization', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otpCode">Certification Name</Label>
                <Input
                  type="text"
                  value={addCertificate.certificationName}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('certificationName', e.target.value)}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="otpCode">Description</Label>
                <Textarea
                  rows={3}
                  value={addCertificate.description}
                  onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>handleInputChange('description', e.target.value)}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="otpCode">Credential Id</Label>
                <Input
                  type="text"
                  value={addCertificate.credentialId}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('credentialId', e.target.value)}
                  
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otpCode">Credential Url</Label>
                <Input
                  type="text"
                  value={addCertificate.credentialUrl}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('credentialUrl', e.target.value)}
                  
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otpCode">Issued Date</Label>
                <Input
                  type="date"
                  value={addCertificate.issueDate}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('issueDate', e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={addCertificateLoading}>
                {addCertificateLoading ? (addCertificate?.id?'Updating...':"Submitting...") : (addCertificate?.id?'Update':"Submit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleClose}
                disabled={addCertificateLoading}
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateUpdateCertificateModal;