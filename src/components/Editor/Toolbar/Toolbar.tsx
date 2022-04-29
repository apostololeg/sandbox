import { Component } from 'react';
import { debounce } from 'uilib';
import cn from 'classnames';

import { DEFAULT_SELECTION } from '../tools';
import MODULES from './modules';

import S from './Toolbar.styl';

const actionByHotkey = MODULES.reduce(
  (acc, { hotkey, action }) => (hotkey ? { ...acc, [hotkey]: action } : acc),
  {}
);

type Props = {
  className?: string;
  editor: any;
  tools: any;
};

class Toolbar extends Component<Props> {
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

  onKeyDown = e => {
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
  };

  onSelectionChange = debounce(() => {
    this.updateState();
  }, 200);

  updateState = () => {
    this.updateSelection();
    this.updateFormat();
  };

  updateSelection = () => {
    const { editor, tools } = this.props;
    const userSelection = editor.getSelection();
    const selection = this.hasUserSelection
      ? userSelection
      : tools.getWordSelection();

    this.hasUserSelection = userSelection?.length > 0;
    this.setState({ selection });
  };

  updateFormat = () => {
    const { editor } = this.props;
    const { index, length } = this.state.selection;
    const format = editor.getFormat(index, length);

    this.setState({ format });
  };

  render() {
    const { editor, tools, className, children } = this.props;
    const { format, selection } = this.state;
    const moduleProps = {
      className: S.item,
      editor,
      format,
      selection,
      tools,
    };
    const actionProps = {
      editor,
      format,
      selection,
    };

    return (
      <div className={cn(S.root, className)}>
        {MODULES.map(({ name, action, Module }) => (
          <Module
            {...moduleProps}
            key={name}
            action={() => action(actionProps)}
          />
        ))}
        {children && (
          <>
            <div className={S.gap} />
            <div className={S.addons}>{children}</div>
          </>
        )}
      </div>
    );
  }
}

export default Toolbar;
