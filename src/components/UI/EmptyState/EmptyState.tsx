import { ReactNode } from 'react';
import cn from 'classnames';

import S from './EmptyState.styl';

type Props = {
  className?: string;
  image?: ReactNode;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
};

export function EmptyState(props: Props) {
  const { className, image, title, subtitle, children } = props;

  return (
    <div className={cn(S.root, className)}>
      {image}
      {title && <h2>{title}</h2>}
      {subtitle && <h3>{subtitle}</h3>}
      {children}
    </div>
  );
}
