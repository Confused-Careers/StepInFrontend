export interface Skills {
    id: string,
      skillName: string,
      category: string
}
export interface SkillsResponse {
    data: Skills[];
    messege: string;
    statusCode: number;
}

export interface AddedSkillsResponse {
    data:{ id: string, skill: Skills },
    messege: string;
    statusCode: number;
}

export interface UsersSkillsResponse {
    data:{ id: string, skill: Skills }[],
    messege: string;
    statusCode: number;
}


export interface Languages {
    id: string,
      languageName: string,
      languageCode: string
}
export interface LanguagesResponse {
    data: Languages[];
    messege: string;
    statusCode: number;
}

export interface AddedLanguagesResponse {
    data:{ id: string, language: Languages },
    messege: string;
    statusCode: number;
}

export interface UsersLanguagesResponse {
    data:{ id: string, language: Languages }[],
    messege: string;
    statusCode: number;
}


export interface Socials {
    id?: string,
      platform: string,
      profileUrl: string
}

export interface AddedSocialsResponse {
    data:Socials,
    messege: string;
    statusCode: number;
}

export interface UsersSocialsResponse {
    data:Socials[],
    messege: string;
    statusCode: number;
}


export interface Certificates {
id?:string;
certificationName:string;
issuingOrganization:string;
issueDate:string;
expiryDate?:string;
credentialId?:string;
credentialUrl?:string;
description:string;
skills?:any[];
}

export interface UsersCertificatesResponse {
    data:Certificates[],
    messege: string;
    statusCode: number;
}

export interface AddedUsersCertificatesResponse {
    data:Certificates,
    messege: string;
    statusCode: number;
}



export interface Projects {
id?:string;
projectName:string;
role:string;
completionYear:number;
description?:string;
impactDescription?:string;
projectUrl?:string;
skills?:any[];
}

export interface UsersProjectsResponse {
    data:Projects[],
    messege: string;
    statusCode: number;
}

export interface AddedUsersProjectsResponse {
    data:Projects,
    messege: string;
    statusCode: number;
}