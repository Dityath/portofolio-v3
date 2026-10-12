export type Phase = 'design' | 'build' | 'lead';

export interface Experience {
  role: string;
  organisation: string;
  /** Display format, e.g. 'June 2025 — Present'. */
  period: string;
  /** Sortable start month, 'YYYY-MM'. */
  start: string;
  phase: Phase;
  /** One sentence, truthful, no invented specifics. */
  summary: string;
}

export const phases: Record<Phase, { label: string; line: string }> = {
  design: {
    label: 'Design',
    line: 'Learning to frame problems for the people who have them.',
  },
  build: {
    label: 'Build',
    line: 'Learning what code costs, and where it breaks.',
  },
  lead: {
    label: 'Lead',
    line: 'Holding product, people, and code together.',
  },
};

export const experience: Experience[] = [
  {
    role: 'Technical Lead',
    organisation: 'Nusapala Berkah Autonomous',
    period: 'June 2025 – Present',
    start: '2025-06',
    phase: 'lead',
    summary: 'Leading technical direction for web, mobile, and computer-vision delivery.',
  },
  {
    role: 'Project Engineer',
    organisation: 'ABAROBOTICS',
    period: 'May 2025 – August 2025',
    start: '2025-05',
    phase: 'lead',
    summary: 'Engineering project delivery across web, mobile, and computer-vision work.',
  },
  {
    role: 'UI/UX Developer',
    organisation: 'ABAROBOTICS',
    period: 'October 2024 – May 2025',
    start: '2024-10',
    phase: 'design',
    summary: 'Designed and developed interfaces for web and mobile products.',
  },
  {
    role: 'IT Officer',
    organisation: 'PeaceGeneration Indonesia',
    period: 'June 2022 – September 2023',
    start: '2022-06',
    phase: 'lead',
    summary:
      'Served as IT officer and project manager for the SEAN-CSO website, linking management and developers.',
  },
  {
    role: 'Frontend Developer',
    organisation: 'Braga Technologies',
    period: 'May 2022 – December 2022',
    start: '2022-05',
    phase: 'build',
    summary: 'Built the frontend of the West Java forestry dashboard, my first government project.',
  },
  {
    role: 'Full Stack Engineer Intern',
    organisation: 'Kawan Kerja',
    period: 'May 2022 – July 2022',
    start: '2022-05',
    phase: 'build',
    summary: 'Internship working across the frontend and backend of web products.',
  },
  {
    role: 'Web Designer Intern',
    organisation: 'Mechtech.idn',
    period: 'November 2021 – February 2022',
    start: '2021-11',
    phase: 'design',
    summary: 'Internship designing websites, my first professional design work.',
  },
];
