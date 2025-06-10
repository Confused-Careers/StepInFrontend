import { Award, Calendar, Edit, ExternalLink, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Certificates } from "@/utils/interfaces";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import userServices from "@/services/userServices";
import CreateUpdateCertificateModal from "../Modals/CreateUpdateCertificateModal";

export function CertificationCard() {
    const [addCertificate,setAddCertificate]=useState<Certificates | null>(null);
        const [addCertificateLoading,setAddCertificateLoading]=useState<boolean>(false);
        const [,setGetCertificateLoading]=useState<boolean>(false);
        const [userCertificates, setUserCertificates] = useState<Certificates[]>([]);
 const defaultValue={
certificationName:"",
issuingOrganization:"",
issueDate:"",
expiryDate:"",
credentialId:"",
credentialUrl:"",
description:"",
  };

    
      const addUpdateCertificate =  useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setAddCertificateLoading(true);
    
        try {
            if(addCertificate?.id){
                const updatedCertificate: Certificates = await userServices.updateUserCertifications(addCertificate);
                let updatedCertificates = userCertificates.map(cert => {
                    if (cert.id === updatedCertificate.id) {
                        return { ...cert, ...updatedCertificate };
                    }
                    return cert;
                });
                setUserCertificates(updatedCertificates);       
            }else{
                delete addCertificate?.id;
                const newCertificate: Certificates = await userServices.addUserCertifications(addCertificate);
                setUserCertificates(prev => [newCertificate,...prev]);
            }
            setAddCertificate(null);
        } catch (err: unknown) {
            console.error("Error adding/updating certificate:", err);
          if (err instanceof Error) {
            toast.error(err.message);
          } else if (typeof err === "string") {
            toast.error(err);
          } else {
            toast.error("Failed to add certificate");
          }
        } finally {
          setAddCertificateLoading(false);
        }
      },[addCertificate, userCertificates]);


      const deleteCertificate =  useCallback(async (id:string): Promise<void> => {
        setGetCertificateLoading(true);
    
        try {
            await userServices.deleteUserCertifications(id);
                let updatedCertificates = userCertificates.filter(cert => {
                    if (cert.id !== id) {
                        return true;
                    }
                    return false;
                });
                setUserCertificates(updatedCertificates);
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else if (typeof err === "string") {
            toast.error(err);
          } else {
            toast.error("Failed to delete certificate");
          }
        } finally {
          setGetCertificateLoading(false);
        }
      },[addCertificate, userCertificates]);

      useEffect(() => {
        getCertificates();
      },[]);


      const getCertificates =  useCallback(async (): Promise<void> => {
        setGetCertificateLoading(true);
    
        try {
            let certificates:Certificates[]=await userServices.getUserCertificates();
                
                setUserCertificates(certificates);
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else if (typeof err === "string") {
            toast.error(err);
          } else {
            toast.error("Failed to get certificates");
          }
        } finally {
          setGetCertificateLoading(false);
        }
      },[addCertificate, userCertificates]);

      const handleInputChange = (name:string,value:string): void => {
          setAddCertificate((prev: Certificates | null) => {if (prev) return { ...prev, [name]: value }; return null;});
        };
    return (
        <TabsContent value="certifications" className="space-y-6">
            <CreateUpdateCertificateModal addCertificate={addCertificate} addCertificateLoading={addCertificateLoading}  handleInputChange={(name:string,value:string)=>handleInputChange(name,value)} handleSubmit={(e:FormEvent<HTMLFormElement>)=>{addUpdateCertificate(e)}} handleClose={()=>setAddCertificate(null)}/>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Certifications</h3>
                <Button onClick={()=>setAddCertificate({...defaultValue})} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Certification
                </Button>
              </div>

              {userCertificates.map((certification, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-muted rounded-full p-2 mt-0.5">
                        <Award className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-lg">{certification.certificationName}</h3>
                            <p className="text-muted-foreground">{certification.issuingOrganization}</p>
                          </div>
                          <div>
                            <Button onClick={()=>deleteCertificate(certification?.id || '')} variant="ghost" size="sm" className="self-start sm:self-center">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                            <Button onClick={()=>setAddCertificate(certification)} variant="ghost" size="sm" className="self-start sm:self-center">
                            <Edit className="h-4 w-4" />
                          </Button>
                          </div>
                        </div>

                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{certification.issueDate || '-'}</span>
                        </div>

                        <p className="mt-3">{certification.description}</p>

                        {certification.credentialId && (
                          <div className="mt-3">
                            <p className="font-medium text-sm">Credential ID:</p>
                            <p className="text-sm mt-1">{certification.credentialId || 'None'}</p>
                          </div>
                        )}

                        {(certification.skills && certification.skills.length) ? (
                          <div className="mt-3">
                            <p className="font-medium text-sm">Skills:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {certification.skills.map((skill, i) => (
                                <Badge key={i} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ):''}

                        <div className="mt-3">
                          <Button disabled={!certification?.credentialUrl} variant="link" className="p-0 h-auto has-[>svg]:px-0">
                            <a target="__blank"  href={certification?.credentialUrl} className="flex no-underline gap-2">Verify Credential
                            <ExternalLink className="h-3.5 w-3.5 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
    )
}