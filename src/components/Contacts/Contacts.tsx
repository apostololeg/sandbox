import { Link, Scroll } from 'uilib';

import { Title } from 'components/Header/Header';

import S from './Contacts.styl';

const contacts = [
  {
    label: 'Telegram',
    href: 'https://t.me/apostol',
    text: 'https://t.me/apostol',
  },
  {
    label: 'Email',
    href: 'mailto:oleh.apostol.dev@gmail.com',
    text: 'oleh.apostol.dev@gmail.com',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/apostololeg',
    text: 'github.com/apostololeg',
  },
];

export default function Contacts() {
  return [
    <Title text="~/contacts" key="title" />,
    <div className={S.root} key="content">
      <Scroll
        y
        className={S.scroll}
        innerClassName={S.scrollInner}
        fadeSize="xl"
        offset={{ y: { before: 74, after: 20 } }}
      >
        <ul className={S.list}>
          {contacts.map(({ label, href, text }) => (
            <li key={label} className={S.item}>
              {label}:{' '}
              <Link href={href} target="_blank" rel="noreferrer">
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </Scroll>
    </div>,
  ];
}
