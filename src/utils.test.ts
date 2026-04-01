import { describe, it, expect } from "vitest";
import { parseAshbyUrl } from "./utils.js";

describe("parseAshbyUrl", () => {
  it("should return null for non-URLs", () => {
    expect(parseAshbyUrl("not-a-url")).toBeNull();
    expect(parseAshbyUrl("lovable")).toBeNull();
  });

  it("should return null for non-Ashby URLs", () => {
    expect(parseAshbyUrl("https://google.com/lovable")).toBeNull();
  });

  it("should parse company from board URL", () => {
    expect(parseAshbyUrl("https://jobs.ashbyhq.com/lovable")).toEqual({
      company: "lovable",
      jobId: undefined,
    });
    // With trailing slash
    expect(parseAshbyUrl("https://jobs.ashbyhq.com/lovable/")).toEqual({
      company: "lovable",
      jobId: undefined,
    });
  });

  it("should parse company and job ID from posting URL", () => {
    expect(parseAshbyUrl("https://jobs.ashbyhq.com/lovable/123-456")).toEqual({
      company: "lovable",
      jobId: "123-456",
    });
  });

  it("should ignore query parameters", () => {
    expect(parseAshbyUrl("https://jobs.ashbyhq.com/lovable?foo=bar")).toEqual({
      company: "lovable",
      jobId: undefined,
    });
  });
});
