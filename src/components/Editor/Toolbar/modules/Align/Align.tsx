import { Button } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import icons from './icons';

function getValue(format) {
  if (!format.align) return 'center';
  if (format.align === 'center') return 'right';
  return false;
}

export default {
  action({ editor, state }) {
    const { format, selection } = state;
    const { index, length } = selection;
    editor.formatLine(index, length, 'align', getValue(format));
  },
  Module({ state, action }) {
    const { format } = state;
    const icon = icons[format.align] || icons.left;

    return (
      <Button onClick={action}>
        <SvgIcon icon={icon} size={20} />
      </Button>
    );
  },
};
