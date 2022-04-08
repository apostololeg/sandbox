import { Link } from 'uilib';

import LogoSvg from './logo.svg';

import S from './Logo.styl';

export default function Logo() {
  return (
    <Link href="/" className={S.root} isClear isClearPadding>
      <LogoSvg />
    </Link>
  );
}
