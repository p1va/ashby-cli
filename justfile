# justfile for Ashby CLI exploration

# List all recipes
help:
    @just --list

export ENDPOINT := "https://jobs.ashbyhq.com/api/non-user-graphql"

# Build the project
build:
    pnpm build

# Run unit tests
test:
    pnpm test

# Lint the project
lint:
    pnpm lint

# Format the project
format:
    pnpm format

# Run the project in dev mode
dev *args:
    pnpm dev {{args}}

# Clean build artifacts
clean:
    rm -rf dist

# Exploration recipes (from discovery phase)

# Get the job board and teams for a company
explore-board company="Peec":
    curl -s -X POST {{ENDPOINT}}?op=ApiJobBoardWithTeams \
    -H 'content-type: application/json' \
    --data-raw '{"operationName":"ApiJobBoardWithTeams","variables":{"organizationHostedJobsPageName":"{{company}}"},"query":"query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) { jobBoard: jobBoardWithTeams(organizationHostedJobsPageName: $organizationHostedJobsPageName) { teams { id name externalName parentTeamId __typename } jobPostings { id title teamId locationId locationName workplaceType employmentType secondaryLocations { ...JobPostingSecondaryLocationParts __typename } compensationTierSummary __typename } __typename } } fragment JobPostingSecondaryLocationParts on JobPostingSecondaryLocation { locationId locationName __typename }"}' \
    | jq .

# Get job posting details
explore-job id company="Peec":
    curl -s -X POST "{{ENDPOINT}}?op=ApiJobPosting" \
    -H 'content-type: application/json' \
    --data-raw "{\"operationName\":\"ApiJobPosting\",\"variables\":{\"organizationHostedJobsPageName\":\"{{company}}\",\"jobPostingId\":\"{{id}}\"},\"query\":\"query ApiJobPosting(\$organizationHostedJobsPageName: String!, \$jobPostingId: String!) { jobPosting(organizationHostedJobsPageName: \$organizationHostedJobsPageName jobPostingId: \$jobPostingId) { id title departmentName departmentExternalName locationName locationAddress workplaceType employmentType descriptionHtml isListed isConfidential teamNames secondaryLocationNames compensationTierSummary compensationTiers { id title tierSummary __typename } applicationDeadline compensationTierGuideUrl scrapeableCompensationSalarySummary compensationPhilosophyHtml applicationLimitCalloutHtml shouldAskForTextingConsent candidateTextingPrivacyPolicyUrl candidateTextingTermsAndConditionsUrl legalEntityNameForTextingConsent automatedProcessingLegalNotice { automatedProcessingLegalNoticeRuleId automatedProcessingLegalNoticeHtml __typename } applicationForm { id sections { title descriptionHtml fieldEntries { id field isRequired descriptionHtml } } } __typename } }\"}" \
    | jq .
