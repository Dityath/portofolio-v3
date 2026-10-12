// TODO(content-review): Confirm the exact scope of each service, and any
// conflict-of-interest limits with current employers, before publishing.

export interface Service {
  /** Two-digit display id for the services listing. */
  index: string;
  /** Stable, public route segment for the service record. */
  slug: string;
  title: string;
  description: string;
  /** Existing scope expressed as discrete, scannable areas. */
  areas: string[];
  /** Card line, ≤ 120 chars. */
  summary: string;
  /** Three "Good fit when…" situations. */
  fit: string[];
  /** Concrete things the client walks away with. */
  deliverables: string[];
  /** One line on how an engagement runs. */
  format: string;
}

export const services: Service[] = [
  {
    index: '01',
    slug: 'technical-audit',
    title: 'Technical Audit',
    description:
      'A review of your codebase and architecture that finds the technical debt that matters and ranks what to fix first.',
    summary: 'A clear read on your codebase, its debt, and what to fix first.',
    areas: [
      'Codebase review',
      'Architecture review',
      'Technical-debt identification',
      'Practical, prioritized recommendations',
    ],
    fit: [
      'You inherited a codebase and do not know how sound it is.',
      'Delivery has slowed and nobody can say why.',
      'You need an outside view before a rewrite or a funding conversation.',
    ],
    deliverables: [
      'A written review of the codebase and architecture',
      'A list of technical debt, ranked by impact',
      'A prioritized set of recommendations',
      'A walkthrough session with your team',
    ],
    format: 'Async-first, with a walkthrough session at the end.',
  },
  {
    index: '02',
    slug: 'fractional-technical-lead',
    title: 'Fractional Technical Lead',
    description:
      'Part-time technical leadership: I make the technical decisions, set up code review, guide your developers, and coordinate delivery.',
    summary: 'Part-time technical leadership for a team that needs direction.',
    areas: [
      'Technical decisions',
      'Code-review process',
      'Developer guidance',
      'Bounded delivery coordination',
    ],
    fit: [
      'You have developers but nobody setting technical direction.',
      'Decisions are being made by default, not on purpose.',
      'You need a lead, but not a full-time one yet.',
    ],
    deliverables: [
      'A written decision record for each major trade-off',
      'A working code-review process',
      'Regular guidance for your developers',
      'Coordination of a clearly bounded stretch of delivery',
    ],
    format: 'Async-first, with a weekly working session.',
  },
  {
    index: '03',
    slug: 'mvp-planning-delivery-advisory',
    title: 'MVP Planning & Delivery Advisory',
    description:
      'Help turning an idea into a buildable plan: clearer requirements, a technology choice, an initial architecture, and a backlog.',
    summary: 'Turn an idea into a buildable plan before you spend on code.',
    areas: [
      'Requirement clarification',
      'Technology selection',
      'Initial architecture',
      'Backlog and delivery planning',
    ],
    fit: [
      'You have an idea but no agreed scope.',
      'You are choosing technology and want the trade-offs spelled out.',
      'You are about to hire or brief a team and need a plan to hand them.',
    ],
    deliverables: [
      'A one-page problem statement and clarified requirements',
      'A technology recommendation with the reasoning behind it',
      'An initial architecture sketch',
      'A prioritized backlog and delivery plan',
    ],
    format: 'Async-first, with a short working session at each stage.',
  },
];
