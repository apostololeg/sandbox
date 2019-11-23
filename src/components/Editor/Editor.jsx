import { h, Component } from 'preact'
import { bind, debounce } from 'decko'

import Flex from 'components/UI/Flex'
import Quill from './Quill'
import Toolbar from './Toolbar'
import Tools from './tools'

import s from './Editor.styl'
import { hydrateComponents } from './Editor.helpers'
import PostRenderHelpers from './PostRenderHelpers'

const ON_CHANGE_DELAY = 1000;

class Editor extends Component {
  state = { showToolbar: false };

  componentDidMount() {
    const { onChangeDelay } = this.props;

    this.editor = new Quill('#editor');
    this.tools = new Tools(this.editor, Quill);
    this.domParser = new DOMParser();
    this.onEditorChange = debounce(
      this.onChange,
      onChangeDelay || ON_CHANGE_DELAY
    );

    this.editor.on('editor-change', this.onEditorChange);

    this.setState({ showToolbar: true }); // eslint-disable-line
  }

  componentWillUnmount() {
    this.editor.off('editor.change', this.onEditorChange);
  }

  shouldComponentUpdate({ value }, { showToolbar }) {
    if (this.getValue() !== value) {
      this.setValue(value);
    }

    return this.state.showToolbar !== showToolbar;
  }

  @bind
  setValue(value) {
    this.editor.root.innerHTML = value;
    this.hydrateComponents();
  }

  @bind
  getValue() {
    const { innerHTML } = this.editor.root;
    const tree = this.domParser.parseFromString(innerHTML, 'text/html');

    tree.querySelectorAll('[data-props]').forEach(node => {
      node.innerHTML = '';
      node.removeAttribute('data-inited');
    });

    return tree.body.innerHTML;
  }

  hydrateComponents() {
    hydrateComponents(this.editor.root);
  }

  @bind
  onChange() {
    const { value, onChange } = this.props;
    const newVal = this.getValue();

    if (value === newVal) {
      return;
    }

    onChange(newVal);
    this.hydrateComponents();
  }

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

export {
  Editor as default,
  hydrateComponents,
  PostRenderHelpers
};
