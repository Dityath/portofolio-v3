export const site = {
  name: 'Ditya Athallah',
  handle: 'Dityath',
  role: 'Technical Lead',
  location: 'Jakarta, Indonesia',
  locationShort: 'JKT / ID',
  timezone: 'GMT+7',
  // TODO(content-review): Confirm hello@dityath.dev is active before deployment.
  email: 'hello@dityath.dev',
  // TODO(content-review): Confirm current availability before deployment.
  availability: 'Open to selected work',
  description:
    'Ditya Athallah is a technical lead who designs the thinking behind a product — the problem, the constraints, the trade-offs — before the build.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Dityath' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dityath/' },
    { label: 'Medium', href: 'https://medium.com/@dityath' },
  ],
} as const;

export const navigation = [
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Writing', href: '/blog/' },
] as const;
