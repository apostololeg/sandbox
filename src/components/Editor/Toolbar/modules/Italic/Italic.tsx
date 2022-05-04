import { Button } from '@foreverido/uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import Icon from './Italic.svg';

export default {
  name: 'italic',
  hotkey: 'i',
  action({ editor, format, selection }) {
    const { index, length } = selection;

    editor.formatText(index, length, 'italic', !format.italic);
  },
  Module({ className, format, action }) {
    return (
      <Button
        className={className}
        onClick={action}
        checked={format.italic}
        size="m"
        square
      >
        <SvgIcon icon={Icon} size={20} />
      </Button>
    );
  },
};
