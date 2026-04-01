# Ashby CLI

A command-line interface for browsing open positions hosted via [Ashby](https://www.ashbyhq.com/) directly from your terminal.

## Features

- **Job Board:** List all open positions for a company, beautifully formatted and grouped by team.
- **Job Details:** View the full job description (rendered as Markdown) and the application form requirements right in your terminal.
- **JSON Output:** Export data as JSON for easy integration with other tools or scripts.
- **One-liner format:** Job boards are printed in a greppable one-line format, including the standalone Job ID for easy copy-pasting.

## Installation

You can run the CLI immediately using `npx` (or `pnpx`):

```bash
npx @p1va/ashby <company>
```

To install it globally:

```bash
npm install -g @p1va/ashby
# or
pnpm install -g @p1va/ashby
```

## Usage

The primary commands revolve around specifying the company name as it appears in their Ashby URL (e.g., for `https://jobs.ashbyhq.com/Peec`, the company name is `Peec`).

### View a Company's Job Board

```bash
ashby Peec
```

### View a Specific Job's Details

Pass the job ID after the company name. You can copy the ID directly from the Job Board list.

```bash
ashby Peec 5e285378-4223-4c19-8d7b-7c212bc9c827
```

### Export as JSON

Add the `--json` flag to either command to receive structured JSON output.

```bash
ashby Peec --json
ashby Peec 5e285378-4223-4c19-8d7b-7c212bc9c827 --json
```

## Development

This project uses `pnpm` and is built with functional TypeScript. We use `just` as a command runner for development workflows.

### Setup

```bash
git clone https://github.com/p1va/ashby-cli.git
cd ashby-cli
pnpm install
```

### Available Commands

- `just dev <company> [job-id]`: Run the CLI from source via `tsx`.
- `just build`: Compile the TypeScript code to `./dist`.
- `just test`: Run the Vitest test suite.
- `just lint`: Run ESLint.
- `just format`: Format the codebase using Prettier.

### Publishing

Releases are fully automated via GitHub Actions. Pushing a tag starting with `v*` (e.g., `v1.0.0`) will automatically publish the package to NPM.

## License

MIT
