export type Project = {
  slug: string;
  domain: string;
  title: string;
  description: string;
};

export const projects: Project[] = [
  {
    slug: 'cv',
    domain: 'cv.apostol.space',
    title: 'Curriculum Vitae',
    description: 'Interactive CV and professional experience showcase',
  },
  {
    slug: 'glass',
    domain: 'glass.cat',
    title: 'GLASS',
    description:
      'Workspace for AI agents across typed chat, live voice, and phone calls',
  },
  {
    slug: 'peer',
    domain: 'peer.pw',
    title: 'Peer.pw',
    description: 'Peer-to-peer screen sharing application',
  },
  {
    slug: 'besthumans',
    domain: 'besthumans.org',
    title: 'BestHumans',
    description:
      'Public knowledge platform about people whose actions affect others',
  },
  {
    slug: 'ui',
    domain: 'ui.apostol.space',
    title: 'UI',
    description: 'UI component library and design system',
  },
  {
    slug: 'stats',
    domain: 'stats.apostol.space',
    title: 'Stats',
    description: 'Analytics and statistics tracking application',
  },
  {
    slug: 'svg-dot-work',
    domain: 'svg-dot-work.apostol.space',
    title: 'SVG Dot Work',
    description:
      'Generate dotted SVG artwork. Adjust density, size, and colors to create vector dot art. Free online SVG optimization and export tool',
  },
];
