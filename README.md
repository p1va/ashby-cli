<div align="center">

# Ashby CLI

A CLI for browsing job openings in Ashby-powered Job Boards.

![NPM Version](https://img.shields.io/npm/v/%40p1va%2Fashby?style=flat)

</div>

## Installation

You can run the CLI immediately with `npx -y @p1va/ashby`

or install it globally and invoke the `ashby` command with `npm install -g @p1va/ashby`.

## Usage

```bash
# Markdown Output
npx -y @p1va/ashby <company-name>
npx -y @p1va/ashby <company-name> <job-id>

# Json Output
npx -y @p1va/ashby <company-name> --json | jq .
npx -y @p1va/ashby <company-name> <job-id> --json | jq .
```

To use the CLI first we need to know thecompany name as it appears in their hosted Ashby URL.

For example Lovable's career page is hosted at `https://jobs.ashbyhq.com/lovable` and their Ashby company name is `lovable`.

#### List Jobs

```bash
# Npx
npx -y @p1va/ashby lovable
npx -y @p1va/ashby lovable --json

# Global installation
ashby lovable
ashby lovable --json
```

#### Job Details

Pass the job ID after the company name. You can either take the ID from the Job Board list or from the URL `https://jobs.ashbyhq.com/lovable/9f4...22d`.

```bash
# Npx
npx -y @p1va/ashby lovable 9f4963e7-be14-4dd9-99ce-05df2f06e22d
npx -y @p1va/ashby lovable 9f4963e7-be14-4dd9-99ce-05df2f06e22d --json | jq .

# Global installation
ashby lovable 9f4963e7-be14-4dd9-99ce-05df2f06e22d
ashby lovable 9f4963e7-be14-4dd9-99ce-05df2f06e22d --json | jq .
```

## Development

- `pnpm install` to install dependencies
- `pnpm dev <company> [job-id]` to run the CLI from source via `tsx`
- To explore Ashby GraphQL API responses
  - `just explore-board "lovable"`
  - `just explore-job "lovable" "264297a0-251c-4d0b-83c1-dc64e1b5d2f3"`

### Publishing

Released via GitHub Actions when a tag starting with `v*` is pushed.

- `pnpm version patch` to increment the version
- `git push --follow-tags` to push the new commit and tag
