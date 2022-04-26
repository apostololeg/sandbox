import { ReactNode } from 'react';
import cn from 'classnames';

import S from './EmptyPage.styl';

type Props = {
  className?: string;
  image?: ReactNode;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
};

export function EmptyPage(props: Props) {
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
