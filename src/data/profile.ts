import { currentRole } from "./experience";

const school = "UBC BSc CS, May 2028";
const seeking = "Summer 2027 internship";

export const profile = {
  name: "Mohammed Touseef Ansari",
  email: "welcometouseef@gmail.com",
  school,
  seeking,
  // `now` comes from the current role in experience.ts, so changing jobs is a one-place edit.
  facts: [
    ...(currentRole ? [{ label: "now", value: [currentRole.company, currentRole.place].filter(Boolean).join(", "), now: true }] : []),
    { label: "school", value: school },
    { label: "seeking", value: seeking },
  ],
  // Set once resume.pdf is in public/. Until then the link explains instead of 404ing.
  resume: null as string | null,
  links: [
    { label: "github", href: "https://github.com/LightAwesome" },
    { label: "linkedin", href: "https://www.linkedin.com/in/mohammed-touseef-ansari" },
  ],
  status: `${seeking} │ UBC CS May 2028`,
};
