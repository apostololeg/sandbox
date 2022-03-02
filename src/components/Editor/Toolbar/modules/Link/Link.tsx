import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import Icon from './Link.svg';

export default {
  hotkey: 'k',
  action({ editor, state }) {
    const { index, length } = state.selection;
    const children = editor.getText(index, length);

    if (!children) return;

    // TODO: upgrade popup and ask more props for component
    const href = prompt(`Link for "${children}"`); // eslint-disable-line

    if (!href) return;

    editor.deleteText(index, length);
    editor.insertEmbed(index, 'component', {
      component: 'Link',
      isClearPadding: true,
      children,
      href,
    });
  },
  Module({ state, action }) {
    const isDisabled = state.selection.length === 0;

    return (
      <Button onClick={action} disabled={isDisabled}>
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
