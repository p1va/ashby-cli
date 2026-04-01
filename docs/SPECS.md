# Ashby CLI

We would like to build a CLI for browsing open positions hosted via Ashby from the terminal.

Hosted job boards are embedded in company websites but also have their own standalone URL.

## Context

To power these boards there is a `https://jobs.ashbyhq.com/api/non-user-graphql` API.

### GraphQL Schema

The schema can be pulled at:

```sh
curl 'https://jobs.ashbyhq.com/api/non-user-graphql' -H 'content-type: application/json' --data-raw '{"query":"query { __schema { queryType { fields { name } } mutationType { fields { name } } } }"}' | jq . > schema.json
```

Find the result in `schema.json`

### Job Board

To see a company openings the hosted page looks like this: `https://jobs.ashbyhq.com/Peec/`

From the newtwork tab these two requests are made to retrieve everything needed

**ApiJobBoardWithTeams**

`POST https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiJobBoardWithTeams`

```json
{
  "operationName": "ApiJobBoardWithTeams",
  "variables": { "organizationHostedJobsPageName": "Peec" },
  "query": "query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {\n  jobBoard: jobBoardWithTeams(\n    organizationHostedJobsPageName: $organizationHostedJobsPageName\n  ) {\n    teams {\n      id\n      name\n      externalName\n      parentTeamId\n      __typename\n    }\n    jobPostings {\n      id\n      title\n      teamId\n      locationId\n      locationName\n      workplaceType\n      employmentType\n      secondaryLocations {\n        ...JobPostingSecondaryLocationParts\n        __typename\n      }\n      compensationTierSummary\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment JobPostingSecondaryLocationParts on JobPostingSecondaryLocation {\n  locationId\n  locationName\n  __typename\n}"
}
```

**ApiOrganizationFromHostedJobsPageName**

`POST https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiOrganizationFromHostedJobsPageName`

```json
{
  "operationName": "ApiOrganizationFromHostedJobsPageName",
  "variables": { "organizationHostedJobsPageName": "Peec", "searchContext": "JobBoard" },
  "query": "query ApiOrganizationFromHostedJobsPageName($organizationHostedJobsPageName: String!, $searchContext: OrganizationSearchContext) {\n  organization: organizationFromHostedJobsPageName(\n    organizationHostedJobsPageName: $organizationHostedJobsPageName\n    searchContext: $searchContext\n  ) {\n    ...OrganizationParts\n    __typename\n  }\n}\n\nfragment OrganizationParts on Organization {\n  name\n  publicWebsite\n  customJobsPageUrl\n  hostedJobsPageSlug\n  allowJobPostIndexing\n  theme {\n    colors\n    showJobFilters\n    showLocationAddress\n    showTeams\n    showAutofillApplicationsBox\n    logoWordmarkImageUrl\n    logoSquareImageUrl\n    applicationSubmittedSuccessMessage\n    jobBoardTopDescriptionHtml\n    jobBoardBottomDescriptionHtml\n    jobPostingBackUrl\n    __typename\n  }\n  appConfirmationTrackingPixelHtml\n  recruitingPrivacyPolicyUrl\n  activeFeatureFlags\n  timezone\n  candidateScheduleCancellationReasonRequirementStatus\n  showCookieBanner\n  __typename\n}"
}
```

### Job Details

From the list of opening it is possible to filter by Team or something else which i suspect might be customizable.
`https://jobs.ashbyhq.com/Peec/5e285378-4223-4c19-8d7b-7c212bc9c827`

Under the hood we see these two requests:

**ApiOrganizationFromHostedJobsPageName** (Same as before)

`POST https://jobs.ashbyhq.com/api/non-user-graphql?op=ApiOrganizationFromHostedJobsPageName`

```json
{
  "operationName": "ApiOrganizationFromHostedJobsPageName",
  "variables": { "organizationHostedJobsPageName": "Peec", "searchContext": "JobPosting" },
  "query": "query ApiOrganizationFromHostedJobsPageName($organizationHostedJobsPageName: String!, $searchContext: OrganizationSearchContext) {\n  organization: organizationFromHostedJobsPageName(\n    organizationHostedJobsPageName: $organizationHostedJobsPageName\n    searchContext: $searchContext\n  ) {\n    ...OrganizationParts\n    __typename\n  }\n}\n\nfragment OrganizationParts on Organization {\n  name\n  publicWebsite\n  customJobsPageUrl\n  hostedJobsPageSlug\n  allowJobPostIndexing\n  theme {\n    colors\n    showJobFilters\n    showLocationAddress\n    showTeams\n    showAutofillApplicationsBox\n    logoWordmarkImageUrl\n    logoSquareImageUrl\n    applicationSubmittedSuccessMessage\n    jobBoardTopDescriptionHtml\n    jobBoardBottomDescriptionHtml\n    jobPostingBackUrl\n    __typename\n  }\n  appConfirmationTrackingPixelHtml\n  recruitingPrivacyPolicyUrl\n  activeFeatureFlags\n  timezone\n  candidateScheduleCancellationReasonRequirementStatus\n  showCookieBanner\n  __typename\n}"
}
```

**ApiJobPosting**

