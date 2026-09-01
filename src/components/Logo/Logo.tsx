import cn from 'classnames';
import { useStore } from 'justorm/react';
import { MouseEvent, HTMLAttributes } from 'react';

import LogoSvg from './logo.svg';

import S from './Logo.styl';

type Props = HTMLAttributes<HTMLAnchorElement> & {
  className?: string;
};

export default function Logo({ className, onClick, ...props }: Props) {
  const { router } = useStore({ router: ['path'] });

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    router.go('/');
  }

  return (
    <a href="/" className={cn(S.root, className)} {...props} onClick={handleClick}>
      <LogoSvg />
    </a>
  );
}
