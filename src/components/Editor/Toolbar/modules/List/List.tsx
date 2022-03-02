import { Button } from 'uilib';

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
  hotkey: 'l',
  action({ editor, state }) {
    const { format, selection } = state;
    const { index, length } = selection;

    return editor.formatLine(index, length, 'list', getValue(format));
  },
  Module({ state, action }) {
    const { format } = state;
    const icon = icons[format.list] || icons.bullet;

    return (
      <Button onClick={action} checked={format.list}>
        <SvgIcon icon={icon} size={20} />
      </Button>
    );
  },
};
