import React, { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Projects } from "@/utils/interfaces";
import { Textarea } from "../ui/textarea";

interface CreateUpdateProjectModalProps {
  addProject: Projects | null;
  handleInputChange: (target:string,e: string | number) => void;
  handleClose: () => void;
  handleSubmit: (e:FormEvent<HTMLFormElement>) => void;
  addProjectLoading:boolean;
}
const CreateUpdateProjectModal: React.FC<CreateUpdateProjectModalProps> = ({addProject,addProjectLoading, handleInputChange, handleSubmit,handleClose }) => {
 

  // Don't render anything if modal is not open
  if (!addProject) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="container max-w-md  h-[90%] overflow-y-auto p-0">
        <Card className="border-primary/20 bg-background/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle>{addProject?.id?'Update Project Details':"Add New Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otpCode">Project Name</Label>
                <Input
                  type="text"
                  value={addProject.projectName}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('projectName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otpCode">Role</Label>
                <Input
                  type="text"
                  value={addProject.role}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('role', e.target.value)}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="otpCode">Description</Label>
                <Textarea
                  rows={3}
                  value={addProject.description}
                  onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>handleInputChange('description', e.target.value)}
                />
              </div>
                <div className="space-y-2">
                <Label htmlFor="otpCode">Impact Description</Label>
                <Textarea
                  rows={3}
                  value={addProject.impactDescription}
                  onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>handleInputChange('impactDescription', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otpCode">Project Url</Label>
                <Input
                  type="text"
                  value={addProject.projectUrl}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('projectUrl', e.target.value)}
                  
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otpCode">Project year</Label>
                <Input
                  type="number"
                  value={addProject.completionYear}
                  onChange={(e:ChangeEvent<HTMLInputElement>)=>handleInputChange('completionYear',e.target.value==""?"": Number(e.target.value))}
                />
              </div>
              <Button type="submit" className="w-full" disabled={addProjectLoading}>
                {addProjectLoading ? (addProject?.id?'Updating...':"Submitting...") : (addProject?.id?'Update':"Submit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleClose}
                disabled={addProjectLoading}
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

export default CreateUpdateProjectModal;