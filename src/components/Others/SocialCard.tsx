


import {
    Dribbble,
    Github,
    Globe,
    Linkedin,
    Minus,
    Pencil,
    Plus,
    Twitter,
    UserCheck,
    X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { useCallback, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import userServices from "@/services/userServices"
import { Socials } from "@/utils/interfaces"
import { SocialPlatform } from "@/utils/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { toTitleCase } from "@/utils/functions"
import { BsBehance } from "react-icons/bs"

export function SocialsCard() {
    const [socialsLoader, setSocialsLoader] = useState(false);
    const [addSocial, setAddSocial] = useState<Socials | null>(null);
    const [userSocials, setUserSocials] = useState<Socials[]>([]);


    const fetchUserSocials = useCallback(async () => {
        try {
            setSocialsLoader(true);
            const socials: Socials[] = await userServices.getUserSocials();
            setUserSocials(socials);
        } catch (error) {
            console.error("Error fetching socials:", error);
        } finally {
            setSocialsLoader(false);
        }
    }, []);

    const addUserSocials = useCallback(async () => {
        try {
            setSocialsLoader(true);
            if (addSocial?.id) {
                const social: Socials = await userServices.updateUserSocial(addSocial.id, addSocial?.platform || '', addSocial?.profileUrl || '');
                let socials= userSocials.map(skl => {
                    if (skl.id === social.id) {
                        return { ...skl, platform: social.platform, profileUrl: social.profileUrl };
                    }else{
                        return skl;
                    }});
                setUserSocials(socials);
            } else {
                const social: Socials = await userServices.addUserSocial(addSocial?.platform || '', addSocial?.profileUrl || '');
                setUserSocials(prevSocials => [...prevSocials, { ...social }]);
            }
            setAddSocial(null);

        } catch (error) {
            console.error("Error fetching socials:", error);
        } finally {
            setSocialsLoader(false);
        }

    }, [addSocial]);

    const deleteUserSocials = useCallback(async (socialId: string) => {
        try {
            setSocialsLoader(true);
            await userServices.deleteUserSocial(socialId);

            setUserSocials(skl => skl?.filter(sk => sk.id !== socialId));
        } catch (error) {
            console.error("Error fetching socials:", error);
        } finally {
            setSocialsLoader(false);
        }

    }, [userSocials]);

    useEffect(() => {
        fetchUserSocials()
    }, []);

    return (<>
        <CardTitle className="flex items-center justify-between mt-6 ">
            <span>Socials</span>
            <Button onClick={() => { if (addSocial == null) setAddSocial({ platform: '', profileUrl: '' }); else { setAddSocial(null); } }} variant="ghost" size="sm" className="h-8 w-8 p-0">
                {addSocial != null ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
        </CardTitle>
        <div className={`${addSocial == null ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100  h-auto'}`}>
        <Select value={addSocial?.platform} onValueChange={(e) => setAddSocial({ platform: e, profileUrl: addSocial?.profileUrl || '',id:addSocial?.id || '' })} >
            <SelectTrigger className={`w-full transition-all duration-500 ease-in-out ${addSocial == null ? 'opacity-0 h-0 overflow-hidden' : 'mt-4 opacity-100 h-auto'}`}>
                <SelectValue placeholder={"Platform"} />
            </SelectTrigger>
            <SelectContent>
                {Object.values(SocialPlatform).map((platform, index) => (
                    <SelectItem key={index} value={platform}>{toTitleCase(platform)}</SelectItem>
                ))}

            </SelectContent>
        </Select>
        </div>
                <div className={`${addSocial == null ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 mt-4  h-auto'}`}>

        <Input value={addSocial?.profileUrl} onChange={e => setAddSocial({ platform: addSocial?.platform || SocialPlatform.OTHER, profileUrl: e.target.value,id:addSocial?.id || '' })}  />
      </div>
        <Button onClick={addUserSocials} disabled={addSocial?.platform == '' || addSocial?.profileUrl == '' || socialsLoader} className={`bg-primary ${addSocial == null ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 py-2 px-4 mt-4  h-auto'}`} size="sm">{addSocial?.id ? 'Update' : 'Add'}</Button>
        <div className={`border ${addSocial ? 'my-4 opacity-100' : ' opacity-0'} bg-gray-200`}></div>
        <div className={`flex flex-wrap gap-2 ${addSocial?'mt-6':''}`}>

            {socialsLoader ? [1,2,3].map((index: number) => (
                <div className="flex gap-2 items-center justify-between w-full text-sm" key={index}>
                    <div
                        className="h-5 w-5 animate-pulse bg-secondary rounded-full"
                    >
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                    <div
                        className="h-3 w-full animate-pulse bg-secondary rounded-md"
                    >
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                </div>
            )) : userSocials.map((social, index) => (
                <div key={social?.id || index} className="flex items-center justify-between gap-2 w-full text-sm  transition-colors">
                    <div className="flex items-center flex-1  overflow-x-hidden">
                        <span className="flex items-center h-dull">
                            {social.platform == SocialPlatform.LINKEDIN ? <Linkedin className="h-4 w-4 mr-2 text-primary" /> : ''}
                            {social.platform == SocialPlatform.BEHANCE ? <BsBehance className="h-4 w-4 mr-2 text-primary" /> : ''}
                            {social.platform == SocialPlatform.DRIBBBLE ? <Dribbble className="h-4 w-4 mr-2 text-primary" /> : ''}
                            {social.platform == SocialPlatform.GITHUB ? <Github className="h-4 w-4 mr-2 text-primary" /> : ''}
                            {social.platform == SocialPlatform.PORTFOLIO ? <UserCheck className="h-4 w-4 mr-2 text-primary" /> : ''}
                            {social.platform == SocialPlatform.TWITTER ? <Twitter className="h-4 w-4 mr-2 text-primary" /> : ''}
                            {social.platform == SocialPlatform.OTHER ? <Globe className="h-4 w-4 mr-2 text-primary" /> : ''}

                        </span>
                        <a href={social.profileUrl} target="__blank" className="hover:text-primary flex items-center h-full flex-1">{social.profileUrl}</a>
                    </div>
                    <span className="p-1 cursor-pointer rounded-sm bg-secondary" onClick={() => { setAddSocial({ ...social }) }}><Pencil className="h-3 w-3" /></span>

                    <span className="p-1 cursor-pointer rounded-sm bg-secondary" onClick={() => deleteUserSocials(social?.id || '')}><X className="h-3 w-3" /></span>
                </div>
            ))}
        </div>
    </>);
}