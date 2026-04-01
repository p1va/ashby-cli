#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { fetchJobBoard, fetchJobPosting, fetchOrganization } from "./api.js";
import { formatJobBoard, formatJobDetails, formatJobDetailsJson } from "./formatter.js";

const program = new Command();

program
  .name("ashby")
  .description("CLI for browsing open positions hosted via Ashby")
  .version("0.0.1")
  .argument("<company>", "Company name as seen in the Ashby URL")
  .argument("[job-id]", "Optional Job ID to see details")
  .option("--json", "Output raw JSON")
  .action(async (company, jobId, options) => {
    try {
      if (jobId) {
        const job = await fetchJobPosting(company, jobId);
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
          console.log(JSON.stringify({ organization: org, jobs: board.jobPostings }, null, 2));
        } else {
          console.log(formatJobBoard(org, board));
        }
      }
    } catch (error: any) {
      if (error?.response?.errors) {
        // Handle GraphQL errors
        const messages = error.response.errors.map((e: any) => e.message).join(", ");
        console.error(chalk.red(`\nError: ${messages}`));
      } else {
        // Handle other errors (network, not found, etc)
        let message = error.message || String(error);
        if (error.cause && error.cause.message) {
          message += ` (${error.cause.message})`;
        }
        console.error(chalk.red(`\nError: ${message}`));
      }
      process.exit(1);
    }
  });

program.parse();
