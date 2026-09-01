import { Button, Link } from 'uilib';

import S from './Donate.styl';
import { ThinkingOutline } from '@homecode/ui';

const REVOLUT_URL = 'https://revolut.me/apostololeg';

export default function Donate() {
  return (
    <div className={S.root}>
      If you like what im doing
      <br />
      <div className={S.thinkingOutlineContainer}>
        <Button
          variant="primary"
          round
          onClick={() =>
            window.open(REVOLUT_URL, '_blank', 'noopener,noreferrer')
          }
        >
          send me some money
        </Button>
        <ThinkingOutline active className={S.thinkingOutline} />
      </div>
      for tokens
      <br />
      or <Link href="//contacts">contact me</Link>
    </div>
  );
}
