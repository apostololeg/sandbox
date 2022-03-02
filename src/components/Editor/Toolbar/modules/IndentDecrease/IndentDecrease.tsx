import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import Icon from './IndentDecrease.svg';

export default {
  action({ editor, state }) {
    const { index, length } = state.selection;
    editor.formatLine(index, length, 'indent', '-1');
  },
  Module({ action, state }) {
    const { indent } = state.format;

    return (
      <Button onClick={action} disabled={!indent}>
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
