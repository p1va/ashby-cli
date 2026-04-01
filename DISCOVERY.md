# Ashby CLI Discovery

## GraphQL API

- **Endpoint:** `https://jobs.ashbyhq.com/api/non-user-graphql`
- **Method:** POST
- **Content-Type:** `application/json`

## Key Operations

### 1. Job Board Listing (`ApiJobBoardWithTeams`)

- **Query:** `jobBoardWithTeams(organizationHostedJobsPageName: String!)`
- **Returns:** `teams` and `jobPostings`.
- **Job Posting Brief:**
  - `id`, `title`, `locationName`, `workplaceType` (Enum: `OnSite`, `Hybrid`, `Remote`), `employmentType` (Enum: `FullTime`, `PartTime`, `Contract`, `Intern`), `compensationTierSummary`.
- **Teams:** `id`, `name`, `parentTeamId`.

### 2. Job Details (`ApiJobPosting`)

- **Query:** `jobPosting(organizationHostedJobsPageName: String!, jobPostingId: String!)`
- **Returns:** Detailed job information.
- **Key Fields:**
  - `descriptionHtml`: Raw HTML content of the job description.
  - `compensationTiers`: List of compensation details.
  - `teamNames`: List of teams associated with the job.
  - `publishedDate`: Date the job was published.
  - `applicationForm`: Details of the application form (not needed for browsing but available).

### 3. Organization Info (`ApiOrganizationFromHostedJobsPageName`)

- **Query:** `organizationFromHostedJobsPageName(organizationHostedJobsPageName: String!, searchContext: OrganizationSearchContext)`
- **Returns:** Organization name, website, theme colors, and logo URLs.

## Implementation Considerations

### HTML to Terminal

- `descriptionHtml` needs to be parsed. We can use a library like `turndown` to convert HTML to Markdown, and then a Markdown renderer for the terminal, or just strip tags and handle basic formatting manually.

### CLI Structure

- `npx @p1va/ashby {company}` -> Lists jobs.
- `npx @p1va/ashby {company} {job-id}` -> Shows job details.
- Flag `--json` to output raw JSON.

### Tech Stack

- Node.js + TypeScript.
- GraphQL Client: `graphql-request` or just `fetch`.
- CLI Library: `commander` or `yargs`.
- HTML/Markdown: `turndown` + `marked-terminal`.
