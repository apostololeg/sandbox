import { Link } from 'uilib';
import S from './Projects.styl';

interface Project {
  domain: string;
  title: string;
  description: string;
}

const projects: Project[] = [
  // {
  //   domain: 'andrew.apostol.space',
  //   title: 'Portfolio for Andrew',
  //   description: 'Personal portfolio website showcasing work and projects',
  // },
  {
    domain: 'cv.apostol.space',
    title: 'Curriculum Vitae',
    description: 'Interactive CV and professional experience showcase',
  },
  // {
  //   domain: 'desserts.apostol.space',
  //   title: 'Desserts',
  //   description: 'Online cake shop and bakery ordering platform',
  // },
  // {
  //   domain: 'greencore.apostol.space',
  //   title: 'Agentic Flow Builder',
  //   description: 'Build and manage agentic workflows and automation flows',
  // },
  // {
  //   domain: 'muzfish.apostol.space',
  //   title: 'Music Events App',
  //   description: 'Music-related events application with interactive map',
  // },
  {
    domain: 'peer.pw',
    title: 'Peer.pw',
    description: 'Peer-to-peer screen sharing application',
  },
  // {
  //   domain: 'starsky.apostol.space',
  //   title: 'Starsky',
  //   description: 'Web-based augmented reality stargazing application',
  // },
  {
    domain: 'stats.apostol.space',
    title: 'Stats',
    description: 'Analytics and statistics tracking application',
  },
  {
    domain: 'svg-dot-work.apostol.space',
    title: 'SVG Dot Work',
    description:
      'Generate dotted SVG artwork. Adjust density, size, and colors to create vector dot art. Free online SVG optimization and export tool',
  },
  {
    domain: 'ui.apostol.space',
    title: 'UI',
    description: 'UI component library and design system',
  },
  // {
  //   domain: 'webrush.apostol.space',
  //   title: 'WEBRUSH',
  //   description: 'Browser-based image editing app powered by web technologies',
  // },
  // {
  //   domain: 'world.apostol.space',
  //   title: 'WORLD.js',
  //   description: 'World simulator and architecture game',
  // },
  // {
  //   domain: 'yalta.apostol.space',
  //   title: 'YaltaChanges',
  //   description:
  //     'Social app connecting people in residential areas to improve their neighborhoods',
  // },
];

export default function Projects() {
  return (
    <div className={S.projects}>
      {projects.map(project => (
        <Link
          key={project.domain}
          href={`https://${project.domain}`}
          className={S.card}
          isClear
        >
          <h3 className={S.title}>{project.title}</h3>
          <p className={S.description}>{project.description}</p>
        </Link>
      ))}
    </div>
  );
}
