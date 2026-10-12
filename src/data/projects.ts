/** Portfolio entries rendered by SelectedSystems.astro and the /work/ pages. */

export type ProjectArt = 'grid' | 'rings' | 'iso' | 'pins' | 'flow';

export interface Project {
  /** Two-digit id, also used to namespace SVG defs (must be unique). */
  index: string;
  /** Stable, public route segment for the project record. */
  slug: string;
  title: string;
  /** The setting in a few words. */
  context: string;
  year: string;
  role: string;
  /** One sentence, ≤ 160 chars — used for cards and <meta description>. */
  description: string;
  /** The framing question the project had to answer, ≤ 110 chars. */
  question: string;
  /** The key decision or insight, 1–2 sentences. */
  move: string;
  /** 3–4 concrete things done or decided, one sentence each. */
  approach: string[];
  /** Factual outcome, one sentence. */
  outcome: string;
  /** One-sentence reflection on how the project changed his thinking. */
  learned: string;
  tags: string[];
  art: ProjectArt;
  /** True when the project is previewed on the homepage's featured section. */
  featured?: boolean;
}

// TODO(content-review): Confirm ongoing permission to publish each client project
// and its current public URL before adding external project links or screenshots.
export const projects: Project[] = [
  {
    index: '01',
    slug: 'dashboard-dinas-kehutanan-jawa-barat',
    art: 'grid',
    title: 'West Java Forestry Dashboard',
    context: 'Braga Technologies · West Java Forestry Service',
    year: '2022',
    role: 'Frontend Developer',
    featured: true,
    description:
      'A geospatial dashboard for West Java forestry data, built around layered vector-tile maps rendered with MapLibre and MapTiler.',
    question: 'How do you show a whole province of forestry data without drowning the map?',
    move: 'I treated the map as the product and the layers as its vocabulary. Each page got a fixed set of vector-tile layers, and a small Fastify service supplied the tiles.',
    approach: [
      'Split the stack by job: React and Vite for the interface, Directus for content, and a small Fastify API for vector-tile data.',
      'Planned the layers per page: at least five or six on the map page, at least three on the main page.',
      'Chose React context over Redux because the shared state was small enough not to need more.',
      'Packaged the services in Docker so the same setup ran on the server.',
    ],
    outcome:
      'Delivered the dashboard on a provincial government site, with layered vector-tile maps on its map and main pages.',
    learned:
      'A wrong layer definition scatters every coordinate on the map, so I learned to verify the data model before the visuals.',
    tags: ['React/Vite', 'MapLibre', 'WebGL', 'Directus', 'Docker'],
  },
  {
    index: '02',
    slug: 'sean-cso-website',
    art: 'rings',
    title: 'SEAN-CSO Website',
    context: 'PeaceGeneration Indonesia · Deakin University collaboration',
    year: '2022–23',
    role: 'Website Project Manager',
    featured: true,
    description:
      'A WordPress resource and blogging platform on Southeast Asian social issues, delivered by acting as liaison between management and developers.',
    question:
      'What does a project manager do when the job is to connect management and developers?',
    move: 'The work was translation. I took management feedback, organized it, and argued for the best technical answer where the two sides disagreed.',
    approach: [
      'Organized the recurring meetings between management and the development team.',
      'Checked developer progress and oversaw the website as it took shape.',
      'Listened to management feedback, sorted it, and made the case for the best solution to technical issues.',
      'Kept the build on Bedrock WordPress with Tailwind CSS and custom plugins, deployed on a shared VPS with a SQL database.',
    ],
    outcome:
      'Delivered the SEAN-CSO website for the Deakin University and PeaceGeneration collaboration, deployed on a shared VPS.',
    learned:
      'Leading delivery means turning feedback into decisions both sides can act on, and that changed how I think about the gap between people and code.',
    tags: ['Bedrock WordPress', 'PHP', 'Tailwind CSS', 'SQL', 'Delivery'],
  },
  {
    index: '03',
    slug: 'testcov-id',
    art: 'pins',
    title: 'Testcov.id',
    context: 'Devday Hackathon 2021 · 72 hours',
    year: '2021',
    role: 'UI/UX Designer',
    featured: true,
    description:
      'A vaccination-event tracker for a city, conceived and designed in a 72-hour hackathon, and awarded first place.',
    question: 'With 72 hours and no brief, what is worth building?',
    move: 'I proposed a website that tracks vaccination events around the city. No such site existed, and a map was the natural interface for it.',
    approach: [
      'Proposed the idea and designed the interface as the team’s UI/UX designer.',
      'Built it as a team of three on Next.js, Go, and the Mapbox API.',
      'Worked through a backend deployment failure on the third day that no approach we tried could fix.',
      'Resolved it at 4 a.m. by deploying to a friend’s borrowed VPS, finishing before the presentation began.',
    ],
    outcome: 'First place, Devday Hackathon 2021.',
    learned:
      'A good idea is worth little until it is deployed, and under pressure, the simplest route that works is the right one.',
    tags: ['Next.js', 'Go', 'Mapbox', 'UI/UX', 'Hackathon'],
  },
  {
    index: '04',
    slug: 'curio',
    art: 'flow',
    title: 'Curio',
    context: 'Championship Regeneration 2021 · university research competition',
    year: '2021',
    role: 'UI/UX Designer',
    description:
      'A mobile mentoring-app concept developed through the five-step design-thinking process for a product-design research competition.',
    question: 'Where do you begin when you have no idea what to design?',
    move: 'We followed the design-thinking steps strictly, and the idea came out of the empathize stage: we all felt the need for a mentor.',
    approach: [
      'Used design thinking as the framework: empathize, define, ideate, prototype, test.',
      'Ran surveys and interviews, then organized the findings into an affinity diagram.',
      'Turned the findings into user personas and user flows.',
      'Moved from low-fidelity to high-fidelity prototypes for the mobile app.',
    ],
    outcome: 'Did not place — first research-paper competition.',
    learned:
      'A process gives you somewhere to start, and it taught me how to come up with an idea and communicate it with a team.',
    tags: ['Design thinking', 'User research', 'Personas', 'Prototyping'],
  },
  {
    index: '05',
    slug: 'wangsaff-js',
    art: 'iso',
    title: 'Wangsaff.js',
    context: 'Independent project · WhatsApp commerce',
    year: '2021–22',
    role: 'Software Engineer — Independent Project',
    description:
      'A WhatsApp bot that kept customer service and the sales catalog available while small online sellers were away.',
    question: 'How can a small seller take a break without leaving customers unanswered?',
    move: 'I designed the chatbot to feel like an e-commerce site, with the sales catalog stored in SQL and browsable by chat.',
    approach: [
      'Used a Node.js package that lets the program act as a second WhatsApp client, tied to a spare phone number and phone.',
      'Converted the sellers’ sales catalog into a SQL database accessed through Sequelize.',
      'Shaped the conversation flow like a storefront so customers could browse the catalog.',
      'Wrapped the whole project in Docker.',
    ],
    outcome: 'Ran on a VPS for about six months before it was shut down.',
    learned:
      'A tool this small is only worth keeping while the problem exists, and it was retired once my friends no longer needed it.',
    tags: ['Node.js', 'SQL', 'Sequelize', 'Docker'],
  },
];

/** Four-digit years mentioned in a label such as '2021' or '2022–23'. */
function yearsIn(label: string): number[] {
  const [first, second] = label.split(/[–-]/).map((part) => part.trim());
  const start = Number.parseInt(first ?? '', 10);
  if (!Number.isFinite(start)) return [];
  if (!second) return [start];
  const end = Number.parseInt(
    second.length === 2 ? `${String(start).slice(0, 2)}${second}` : second,
    10,
  );
  return Number.isFinite(end) ? [start, end] : [start];
}

/** The span a set of projects covers, e.g. '2021–2023', derived from their `year` labels. */
export function yearSpan(list: Project[]): string {
  const years = list.flatMap((project) => yearsIn(project.year));
  if (years.length === 0) return '';
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}
