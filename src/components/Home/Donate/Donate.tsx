import { Button } from 'uilib';
import { ComponentType } from 'react';
import GithubIcon from 'assets/contacts/github.svg';
import { MailIcon } from 'lucide-react';
import S from './Donate.styl';
import TelegramIcon from 'assets/contacts/telegram.svg';
import { ThinkingOutline } from '@homecode/ui';

const REVOLUT_URL = 'https://revolut.me/apostololeg';

const contacts: { label: string; href: string; Icon: ComponentType }[] = [
  { label: 'Telegram', href: 'https://t.me/apostol', Icon: TelegramIcon },
  {
    label: 'Email',
    href: 'mailto:oleh.apostol.dev@gmail.com',
    Icon: MailIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/apostololeg',
    Icon: GithubIcon,
  },
];

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
      or contact me
      <div className={S.contacts}>
        {contacts.map(({ label, href, Icon }) => (
          <Button
            key={label}
            className={S.iconBtn}
            square
            round
            variant="text"
            aria-label={label}
            onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
          >
            <Icon />
          </Button>
        ))}
      </div>
    </div>
  );
}
