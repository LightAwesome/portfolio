import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store";
import {
  getResponse,
  COMMANDS,
  type OutputLine,
} from "@/data/terminalCommands";
import { NeofetchOutput } from "./NeofetchOutput";
import styles from "./TerminalBuffer.module.css";

interface HistoryEntry {
  cmd: string;
  lines: OutputLine[];
  isNeofetch: boolean;
}

// Welcome output shown on mount
const WELCOME: OutputLine[] = [
  { text: "mohammed@portfolio — terminal", color: "green" },
  { text: "" },
  { text: "Available commands:", color: "yellow" },
  ...COMMANDS.map((c) => ({
    text: `  ${c.name.padEnd(18)} ${c.description}`,
  })),
  { text: "" },
  { text: 'type "help" to see this again · Tab to autocomplete', color: "dim" },
  { text: "" },
];

export function TerminalBuffer() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const setBuffer = useStore((s) => s.setBuffer);

  // Auto-scroll on new output
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Compute autocomplete suggestion whenever input changes
  useEffect(() => {
    if (!input.trim()) {
      setSuggestion("");
      return;
    }
    const q = input.toLowerCase();
    const match = COMMANDS.find((c) => c.name.startsWith(q) && c.name !== q);
    setSuggestion(match ? match.name : "");
  }, [input]);

  const submit = () => {
    const cmd = input.trim();
    if (!cmd) return;
    setCmdHistory((h) => [cmd, ...h]);
    setCmdIndex(-1);
    setInput("");
    setSuggestion("");

    if (cmd.toLowerCase() === "neofetch") {
      setHistory((h) => [...h, { cmd, lines: [], isNeofetch: true }]);
      return;
    }

    const response = getResponse(cmd, setBuffer);
    setHistory((h) => [
      ...h,
      { cmd, lines: response.lines, isNeofetch: false },
    ]);
    if (response.action) setTimeout(response.action, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
      return;
    }

    // Tab — accept autocomplete suggestion
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setSuggestion("");
      }
      return;
    }

    // Arrow up — previous command
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cmdIndex + 1, cmdHistory.length - 1);
      setCmdIndex(next);
      setInput(cmdHistory[next] ?? "");
      return;
    }

    // Arrow down — newer command
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(cmdIndex - 1, -1);
      setCmdIndex(next);
      setInput(next === -1 ? "" : (cmdHistory[next] ?? ""));
      return;
    }
  };

  const PromptLabel = () => (
    <>
      <span className={styles.user}>mohammed</span>
      <span className={styles.at}>@</span>
      <span className={styles.host}>portfolio</span>
      <span className={styles.colon}>:</span>
      <span className={styles.path}>~</span>
      <span className={styles.dollar}>$ </span>
    </>
  );

  return (
    <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
      {/* Login line */}
      <div className={styles.boot}>
        Last login: {new Date().toLocaleString()} on ttys001
      </div>

      {/* Welcome / command list */}
      {WELCOME.map((line, i) => (
        <div
          key={`welcome-${i}`}
          className={`${styles.output} ${line.color ? styles[line.color] : ""}`}
        >
          {line.text || "\u00A0"}
        </div>
      ))}

      {/* Command history */}
      {history.map((entry, i) => (
        <div key={i} className={styles.entry}>
          <div className={styles.promptLine}>
            <PromptLabel />
            <span className={styles.cmd}>{entry.cmd}</span>
          </div>
          {entry.isNeofetch ? (
            <NeofetchOutput />
          ) : (
            entry.lines.map((line, j) => (
              <div
                key={j}
                className={`${styles.output} ${line.color ? styles[line.color] : ""}`}
              >
                {line.text || "\u00A0"}
              </div>
            ))
          )}
        </div>
      ))}

      {/* Current input line */}
      <div className={styles.promptLine}>
        <PromptLabel />
        <span className={styles.inputWrapper}>
          {/* Ghost suggestion behind real input */}
          <span className={styles.suggestionWrapper} aria-hidden>
            <span className={styles.suggestionTyped}>{input}</span>
            <span className={styles.suggestionGhost}>
              {suggestion ? suggestion.slice(input.length) : ""}
            </span>
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </span>
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
