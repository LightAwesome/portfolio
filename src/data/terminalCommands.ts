// Command manifest — single source of truth for what exists
export interface CommandDef {
  name: string;
  description: string;
}

export const COMMANDS: CommandDef[] = [
  { name: "whoami", description: "who is this guy" },
  { name: "ls", description: "list portfolio files" },
  { name: "cat about.md", description: "print about section" },
  { name: "history", description: "shell history (curated)" },
  { name: "pwd", description: "current directory" },
  { name: "uname -a", description: "system info" },
  { name: "date", description: "current date/time" },
  { name: "uptime", description: "time since page load" },
  { name: "open github", description: "open github.com/LightAwesome" },
  { name: "neofetch", description: "the good stuff" },
  { name: "help", description: "show this list" },
  { name: "exit", description: "close terminal buffer" },
];

export const FAKE_HISTORY = [
  "    1  nvim .",
  "    2  yabai --restart-service",
  "    3  brew install tree",
  "    4  brew install fzf",
  "    5  brew install yet-another-thing",
  '    6  git commit -m "fix: fix the fix"',
  '    7  git commit -m "fix: fix the fix (for real)"',
  '    8  tmux new -s "definitely-working"',
  "    9  nvim ~/.config/nvim/init.lua",
  "   10  open http://localhost:5173",
];

export interface OutputLine {
  text: string;
  color?: "green" | "yellow" | "red" | "blue" | "dim";
}

export interface TerminalResponse {
  lines: OutputLine[];
  action?: () => void;
}

export function getResponse(
  cmd: string,
  setBuffer: (id: any) => void,
): TerminalResponse {
  const c = cmd.trim().toLowerCase();

  if (c === "whoami")
    return {
      lines: [
        { text: "mohammed touseef ansari", color: "green" },
        { text: "cs @ ubc · software & automation developer" },
        { text: "python, typescript, systems, ml pipelines" },
      ],
    };

  if (c === "ls" || c === "ls -la")
    return {
      lines: [
        { text: "drwxr-xr-x  about.md", color: "blue" },
        { text: "drwxr-xr-x  projects/", color: "blue" },
        { text: "-rw-r--r--  stack.toml" },
        { text: "-rw-r--r--  experience.log" },
        { text: "-rwxr-xr-x  contact.sh", color: "green" },
      ],
    };

  if (c === "cat about.md")
    return {
      lines: [
        { text: "# Mohammed Touseef Ansari", color: "yellow" },
        { text: "" },
        { text: "CS @ UBC, graduating May 2027." },
        { text: "I build data pipelines, query engines, and RAG systems." },
        { text: "Previously: Markaba (Riyadh) — scraping, fintech, OCR." },
      ],
    };

  if (c === "history") return { lines: FAKE_HISTORY.map((text) => ({ text })) };

  if (c === "open github" || c === "open github.com")
    return {
      lines: [{ text: "Opening github.com/LightAwesome..." }],
      action: () => window.open("https://github.com/LightAwesome"),
    };

  if (c === "pwd") return { lines: [{ text: "/home/mohammed/portfolio" }] };

  if (c === "uname" || c === "uname -a")
    return { lines: [{ text: "Darwin portfolio 23.0.0 macOS 14.0 arm64" }] };

  if (c === "date") return { lines: [{ text: new Date().toString() }] };

  if (c === "uptime")
    return {
      lines: [
        {
          text: `up ${Math.floor(Math.random() * 30) + 1} days, running on caffeine`,
        },
      ],
    };

  if (c === "exit" || c === "quit")
    return {
      lines: [{ text: "Closing terminal buffer...", color: "dim" }],
      action: () => setBuffer("about"),
    };

  if (c === "neofetch") return { lines: [] }; // handled in component

  if (c === "help" || c === "--help")
    return {
      lines: [
        { text: "Available commands:", color: "yellow" },
        { text: "" },
        ...COMMANDS.map((cmd) => ({
          text: `  ${cmd.name.padEnd(18)} ${cmd.description}`,
        })),
      ],
    };

  return {
    lines: [{ text: `bash: ${cmd}: command not found`, color: "red" }],
  };
}
