import { Spinner, Container } from 'uilib';
import type { Size } from 'uilib';
import cn from 'classnames';

import S from './Loader.styl';

type Props = {
  className?: string;
  size?: Size;
};

export const Loader = ({ className, size, ...props }: Props) => (
  <div className={cn(S.root, className)} {...props}>
    <Spinner size={size} />
  </div>
);

export const PageLoader = props => (
  <Container>
    <Loader {...props} />
  </Container>
);
