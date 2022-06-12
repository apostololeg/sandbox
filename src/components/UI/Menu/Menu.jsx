import cn from 'classnames';

import s from './Menu.styl';

export default function Menu({
  padded,
  paddedX,
  highlighted,
  className,
  children,
  align = 'left',
}) {
  const classes = cn(
    s.root,
    s[align],
    padded && s.padded,
    paddedX && s.paddedX,
    highlighted && s.highlighted,
    className
  );

  return <ul className={classes}>{children}</ul>;
}

export function MenuItem({ children, selected = false, As = 'li', ...props }) {
  const classes = cn(
    s.item,
    selected && s.selected,
    props.onClick && s.clickable
  );

  return (
    <As className={classes} {...props}>
      {children}
    </As>
  );
}
