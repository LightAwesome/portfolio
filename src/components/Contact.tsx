import { useRef, useState, type FormEvent } from "react";
import { profile } from "@/data/profile";
import { useBufferApi } from "@/editor/context";
import Line, { Heading } from "./Line";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const buf = useBufferApi();
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const insert = () => buf?.setMode("INSERT");
  const normal = () => buf?.setMode("NORMAL");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = Object.fromEntries(new FormData(f)) as Record<string, string>;
    if (!EMAIL.test((data.from ?? "").trim())) { buf?.say("Add your email after from: so I can reply.", true); (f.elements.namedItem("from") as HTMLElement).focus(); return; }
    if (!(data.message ?? "").trim()) { buf?.say("The message is empty. Write a line or two, then send.", true); (f.elements.namedItem("message") as HTMLElement).focus(); return; }
    setSending(true);
    buf?.say("Sending...");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(String(res.status));
      buf?.say("Sent. I'll reply to your email soon.");
      f.reset();
    } catch {
      buf?.say(`Not sent. Email ${profile.email} instead.`, true);
    } finally {
      setSending(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      buf?.say(`Copied ${profile.email}`);
    } catch {
      buf?.say(`Copy is blocked here. The address is ${profile.email}`);
    }
  }

  return (
    <section id="contact" data-sec="contact" aria-labelledby="h-contact">
      <Heading id="contact">contact</Heading>
      <Line />
      <form id="mailform" ref={formRef} noValidate onSubmit={onSubmit}>
        <Line>
          <span className="field">
            <label htmlFor="from">from:</label>
            <input id="from" name="from" type="email" autoComplete="email" placeholder="you@company.com" required onFocus={insert} onBlur={normal} />
          </span>
        </Line>
        <Line>
          <label htmlFor="message" className="sr">Message</label>
          <textarea
            id="message" name="message" placeholder="Hi Touseef, I'm hiring for..." required onFocus={insert} onBlur={normal}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); formRef.current?.requestSubmit(); } }}
          />
        </Line>
        <div className="sr">
          <label htmlFor="website">Leave this empty</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <Line>
          <span className="actions">
            <button className="send" type="submit" disabled={sending}>{sending ? "Sending..." : "Send message"}</button>
            <span className="c">or Ctrl+Enter</span>
          </span>
        </Line>
      </form>
      <Line />
      <Line>
        Prefer email? <span className="co">{profile.email}</span>{" "}
        <button className="copy" type="button" onClick={copy}>{copied ? "copied" : "copy"}</button>
      </Line>
    </section>
  );
}
