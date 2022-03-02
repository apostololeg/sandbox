import { Component, memo } from 'react';
import { debounce } from 'uilib';

import Flex from 'components/UI/Flex/Flex';
import Quill from './Quill';
import Toolbar from './Toolbar/Toolbar';
import Tools from './tools';

import s from './Editor.styl';
import { hydrateComponents } from './Editor.helpers';
import PostRenderHelpers from './PostRenderHelpers';

type Props = {
  store?: any;
  value: string;
  onChange?: (value: string) => void;
};

class Editor extends Component<Props> {
  state = { showToolbar: false };
  editor;
  tools;
  domParser;

  componentDidMount() {
    const { value } = this.props;

    this.editor = new Quill('#editor');
    this.tools = new Tools(this.editor, Quill);
    this.domParser = new DOMParser();

    this.setValue(value);
    this.setState({ showToolbar: true }); // eslint-disable-line

    this.editor.on('editor-change', this.onChange);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  componentDidUpdate() {
    const { value } = this.props;

    if (value !== this.getValue()) this.setValue(value);
  }

  componentWillUnmount() {
    this.editor.off('editor.change', this.onChange);
  }

  hydrateComponents = debounce(() => hydrateComponents(this.editor.root), 500);

  setValue = (value) => {
    this.editor.root.innerHTML = value;
    this.hydrateComponents();
  };

  getValue = () => {
    const { innerHTML } = this.editor.root;
    const tree = this.domParser.parseFromString(innerHTML, 'text/html');

    tree.querySelectorAll('[data-props]').forEach((node) => {
      node.innerHTML = '';
      node.removeAttribute('data-inited');
    });

    return tree.body.innerHTML;
  };

  onChange = () => {
    const { value, onChange } = this.props;
    const newVal = this.getValue();

    if (value === newVal) return;

    onChange?.(newVal);
    this.hydrateComponents();
  };

  render() {
    const { showToolbar } = this.state;

    return (
      <Flex className={s.root}>
        <PostRenderHelpers />
        {showToolbar && <Toolbar editor={this.editor} tools={this.tools} />}
        <Flex scrolled id="editor" className={s.editor} />
      </Flex>
    );
  }
}

export default memo(Editor);

export { hydrateComponents, PostRenderHelpers };
