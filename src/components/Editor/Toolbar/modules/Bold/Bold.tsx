import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import Icon from './Bold.svg';

export default {
  name: 'bold',
  hotkey: 'b',
  action({ editor, format, selection }) {
    const { index, length } = selection;

    editor.formatText(index, length, 'bold', !format.bold);
  },
  Module({ className, format, action }) {
    return (
      <Button
        className={className}
        onClick={action}
        checked={format.bold}
        size="m"
        isSquare
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
