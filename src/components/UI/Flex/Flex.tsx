import { HTMLProps } from 'react';
import cn from 'classnames';

import S from './Flex.styl';

export function mix(...args) {
  return cn(
    S.root,
    args.includes('centered') && S.centered,
    args.includes('scrolled') && S.scrolled,
    args.join(' ').replace(/(centered|scrolled)/g, '')
  );
}

interface Props {
  className?: string;
  children: React.ReactNode;
  Elem?: keyof JSX.IntrinsicElements;
  centered?: boolean;
  scrolled?: boolean;
}

function Flex({ children, Elem = 'div', ...props }: Props) {
  const { className, centered, scrolled, ...other } = props;
  const classes = mix(
    className,
    centered && 'centered',
    scrolled && 'scrolled'
  );

  return (
    <Elem className={classes} {...other}>
      {children}
    </Elem>
  );
}

export default Flex;

export function Gap({ className = '', ...rest }) {
  return <div className={cn(S.gap, className)} {...rest} />;
}
