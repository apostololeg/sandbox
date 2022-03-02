import { Select } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';

import icons from './icons';

const OPTIONS = [
  { text: 'H1', val: 'h1' },
  { text: 'H2', val: 'h2' },
  { text: 'H3', val: 'h3' },
];

export default {
  action({ editor, state }) {
    const { format, selection } = state;
    const { index, length } = selection;

    editor.formatText(index, length, 'bold', !format.bold);
  },
  Module({ editor, state }) {
    const getValue = () => {
      if (!state.format.header) return null;
      return OPTIONS[state.format.header - 1].val;
    };

    const onChange = val => {
      const { index, length } = state.selection;
      const newVal = val === getValue() ? false : val;

      editor.removeFormat(index, length);
      editor.formatLine(index, length, 'header', newVal);
    };

    const val = getValue();
    const icon = icons[val] || icons.h1;

    return (
      <Select
        options={OPTIONS}
        popupProps={{ horizontal: 'left' }}
        menuProps={{ highlighted: true, padded: true }}
        value={val}
        onChange={onChange}
        renderLabel={() => <SvgIcon icon={icon} size={20} />}
      />
    );
  },
};
