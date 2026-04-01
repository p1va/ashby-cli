export function parseAshbyUrl(input: string): { company: string; jobId?: string } | null {
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
