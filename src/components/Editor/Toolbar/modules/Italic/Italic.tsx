import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import Icon from './Italic.svg';

export default {
  hotkey: 'i',
  action({ editor, state }) {
    const { index, length } = state.selection;
    editor.formatText(index, length, 'italic', !state.format.italic);
  },
  Module({ state, action }) {
    return (
      <Button onClick={action} checked={state.format.italic}>
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
