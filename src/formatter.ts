import chalk from "chalk";
import TurndownService from "turndown";
import {
  JobBoard,
  JobPostingDetails,
  Organization,
  JobPostingBrief,
  ApplicationFormSection,
  ApplicationFormField,
} from "./types.js";

const turndownService = new TurndownService();

const formatJobBrief = (job: JobPostingBrief): string => {
  const comp = job.compensationTierSummary ? ` | ${job.compensationTierSummary}` : "";
  return `${chalk.bold(job.title)} | ${chalk.green(job.locationName)} | ${chalk.cyan(job.workplaceType)} | ${chalk.magenta(job.employmentType)}${comp} | ${chalk.dim(job.id)} | ${chalk.dim(job.url)}\n`;
};

export const formatJobBoard = (org: Organization, board: JobBoard): string => {
  const header = [
    `# Job Board for ${org.name}`,
    org.publicWebsite ? chalk.dim(org.publicWebsite) : "",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const jobsByTeam = board.jobPostings.reduce((acc, job) => {
    const team = job.team || "Other";
    acc.set(team, [...(acc.get(team) || []), job]);
    return acc;
  }, new Map<string, JobPostingBrief[]>());

  const teamsOutput = Array.from(jobsByTeam.keys())
    .sort()
    .map((team) => {
      const jobs = jobsByTeam.get(team) || [];
      return `## ${team}\n\n${jobs.map(formatJobBrief).join("\n")}`;
    })
    .join("\n");

  return `${header}\n${teamsOutput}`;
};

export const formatJobBoardJson = (org: Organization, board: JobBoard): object => {
  return {
    organization: org,
    jobs: board.jobPostings.map((job) => ({
      id: job.id,
      title: job.title,
      team: job.team,
      location: job.locationName,
      workplaceType: job.workplaceType,
      employmentType: job.employmentType,
      compensation: job.compensationTierSummary,
      url: job.url,
    })),
  };
};

const stripHtml = (html: string): string => html.replace(/<[^>]*>?/gm, "").trim();

const formatFormField = (entry: ApplicationFormField): string => {
  const required = entry.isRequired ? chalk.red("*") : "";
  const title = entry.field?.title || entry.field?.path || "Unknown Field";
  const type = entry.field?.type || "unknown";

  const fieldHeader = `- ${title}${required} ${chalk.dim(`(${type})`)}`;
  const fieldDesc = entry.descriptionHtml
    ? `\n  ${chalk.dim(stripHtml(entry.descriptionHtml))}`
    : "";

  return `${fieldHeader}${fieldDesc}`;
};

const formatFormSection = (section: ApplicationFormSection): string => {
  const title = section.title ? `\n${chalk.underline(section.title)}` : "";
  const desc = section.descriptionHtml ? `\n${chalk.dim(stripHtml(section.descriptionHtml))}` : "";
  const fields = section.fieldEntries.map(formatFormField).join("\n");

  return [title, desc, fields].filter(Boolean).join("\n");
};

export const formatJobDetails = (job: JobPostingDetails): string => {
  const header = [
    chalk.bold.blue(`\n${job.title}`),
    `${chalk.yellow(job.departmentName)} | ${chalk.green(job.locationName)} | ${chalk.cyan(job.workplaceType)}`,
    job.compensationTierSummary ? chalk.dim(job.compensationTierSummary) : "",
    chalk.dim(job.url),
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const markdown = turndownService.turndown(job.descriptionHtml);

  const details = [
    "\n" + chalk.bold("Details:"),
    `- Published: ${new Date(job.publishedDate).toLocaleDateString()}`,
    `- Employment: ${job.employmentType}`,
    job.teamNames.length > 0 ? `- Teams: ${job.teamNames.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const appForm = job.applicationForm
    ? `\n${chalk.bold("Application Form:")}\n${job.applicationForm.sections.map(formatFormSection).join("\n")}`
    : "";

  return [header, markdown, details, appForm].filter(Boolean).join("\n");
};

export const formatJobDetailsJson = (job: JobPostingDetails): object => {
  const applicationForm =
    job.applicationForm?.sections.flatMap((section) =>
      section.fieldEntries.map((entry) => ({
        name: entry.field?.title || entry.field?.path || "Unknown Field",
        type: entry.field?.type || "unknown",
        required: entry.isRequired,
        description: entry.descriptionHtml ? stripHtml(entry.descriptionHtml) : null,
        section: section.title,
      }))
    ) || [];

  return {
    id: job.id,
    title: job.title,
    department: job.departmentName,
    location: job.locationName,
    workplaceType: job.workplaceType,
    employmentType: job.employmentType,
    publishedDate: job.publishedDate,
    compensation: job.compensationTierSummary,
    teamNames: job.teamNames,
    url: job.url,
    descriptionMarkdown: turndownService.turndown(job.descriptionHtml),
    applicationForm,
  };
};
