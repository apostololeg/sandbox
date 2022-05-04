import cn from 'classnames';
import { Link } from '@foreverido/uilib';

import LogoSvg from './logo.svg';

import S from './Logo.styl';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLAnchorElement> & {
  className?: string;
};

export default function Logo({ className, ...props }: Props) {
  return (
    <Link
      href="/"
      className={cn(S.root, className)}
      isClear
      isClearPadding
      {...props}
    >
      <LogoSvg />
    </Link>
  );
}
