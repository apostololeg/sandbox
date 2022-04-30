import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import Icon from './IndentDecrease.svg';

export default {
  name: 'indent-decrease',
  action({ editor, selection }) {
    const { index, length } = selection;

    editor.formatLine(index, length, 'indent', '-1');
  },
  Module({ className, action, format }) {
    return (
      <Button
        className={className}
        onClick={action}
        disabled={!format?.indent}
        size="m"
        square
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
