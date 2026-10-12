/** The four-step way of working, told as the scroll story on the home page. */

export interface MethodStep {
  index: string;
  verb: 'Frame' | 'Constrain' | 'Decide' | 'Build';
  /** Short headline, ≤ 40 chars. */
  title: string;
  /** What happens in this step, told plainly. Two sentences, ≤ 240 chars. */
  body: string;
  /** What the chapter's drawing on the bust stands for. One sentence. */
  figure: string;
  /** The tangible thing the step produces, ≤ 48 chars. */
  artifact: string;
}

export const method: MethodStep[] = [
  {
    index: '01',
    verb: 'Frame',
    title: 'Name the real problem',
    body: 'Teams rarely arrive with a problem. They arrive with a solution: a dashboard, an app, a rewrite. I trace it back to the question underneath: who is stuck, where, and what would count as solved.',
    figure:
      'The brackets mark the edges of the problem. Inside is what we solve now; outside can wait.',
    artifact: 'A one-page problem statement',
  },
  {
    index: '02',
    verb: 'Constrain',
    title: 'Map what cannot move',
    body: 'Deadlines, budget, team size, the code that already exists. They shape the answer as much as the idea does, so they go on the table before anyone sketches.',
    figure: 'The rulers are the limits. Every option has to fit between them.',
    artifact: 'A map of constraints and risks',
  },
  {
    index: '03',
    verb: 'Decide',
    title: 'Make trade-offs visible',
    body: 'Every real choice gives something up. I put the options side by side, say what each one costs, and write down why one won, so nobody has to argue it again in a month.',
    figure: 'The fork is the choice: one path taken, the other recorded, not forgotten.',
    artifact: 'A decision record for each trade-off',
  },
  {
    index: '04',
    verb: 'Build',
    title: 'Ship the smallest true version',
    body: 'Only now does the idea turn into parts. With the reasoning settled the code gets simpler, and I build the narrowest slice that proves the decision before growing it.',
    figure: 'The figure breaks into points, then into a plan: one cell built, the rest laid out.',
    artifact: 'A working slice and a delivery plan',
  },
];
