import { GraphQLClient, gql } from "graphql-request";
import { JobBoard, JobPostingDetails, Organization } from "./types.js";

const ENDPOINT = "https://jobs.ashbyhq.com/api/non-user-graphql";

const client = new GraphQLClient(ENDPOINT);

const JOB_BOARD_QUERY = gql`
  query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {
    jobBoard: jobBoardWithTeams(organizationHostedJobsPageName: $organizationHostedJobsPageName) {
      teams {
        id
        name
        parentTeamId
      }
      jobPostings {
        id
        title
        teamId
        locationName
        workplaceType
        employmentType
        compensationTierSummary
      }
    }
  }
`;

const JOB_POSTING_QUERY = gql`
  query ApiJobPosting($organizationHostedJobsPageName: String!, $jobPostingId: String!) {
    jobPosting(
      organizationHostedJobsPageName: $organizationHostedJobsPageName
      jobPostingId: $jobPostingId
    ) {
      id
      title
      departmentName
      locationName
      workplaceType
      employmentType
      descriptionHtml
      teamNames
      publishedDate
      compensationTierSummary
      compensationTiers {
        id
        title
        tierSummary
      }
      applicationForm {
        id
        sections {
          title
          descriptionHtml
          fieldEntries {
            id
            field
            isRequired
            descriptionHtml
          }
        }
      }
    }
  }
`;

const ORG_QUERY = gql`
  query ApiOrganizationFromHostedJobsPageName(
    $organizationHostedJobsPageName: String!
    $searchContext: OrganizationSearchContext
  ) {
    organization: organizationFromHostedJobsPageName(
      organizationHostedJobsPageName: $organizationHostedJobsPageName
      searchContext: $searchContext
    ) {
      name
      publicWebsite
    }
  }
`;

export async function fetchJobBoard(company: string): Promise<JobBoard> {
  const data = await client.request<{ jobBoard: JobBoard }>(JOB_BOARD_QUERY, {
    organizationHostedJobsPageName: company,
  });
  const board = data.jobBoard;
  const teamsMap = new Map(board.teams.map((t) => [t.id, t.name]));

  board.jobPostings = board.jobPostings.map((job) => ({
    ...job,
    team: teamsMap.get(job.teamId) || "Other",
    url: `https://jobs.ashbyhq.com/${company}/${job.id}`,
  }));
  return board;
}

export async function fetchJobPosting(company: string, id: string): Promise<JobPostingDetails> {
  const data = await client.request<{ jobPosting: JobPostingDetails }>(JOB_POSTING_QUERY, {
    organizationHostedJobsPageName: company,
    jobPostingId: id,
  });
  const job = data.jobPosting;
  job.url = `https://jobs.ashbyhq.com/${company}/${job.id}`;
  return job;
}

export async function fetchOrganization(company: string): Promise<Organization> {
  const data = await client.request<{ organization: Organization }>(ORG_QUERY, {
    organizationHostedJobsPageName: company,
    searchContext: "JobBoard",
  });
  return data.organization;
}
