import { Link, ThinkingOutline } from 'uilib';

import BestHumansIcon from 'assets/projects/besthumans.svg';
import { ComponentType } from 'react';
import CvIcon from 'assets/projects/cv.svg';
import GlassIcon from 'assets/projects/glass.svg';
import PeerIcon from 'assets/projects/peer.svg';
import S from './Projects.styl';
import StatsIcon from 'assets/projects/stats.svg';
import SvgDotWorkIcon from 'assets/projects/svg-dot-work.svg';
import UiIcon from 'assets/projects/ui.svg';
import { projects } from 'data/projects';

const icons: Record<string, ComponentType> = {
  cv: CvIcon,
  peer: PeerIcon,
  stats: StatsIcon,
  'svg-dot-work': SvgDotWorkIcon,
  ui: UiIcon,
  besthumans: BestHumansIcon,
  glass: GlassIcon,
};

export default function Projects() {
  return (
    <div className={S.projects}>
      {projects.map(project => {
        const Icon = icons[project.slug];
        return (
          <Link
            key={project.slug}
            href={`//post/${project.slug}`}
            className={S.card}
            isClear
          >
            <ThinkingOutline className={S.outline} />
            <h3 className={S.title}>
              {Icon && (
                <span className={S.icon} aria-hidden>
                  <Icon />
                </span>
              )}
              {project.title}
            </h3>
            <p className={S.description}>{project.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
