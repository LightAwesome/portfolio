// [lineStart, lineEnd, timeAgo, message]
type BlameEntry = [number, number, string, string];

const blameData: Record<string, BlameEntry[]> = {
  about: [
    [1, 1, "just now", "initial commit"],
    [3, 3, "2h ago", "fix: still figuring out who I am"],
    [5, 8, "1d ago", "chore: update current status"],
    [10, 12, "3d ago", "feat: add setup section"],
    [14, 16, "1d ago", "docs: add links"],
  ],
  stack: [
    [1, 1, "1h ago", "chore: add yet another tool"],
    [3, 5, "2d ago", "feat: python is still the answer"],
    [7, 10, "1w ago", "feat: embrace the full stack"],
    [12, 16, "3d ago", "chore: neovim btw"],
  ],
  experience: [
    [1, 6, "2h ago", "docs: markaba internship"],
    [7, 10, "3d ago", "fix: embellish less"],
  ],
  contact: [
    [1, 1, "1d ago", "feat: please hire me"],
    [3, 3, "2h ago", "fix: update availability"],
    [5, 13, "1d ago", "feat: add contact methods"],
  ],
  projects: [
    [1, 3, "1h ago", "feat: sql engine write-up"],
    [4, 8, "2d ago", "feat: rootstock — 3rd place btw"],
  ],
};

export function getBlame(bufferId: string, lineNum: number): BlameEntry | null {
  const entries = blameData[bufferId];
  if (!entries) return null;
  return (
    entries.find(([start, end]) => lineNum >= start && lineNum <= end) ?? null
  );
}
