import { h } from 'preact'
import { view } from 'preact-easy-state'

import Button from 'components/UI/Button'
import SvgIcon from 'components/UI/SvgIcon'

import Icon from './Italic.svg'

export default function({ editor, state }) {
  function action() {
    const { index, length } = state.selection;
    editor.formatText(index, length, 'italic', !state.format.italic);
  }

  return {
    action,
    hotkey: 'i',
    Module: view(props => (
      <Button onClick={action} checked={state.format.italic} {...props}>
        <SvgIcon icon={Icon} size={20} />
      </Button>
    ))
  }
}