`POST https://jobs.ashbyhq.com/api/non-user-graphql&op=ApiJobPosting`

```json
{
  "operationName": "ApiJobPosting",
  "variables": {
    "organizationHostedJobsPageName": "Peec",
    "jobPostingId": "5e285378-4223-4c19-8d7b-7c212bc9c827"
  },
  "query": "query ApiJobPosting($organizationHostedJobsPageName: String!, $jobPostingId: String!) {\n  jobPosting(\n    organizationHostedJobsPageName: $organizationHostedJobsPageName\n    jobPostingId: $jobPostingId\n  ) {\n    id\n    title\n    departmentName\n    departmentExternalName\n    locationName\n    locationAddress\n    workplaceType\n    employmentType\n    descriptionHtml\n    isListed\n    isConfidential\n    teamNames\n    applicationForm {\n      ...FormRenderParts\n      __typename\n    }\n    surveyForms {\n      ...FormRenderParts\n      __typename\n    }\n    secondaryLocationNames\n    compensationTierSummary\n    compensationTiers {\n      id\n      title\n      tierSummary\n      __typename\n    }\n    applicationDeadline\n    compensationTierGuideUrl\n    scrapeableCompensationSalarySummary\n    compensationPhilosophyHtml\n    applicationLimitCalloutHtml\n    shouldAskForTextingConsent\n    candidateTextingPrivacyPolicyUrl\n    candidateTextingTermsAndConditionsUrl\n    legalEntityNameForTextingConsent\n    automatedProcessingLegalNotice {\n      automatedProcessingLegalNoticeRuleId\n      automatedProcessingLegalNoticeHtml\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment JSONBoxParts on JSONBox {\n  value\n  __typename\n}\n\nfragment FileParts on File {\n  id\n  filename\n  __typename\n}\n\nfragment FormFieldEntryParts on FormFieldEntry {\n  id\n  field\n  fieldValue {\n    ... on JSONBox {\n      ...JSONBoxParts\n      __typename\n    }\n    ... on File {\n      ...FileParts\n      __typename\n    }\n    ... on FileList {\n      files {\n        ...FileParts\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  isRequired\n  descriptionHtml\n  isHidden\n  __typename\n}\n\nfragment FormRenderParts on FormRender {\n  id\n  formControls {\n    identifier\n    title\n    __typename\n  }\n  errorMessages\n  sections {\n    title\n    descriptionHtml\n    fieldEntries {\n      ...FormFieldEntryParts\n      __typename\n    }\n    isHidden\n    __typename\n  }\n  sourceFormDefinitionId\n  __typename\n}"
}
```

## CLI

We would like to build a CLI application that either via npx or uvx can be quickly executed to see the job board and job details in the terminal both in human readable format and in JSON.

The CLI should look like

`npx @p1va/ashby {company-name}` to list jobs opening and probably filter. I believe that at this stage we might know things like salary bands, location, whether is hybrid, of course title but these things might be dynamic.

The format should be something that allow grepping for keywords.

If teams are a first class member maybe we could just allow filtering for it but i guess would be hard to anticipate which team a job role is before hand.

Then we might need to include the job GUID if we want to inspect its details.

For job details the CLI should be something where we pass `npx @p1va/ashby {company-name} {job-id}` although TBD the exact shape. I wonder if they have anything in the schema that would allow to pull a job just from ID alone. Something worth checking.

Here the output should be the content of the job description that likely comes in HTML so we might need to parse to markdown or strip tags away. Plus showing all of the details like location, salary band etc and the details requiered to provide to apply. etc typically forms with "why do you want to work here?" etc. Ideally this page is offered both in JSON and markdown

## Format

Output can be controlled with a --json or --output json flag. Defaults to human text or maybe markdown

## Tech Stack

I am leaning towards going for a node CLI with TS like we did in the past. check ../symbols to see how we configured things there like strict rules and code style. It's a rather easy CLI pulling data from GraphQL so i guess there might be good libraries there we can rely on for the interaction. My only unknown is how the shape of the job details will be and how to clean it up in typescript. I know in python that is very doable.

## Phases

1. Understanding of what we want to build and identifying things that are to be investigated as they will inform our decisions
2. Explore the API response schema using curl and inspect real responses so that we understand in which shape the data comes from
3. Explore APIs outside of the ones i mentioned to see which possibilities we have other than this basic use case we described. Not interested in appylying from the CLI. Not keen to create something that could be used to spam companies with junk applications.
4. Let's capture all of our findings in a markdown doc with context on the findings
5. Move on to implementation phase where we can go with our TS cli option if all unknowns have been figured out
6. test

I want to stress the importance to set things up in a way that allows for easy iteration and exercising of APIs.

For example when doing the exploration i think we could be writing a justfile that wraps our curl requests like we did in ./symbols as that is self discoverable by agents and they can quickly see what they can exercise

For the code we need to first find a way to exercise the API via some sort of client (we will figure out best practices in TS) and then have a suite of tests that don't run as part of the testing suite that we run ad hoc to exercise the bit we are working on.

Same thing when we develop the visualization layer. We need a nice test harness so that we test all small bits in isolation and can exercise them. Then once done we just simply wire them into the CLI but it could easily be another medium e.g. API, MCP.
