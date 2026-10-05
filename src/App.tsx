import { useRef } from "react";
import { BufferContext } from "@/editor/context";
import { useEditor } from "@/editor/useEditor";
import { Statusline, Tabline } from "@/components/Bars";
import Line, { Heading } from "@/components/Line";
import Hero from "@/components/Hero";
import Help from "@/components/Help";
import ProjectPicker from "@/components/ProjectPicker";
import Experience from "@/components/Experience";
import Stack from "@/components/Stack";
import Contact from "@/components/Contact";

const TILDES = 6;

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const buf = useEditor(mainRef);

  return (
    <BufferContext.Provider value={buf}>
      <Tabline />
      <main className="buf" ref={mainRef}>
        <Hero />
        <Help />
        <section id="projects" data-sec="projects" aria-labelledby="h-projects">
          <Heading id="projects">projects</Heading>
          <Line />
          <ProjectPicker />
          <Line />
        </section>
        <Experience />
        <Stack />
        <Contact />
        <div aria-hidden="true">
          {Array.from({ length: TILDES }, (_, i) => (
            <div key={i} className="r tilde"><span className="nr">~</span><div className="tx" /></div>
          ))}
        </div>
      </main>
      <Statusline />
    </BufferContext.Provider>
  );
}
