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

const program = new Command();

function parseAshbyUrl(input: string): { company: string; jobId?: string } | null {
  try {
    const url = new URL(input);
    if (url.hostname !== "jobs.ashbyhq.com") return null;

    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;

    return {
      company: segments[0],
      jobId: segments[1],
    };
  } catch {
    return null;
  }
}

program
  .name("ashby")
  .description("CLI for browsing open positions hosted via Ashby")
  .version("0.0.1")
  .argument("<company-or-url>", "Company name or Ashby job board URL")
  .argument("[job-id]", "Optional Job ID to see details")
  .option("--json", "Output raw JSON")
  .action(async (companyOrUrl, jobId, options) => {
    try {
      let company = companyOrUrl;
      let targetJobId = jobId;

      const parsed = parseAshbyUrl(companyOrUrl);
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
