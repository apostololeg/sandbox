import { Component } from 'react';
import { bind, debounce } from 'decko';

import { DEFAULT_SELECTION } from '../tools';
import MODULES from './modules';

import s from './Toolbar.styl';

const actionByHotkey = MODULES.reduce(
  (acc, { hotkey, action }) => (hotkey ? { ...acc, [hotkey]: action } : acc),
  {}
);

class Toolbar extends Component {
  hasUserSelection = false;

  state = {
    format: {},
    selection: DEFAULT_SELECTION,
  };

  componentDidMount() {
    const { editor } = this.props;

    document.addEventListener('keydown', this.onKeyDown, true);
    editor.on('selection-change', this.onSelectionChange);
    editor.on('editor-change', this.updateState);
  }

  componentWillUnmount() {
    const { editor } = this.props;

    document.removeEventListener('keydown', this.onKeyDown, true);
    editor.off('selection-change', this.onSelectionChange);
    editor.off('editor-change', this.updateState);
  }

  @bind
  onKeyDown(e) {
    const isMeta = e.ctrlKey || e.metaKey;
    const action = actionByHotkey[e.key];

    const { editor } = this.props;
    const { format, selection } = this.state;
    const { index, length } = selection;

    if (!isMeta || !action) return;

    e.preventDefault();
    e.stopPropagation();

    if (!this.hasUserSelection && length > 0) {
      editor.setSelection(index, length);
    }

    action({ editor, format, selection });
  }

  @bind
  @debounce(200)
  onSelectionChange() {
    this.updateState();
  }

  @bind
  updateState() {
    this.updateSelection();
    this.updateFormat();
  }

  @bind
  updateSelection() {
    const { editor, tools } = this.props;
    const userSelection = editor.getSelection();
    const selection = this.hasUserSelection
      ? userSelection
      : tools.getWordSelection();

    this.hasUserSelection = userSelection?.length > 0;
    this.setState({ selection });
  }

  @bind
  updateFormat() {
    const { editor } = this.props;
    const { index, length } = this.state.selection;
    const format = editor.getFormat(index, length);

    this.setState({ format });
  }

  render() {
    const { state } = this;
    const { editor, tools } = this.props;
    const moduleProps = {
      className: s.item,
      editor,
      state,
      tools,
    };
    const actionProps = {
      editor,
      state,
    };

    return (
      <div className={s.toolbar}>
        {MODULES.map(({ name, action, Module }) => (
          <Module
            {...moduleProps}
            key={name}
            state={this.state}
            action={() => action(actionProps)}
          />
        ))}
      </div>
    );
  }
}

export default Toolbar;
