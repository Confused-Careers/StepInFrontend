import {
  Minus,
    Plus,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/use-debounce"
import userServices from "@/services/userServices"
import { Skills } from "@/utils/interfaces"
import { Badge } from "../ui/badge"

export function SkillsCard() {
    const [skillsLoader, setSkillsLoader] = useState(false);
    const [skillsSearchLoader, setSkillsSearchLoader] = useState(false);
    const [addSkill, setAddSkill] = useState(false);
    const [searchSkill, setSearchSkill] = useState("");
    const [searchSkillsResults, setSearchSkillsResults] = useState<Skills[]>([]);
    const [userSkills, setUserSkills] = useState<{ id: string, skill: Skills }[]>([]);


    const debouncedSearchTermSkills = useDebounce(searchSkill, 600); // 500ms delay

    const fetchSkillsSearch = useCallback(async (query: string) => {
        if (query.trim() === '') {
            setSearchSkillsResults([]);
            return;
        }
        try {
            setSkillsSearchLoader(true);
            const skills: Skills[] = await userServices.getAllSkills(query);
            setSearchSkillsResults(skills);
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setSkillsSearchLoader(false);
        }

    }, []);

    useEffect(() => {
        fetchSkillsSearch(debouncedSearchTermSkills);
    }, [debouncedSearchTermSkills, fetchSkillsSearch]);

    const fetchUserSkills = useCallback(async () => {
        try {
            setSkillsLoader(true);
            const skills: { id: string, skill: Skills }[] = await userServices.getUserSkills();
            setUserSkills(skills);
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setSkillsLoader(false);
        }
    }, []);

    const addUserSkills = useCallback(async (skillId: string) => {
        try {
            setSkillsLoader(true);
            console.log("hi")
            const skill: { id: string, skill: Skills } = await userServices.addUserSkills(skillId);
            setUserSkills(prevSkills => [...prevSkills, { ...skill }]);

            setSearchSkillsResults(skl => skl.filter(skill => skill.id !== skillId));
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setSkillsLoader(false);
        }

    }, [searchSkillsResults, userSkills]);

    const deleteUserSkills = useCallback(async (skillId: string) => {
        try {
            setSkillsLoader(true);
            await userServices.deleteUserSkills(skillId);

            setUserSkills(skl => skl?.filter(sk => sk.id !== skillId));
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setSkillsLoader(false);
        }

    }, [searchSkillsResults, userSkills]);

    useEffect(() => {
        fetchUserSkills()
    }, []);

    const skillsSkeletonWidths = Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * (150 - 50 + 1)) + 50
    );
    const skillsSearchSkeletonWidths = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * (150 - 50 + 1)) + 50
    );
    return (<Card className="gap-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Skills</span>
                <Button onClick={() => { setAddSkill(pre => !pre); setSearchSkillsResults([]);setSearchSkill(''); }} variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {addSkill==true ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </CardTitle>
              <Input value={searchSkill} onChange={e => setSearchSkill(e.target.value)} className={`transition-all duration-500 ease-in-out ${addSkill==false ? 'opacity-0 h-0 overflow-hidden' : 'mt-3 opacity-100 h-auto'}`} />
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skillsSearchLoader ? skillsSearchSkeletonWidths.map((width: number, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="h-6 animate-pulse"
                    style={{ width: `${width}px` }}
                  >
                    &nbsp;
                  </Badge>
                )) : searchSkillsResults.map((skill, index) => (
                  <Badge onClick={() => addUserSkills(skill?.id)} key={index} variant="secondary" className="px-2.5 cursor-pointer py-1 bg-slate-700 hover:bg-slate-600">
                    {skill.skillName}<Plus className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <div className={`border ${addSkill?'my-4 opacity-100':' opacity-0'} bg-gray-200`}></div>
              <div className="flex flex-wrap gap-2">

                {skillsLoader ? skillsSkeletonWidths.map((width: number, index: number) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="h-6 animate-pulse"
                    style={{ width: `${width}px` }}
                  >
                    &nbsp;
                  </Badge>
                )) : userSkills.map((skill, index) => (
                  <Badge onClick={() => deleteUserSkills(skill?.id)} key={index} variant="secondary" className="px-2.5 py-1 cursor-pointer hover:bg-secondary/70">
                    {skill.skill?.skillName}<X className="h-3 w-3 ml-1
                      "/>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>);
}