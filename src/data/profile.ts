export const profile = {
  name: "Mohammed Touseef Ansari",
  email: "welcometouseef@gmail.com",
  // Each fact is one column of the hero's fact line.
  facts: [
    { label: "now", value: "Inverted AI, Vancouver" },
    { label: "school", value: "UBC BSc CS, May 2028" },
    { label: "seeking", value: "Summer 2027 internship" },
  ],
  // Set once resume.pdf is in public/. Until then the link explains instead of 404ing.
  resume: null as string | null,
  links: [
    { label: "github", href: "https://github.com/LightAwesome" },
    { label: "linkedin", href: "https://www.linkedin.com/in/mohammed-touseef-ansari" },
  ],
  status: "Summer 2027 internship │ UBC CS May 2028",
};
