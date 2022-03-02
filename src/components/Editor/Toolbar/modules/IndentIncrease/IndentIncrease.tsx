import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import { MAX_INDENT } from '../../../PostRenderHelpers';

import Icon from './IndentIncrease.svg';

export default {
  action({ editor, state }) {
    const { index, length } = state.selection;
    editor.formatLine(index, length, 'indent', '+1');
  },
  Module({ action, state }) {
    const { indent } = state.format;

    return (
      <Button onClick={action} disabled={indent >= MAX_INDENT}>
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
