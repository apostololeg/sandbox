import { ReactNode, ReactElement } from 'react';

type MenuProps = {
  padded?: boolean;
  paddedX?: boolean;
  highlighted?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
  children?: ReactNode;
};

export default function Menu(props: MenuProps): ReactElement;

export function MenuItem(props: {
  children?: ReactNode;
  selected?: boolean;
  As?: string;
  [key: string]: any;
}): ReactElement;
