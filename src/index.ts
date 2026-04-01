#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { fetchJobBoard, fetchJobPosting, fetchOrganization } from "./api.js";
import {
  formatJobBoard,
  formatJobBoardJson,
  formatJobDetails,
  formatJobDetailsJson,
} from "./formatter.js";
import { parseAshbyUrl } from "./utils.js";

const program = new Command();

program
  .name("ashby")
  .description("CLI for browsing open positions hosted via Ashby")
  .version("0.0.1")
  .argument("<input>", "Company name or Ashby job board/posting URL")
  .argument("[job-id]", "Job ID (if not provided in the URL)")
  .option("--json", "Output raw JSON")
  .addHelpText(
    "after",
    `
Examples:
  $ ashby lovable                                      # List jobs for a company
  $ ashby https://jobs.ashbyhq.com/lovable             # List jobs from board URL
  $ ashby lovable 9f4963e7-be14-4dd9-99ce-05df2f06e22d # View specific job
  $ ashby https://jobs.ashbyhq.com/lovable/9f4963e7    # View job from posting URL
  $ ashby lovable --json                               # Export board as JSON
`
  )
  .action(async (input, jobId, options) => {
    try {
      let company = input;
      let targetJobId = jobId;

      const parsed = parseAshbyUrl(input);
      if (parsed) {
        company = parsed.company;
        targetJobId = parsed.jobId || jobId;
      }

      if (targetJobId) {
        const job = await fetchJobPosting(company, targetJobId);
        if (options.json) {
          console.log(JSON.stringify(formatJobDetailsJson(job), null, 2));
        } else {
          console.log(formatJobDetails(job));
        }
      } else {
        const [org, board] = await Promise.all([
          fetchOrganization(company),
          fetchJobBoard(company),
        ]);
        if (options.json) {
          console.log(JSON.stringify(formatJobBoardJson(org, board), null, 2));
        } else {
          console.log(formatJobBoard(org, board));
        }
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { errors?: { message: string }[] };
        message?: string;
        cause?: Error;
      };
      if (err?.response?.errors) {
        // Handle GraphQL errors
        const messages = err.response.errors.map((e) => e.message).join(", ");
        console.error(chalk.red(`\nError: ${messages}`));
      } else {
        // Handle other errors (network, not found, etc)
        let message = err.message || String(error);
        if (err.cause && err.cause.message) {
          message += ` (${err.cause.message})`;
        }
        console.error(chalk.red(`\nError: ${message}`));
      }
      process.exit(1);
    }
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
