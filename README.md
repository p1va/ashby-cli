<div align="center">

# Ashby CLI

A CLI for browsing job openings in Ashby-powered Job Boards.

![NPM Version](https://img.shields.io/npm/v/%40p1va%2Fashby?style=flat)

</div>

## Installation

You can run the CLI immediately with `npx -y @p1va/ashby`

or install it globally with `npm install -g @p1va/ashby` and invoke the `ashby` command.

## Usage

The CLI supports both direct company names and full Ashby URLs.

```bash
# Markdown output
npx -y @p1va/ashby <company-name>
npx -y @p1va/ashby <company-name> <job-id>
npx -y @p1va/ashby <board-or-job-url>

# JSON output
npx -y @p1va/ashby <company-name> --json | jq .
npx -y @p1va/ashby <company-name> <job-id> --json | jq .
npx -y @p1va/ashby <board-or-job-url> --json | jq .
```

The CLI expects either the URL of the hosted Ashby board or just the company slug.

For example Lovable's career page is hosted at `https://jobs.ashbyhq.com/lovable` and their Ashby company slug is `lovable`.

#### List Jobs

```bash
# npx, markdown output
npx -y @p1va/ashby lovable
npx -y @p1va/ashby https://jobs.ashbyhq.com/lovable

# global installation, markdown output
ashby lovable
ashby https://jobs.ashbyhq.com/lovable
```

#### Job Details

To see the details of a job the CLI expects either pass the company slug plus the job id from the previous step or the URL `https://jobs.ashbyhq.com/lovable/9f4...22d` for the job opening directly.

```bash
# npx, markdown output
npx -y @p1va/ashby lovable 99f4963e7-be14-4dd9-99ce-05df2f06e22d
npx -y @p1va/ashby https://jobs.ashbyhq.com/lovable/99f4963e7-be14-4dd9-99ce-05df2f06e22d

# global installation, markdown output
ashby lovable 99f4963e7-be14-4dd9-99ce-05df2f06e22d
ashby https://jobs.ashbyhq.com/lovable/99f4963e7-be14-4dd9-99ce-05df2f06e22d
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
