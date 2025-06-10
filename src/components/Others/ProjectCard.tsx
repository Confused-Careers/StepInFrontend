import { Award, Calendar, Delete, Edit, ExternalLink, FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Projects } from "@/utils/interfaces";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import userServices from "@/services/userServices";
import CreateUpdateProjectModal from "../Modals/CreateUpdateProjectModal";

export function ProjectCard() {
    const [addProject,setAddProject]=useState<Projects | null>(null);
        const [addProjectLoading,setAddProjectLoading]=useState<boolean>(false);
        const [getProjectLoading,setGetProjectLoading]=useState<boolean>(false);
        const [userProjects, setUserProjects] = useState<Projects[]>([]);
 const defaultValue={
id:"",
projectName:"",
role:"",
completionYear:new Date().getFullYear(),
description:"",
impactDescription:"",
projectUrl:"",
skills:[]
  };

    
      const addUpdateProject =  useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setAddProjectLoading(true);
    
        try {

            if(addProject?.id){
                const updatedProject: Projects = await userServices.updateUserProject({...addProject,completionYear:addProject.completionYear || 0});
                let updatedProjects = userProjects.map(cert => {
                    if (cert.id === updatedProject.id) {
                        return { ...cert, ...updatedProject };
                    }
                    return cert;
                });
                setUserProjects(updatedProjects);       
            }else{
                delete addProject?.id;
                const newProject: Projects = await userServices.addUserProject(addProject?{...addProject,completionYear:addProject.completionYear || 0}:null);
                setUserProjects(prev => [newProject,...prev]);
            }
            setAddProject(null);
        } catch (err: unknown) {
            console.error("Error adding/updating Project:", err);
          if (err instanceof Error) {
            toast.error(err.message);
          } else if (typeof err === "string") {
            toast.error(err);
          } else {
            toast.error("Failed to add Project");
          }
        } finally {
          setAddProjectLoading(false);
        }
      },[addProject, userProjects]);


      const deleteProject =  useCallback(async (id:string): Promise<void> => {
        setGetProjectLoading(true);
    
        try {
            await userServices.deleteUserProject(id);
                let updatedProjects = userProjects.filter(cert => {
                    if (cert.id !== id) {
                        return true;
                    }
                    return false;
                });
                setUserProjects(updatedProjects);
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else if (typeof err === "string") {
            toast.error(err);
          } else {
            toast.error("Failed to delete Project");
          }
        } finally {
          setGetProjectLoading(false);
        }
      },[addProject, userProjects]);

      useEffect(() => {
        getProjects();
      },[]);


      const getProjects =  useCallback(async (): Promise<void> => {
        setGetProjectLoading(true);
    
        try {
            let Projects:Projects[]=await userServices.getUserProjects();
                
                setUserProjects(Projects);
        } catch (err: unknown) {
          if (err instanceof Error) {
            toast.error(err.message);
          } else if (typeof err === "string") {
            toast.error(err);
          } else {
            toast.error("Failed to get Projects");
          }
        } finally {
          setGetProjectLoading(false);
        }
      },[addProject, userProjects]);

      const handleInputChange = (name:string,value:string | number): void => {
          setAddProject((prev: Projects | null) => {if (prev) return { ...prev, [name]: value }; return null;});
        };
    return (
      
        <TabsContent value="projects" className="space-y-6">
            <CreateUpdateProjectModal addProject={addProject} addProjectLoading={addProjectLoading}  handleInputChange={(name:string,value:string | number)=>handleInputChange(name,value)} handleSubmit={(e:FormEvent<HTMLFormElement>)=>{addUpdateProject(e)}} handleClose={()=>setAddProject(null)}/>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Projects</h3>
                <Button onClick={()=>setAddProject({...defaultValue})} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Project
                </Button>
              </div>

              {userProjects.map((project, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-muted rounded-full p-2 mt-0.5">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-lg">{project.projectName}</h3>
                            <p className="text-muted-foreground">{project.role}</p>
                          </div>
                          <div>
                            <Button onClick={()=>deleteProject(project?.id || '')} variant="ghost" size="sm" className="self-start sm:self-center">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                            <Button onClick={()=>setAddProject(project)} variant="ghost" size="sm" className="self-start sm:self-center">
                            <Edit className="h-4 w-4" />
                          </Button>
                          </div>
                        </div>

                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{project.completionYear || '-'}</span>
                        </div>

                        <p className="mt-3">{project.description}</p>

                        {project.impactDescription && (
                          <div className="mt-3">
                            <p className="font-medium text-sm">Impact:</p>
                            <p className="text-sm mt-1">{project.impactDescription}</p>
                          </div>
                        )}

                        {(project.skills && project.skills.length) ? (
                          <div className="mt-3">
                            <p className="font-medium text-sm">Skills Used:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {project.skills.map((skill, i) => (
                                <Badge key={i} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ):''}

                       <div className="mt-3">
                          <Button disabled={!project?.projectUrl} variant="link" className="p-0 h-auto has-[>svg]:px-0">
                            <a target="__blank"  href={project?.projectUrl} className="flex no-underline gap-2">View Project
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