import { Button } from '@foreverido/uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import icons from './icons';

function getValue(format) {
  switch (format.list) {
    case 'bullet':
      return 'ordered';
    case 'ordered':
      return false;
    default:
      return 'bullet';
  }
}

export default {
  name: 'list',
  hotkey: 'l',
  action({ editor, format, selection }) {
    const { index, length } = selection;

    return editor.formatLine(index, length, 'list', getValue(format));
  },
  Module({ className, format, action }) {
    const icon = icons[format.list] || icons.bullet;

    return (
      <Button
        className={className}
        onClick={action}
        checked={format.list}
        size="m"
        square
      >
        <SvgIcon icon={icon} size={20} />
      </Button>
    );
  },
};
