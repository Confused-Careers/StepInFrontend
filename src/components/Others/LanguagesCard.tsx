

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
import { Languages } from "@/utils/interfaces"
import { Progress } from "../ui/progress"
import * as ProgressPrimitive from '@radix-ui/react-progress'
import clsx from 'clsx'
import { toTitleCase } from "@/utils/functions"
import { LanguageProficiency } from "@/utils/constants"
const levels = Object.values(LanguageProficiency)

export function LanguagesCard() {
    const [languagesLoader, setLanguagesLoader] = useState(false);
    const [languagesSearchLoader, setLanguagesSearchLoader] = useState(false);
    const [addLanguage, setAddLanguage] = useState(false);
    const [searchLanguage, setSearchLanguage] = useState("");
    const [searchLanguagesResults, setSearchLanguagesResults] = useState<Languages[]>([]);
    const [userLanguages, setUserLanguages] = useState<{ id: string, proficiency?: string, language: Languages }[]>([]);


    const debouncedSearchTermLanguages = useDebounce(searchLanguage, 600); // 500ms delay

    const fetchLanguagesSearch = useCallback(async (query: string) => {
        if (query.trim() === '') {
            setSearchLanguagesResults([]);
            return;
        }
        try {
            setLanguagesSearchLoader(true);
            const languages: Languages[] = await userServices.getAllLanguages(query);
            setSearchLanguagesResults(languages);
        } catch (error) {
            console.error("Error fetching languages:", error);
        } finally {
            setLanguagesSearchLoader(false);
        }

    }, []);

    useEffect(() => {
        fetchLanguagesSearch(debouncedSearchTermLanguages);
    }, [debouncedSearchTermLanguages, fetchLanguagesSearch]);

    const fetchUserLanguages = useCallback(async () => {
        try {
            setLanguagesLoader(true);
            const languages: { id: string, proficiency?: string, language: Languages }[] = await userServices.getUserLanguages();
            setUserLanguages(languages);
        } catch (error) {
            console.error("Error fetching languages:", error);
        } finally {
            setLanguagesLoader(false);
        }
    }, []);

    const addUserLanguages = useCallback(async (languageId: string, proficiency: string) => {
        try {
            setLanguagesLoader(true);
            const language: { id: string, proficiency?: string, language: Languages } = await userServices.addUserLanguage(languageId, proficiency);
            setUserLanguages(prevLanguages => [...prevLanguages, { ...language }]);

            setSearchLanguagesResults(skl => skl.filter(language => language.id !== languageId));
        } catch (error) {
            console.error("Error fetching languages:", error);
        } finally {
            setLanguagesLoader(false);
        }

    }, [searchLanguagesResults, userLanguages]);

    const deleteUserLanguages = useCallback(async (languageId: string) => {
        try {
            setLanguagesLoader(true);
            await userServices.deleteUserLanguage(languageId);

            setUserLanguages(skl => skl?.filter(sk => sk.id !== languageId));
        } catch (error) {
            console.error("Error fetching languages:", error);
        } finally {
            setLanguagesLoader(false);
        }

    }, [searchLanguagesResults, userLanguages]);

    useEffect(() => {
        fetchUserLanguages()
    }, []);
    return (
        <Card className="gap-4">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Languages</span>
                    <Button onClick={() => { setAddLanguage(pre => !pre); setSearchLanguagesResults([]); setSearchLanguage(''); }} variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {addLanguage == true ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                </CardTitle>
                <Input value={searchLanguage} onChange={e => setSearchLanguage(e.target.value)} className={`transition-all duration-500 ease-in-out ${addLanguage == false ? 'opacity-0 h-0 overflow-hidden' : 'mt-3 opacity-100 h-auto'}`} />
            </CardHeader>

            <CardContent>
                {(languagesSearchLoader || searchLanguagesResults.length) ? <div className="flex flex-wrap flex-col gap-10 mt-4">
                    {languagesSearchLoader ? [1].map((index: number) => (

                        <div key={index}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium animate-pulse h-4 bg-secondary rounded-sm">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span className="text-sm font-medium animate-pulse h-4 bg-secondary rounded-sm">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-md animate-pulse" />
                        </div>
                    )) : searchLanguagesResults.map((language, index) => (
                        <AddLanguageCard language={language} handleClick={(val: { id: string, proficiency: string }) => addUserLanguages(val.id, val.proficiency)} key={index} />
                    ))}
                </div>:''}
                <div className={`border ${addLanguage ? `my-4 ${searchLanguagesResults.length?'mt-10':''} opacity-100` : ' opacity-0'} bg-gray-200`}></div>
                <div className="flex flex-wrap gap-4">

                    {languagesLoader ? [1, 2, 3].map((index: number) => (
                        <div key={index}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium animate-pulse h-4 bg-secondary rounded-sm">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span className="text-sm font-medium animate-pulse h-4 bg-secondary rounded-sm">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-md animate-pulse" />
                        </div>
                    )) : userLanguages.map((language, index) => (
                        <div key={index} className="w-full">
                            <div className="flex justify-between mb-2 items-center">
                                <div className="flex gap-2 flex-1">
                                    <span className="text-sm font-medium">{language?.language?.languageName} :</span>
                                    <span className="text-sm text-muted-foreground">{toTitleCase(language?.proficiency || '')}</span>
                                </div>
                                <div className="cursor-pointer" onClick={() => deleteUserLanguages(language?.id)}>
                                    <X className="w-3  h-3" />
                                </div>

                            </div>
                            <Progress value={100} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}


interface AddLanguageCardProps {
    language: Languages
    handleClick?: (val: { id: string, proficiency: string }) => void
}

const AddLanguageCard: React.FC<AddLanguageCardProps> = ({ language, handleClick = () => { } }) => {
    const [value, setValue] = useState(0)
    const progressPercent = (value / (levels.length - 1)) * 100
    return (
        <div className="w-full">
            <h2 className="text-xs mb-3 flex items-center">
                <span className="flex-1">{language.languageName}: <span className="text-blue-600">{toTitleCase(levels[value])}</span></span>
                <span onClick={() => handleClick({ id: language.id, proficiency: levels[value] })} className="cursor-pointer hover:bg-secondary"><Plus className="h-3 w-3" /></span>
            </h2>

            <div className="relative mx-1">
                <ProgressPrimitive.Root
                    value={progressPercent}
                    className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20"
                >
                    <ProgressPrimitive.Indicator
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </ProgressPrimitive.Root>

                <div className="absolute w-full top-4 flex justify-between text-muted-foreground">
                    {levels.map((label, i) => (
                        <span key={i} className={`w-1/4 text-[10px] ${levels.length / (i + 1) < 2 ? 'text-right' : 'text-left'}`}>
                            {toTitleCase(label)}
                        </span>
                    ))}
                </div>

                <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
                    {levels.map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                'h-2 w-2 rounded-full z-10 pointer-events-auto',
                                value === i ? 'bg-blue-600' : 'bg-gray-300 border-1 border-gray-400',
                                'cursor-pointer transition-transform transform hover:scale-110'
                            )}
                            onClick={() => setValue(i)}
                            style={{ transform: `translateX(-50%)`, left: `${(i / (levels.length - 1)) * 100}%`, position: 'absolute' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}