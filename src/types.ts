export type WorkplaceType = "OnSite" | "Hybrid" | "Remote";
export type EmploymentType = "FullTime" | "PartTime" | "Contract" | "Intern";

export interface Team {
  id: string;
  name: string;
  parentTeamId: string | null;
}

export interface JobPostingBrief {
  id: string;
  title: string;
  teamId: string;
  team: string;
  locationName: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  compensationTierSummary: string | null;
  url: string;
}

export interface JobBoard {
  teams: Team[];
  jobPostings: JobPostingBrief[];
}

export interface JobBoardSummary {
  organization: Organization;
  jobs: JobPostingBrief[];
}

export interface CompensationTier {
  id: string;
  title: string | null;
  tierSummary: string;
}

export interface ApplicationFormField {
  id: string;
  field: any;
  isRequired: boolean;
  descriptionHtml: string | null;
}

export interface ApplicationFormSection {
  title: string | null;
  descriptionHtml: string | null;
  fieldEntries: ApplicationFormField[];
}

export interface ApplicationForm {
  id: string;
  sections: ApplicationFormSection[];
}

export interface JobPostingDetails {
  id: string;
  title: string;
  departmentName: string;
  locationName: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  descriptionHtml: string;
  teamNames: string[];
  publishedDate: string;
  compensationTierSummary: string | null;
  compensationTiers: CompensationTier[];
  applicationForm: ApplicationForm | null;
  url: string;
}

export interface Organization {
  name: string;
  publicWebsite: string | null;
}
