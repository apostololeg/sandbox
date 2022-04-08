import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import { MAX_INDENT } from '../../../PostRenderHelpers';

import Icon from './IndentIncrease.svg';

export default {
  name: 'indent-increase',
  action({ editor, selection }) {
    const { index, length } = selection;

    editor.formatLine(index, length, 'indent', '+1');
  },
  Module({ className, action, format }) {
    return (
      <Button
        className={className}
        onClick={action}
        disabled={format?.indent >= MAX_INDENT}
        size="m"
        isSquare
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
