import { describe, it, expect } from "vitest";
import { formatJobBoard } from "./formatter.js";
import { Organization, JobBoard } from "./types.js";

describe("formatter", () => {
  it("should format job board correctly", () => {
    const org: Organization = {
      name: "Test Org",
      publicWebsite: "https://test.com",
    };
    const board: JobBoard = {
      teams: [{ id: "t1", name: "Engineering", parentTeamId: null }],
      jobPostings: [
        {
          id: "j1",
          title: "Software Engineer",
          teamId: "t1",
          team: "Engineering",
          locationName: "London",
          workplaceType: "Remote",
          employmentType: "FullTime",
          compensationTierSummary: "£100k",
          url: "https://jobs.ashbyhq.com/test/j1",
        },
      ],
    };

    const output = formatJobBoard(org, board);
    expect(output).toContain("Job Board for Test Org");
    expect(output).toContain("Software Engineer");
    expect(output).toContain("Engineering");
    expect(output).toContain("London");
    expect(output).toContain("Remote");
    expect(output).toContain("FullTime");
    expect(output).toContain("£100k");
  });
});
