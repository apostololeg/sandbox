import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import Icon from './Link.svg';

export default {
  name: 'link',
  hotkey: 'k',
  action({ editor, selection }) {
    const { index, length } = selection;
    const children = editor.getText(index, length);

    if (!children) return;

    // TODO: upgrade popup and ask more props for component
    const href = prompt(`Link for "${children}"`); // eslint-disable-line

    if (!href) return;

    editor.deleteText(index, length);
    editor.insertEmbed(index, 'component', {
      component: 'Link',
      inline: true,
      children,
      href,
    });
  },
  Module({ className, selection, action }) {
    const isDisabled = selection?.length === 0;

    return (
      <Button
        className={className}
        onClick={action}
        disabled={isDisabled}
        size="m"
        square
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
