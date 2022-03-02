import { Component } from 'react';
import { bind, debounce } from 'decko';

import Flex from 'components/UI/Flex/Flex';
import Quill from './Quill';
import Toolbar from './Toolbar/Toolbar';
import Tools from './tools';

import s from './Editor.styl';
import { hydrateComponents } from './Editor.helpers';
import PostRenderHelpers from './PostRenderHelpers';

class Editor extends Component {
  state = { showToolbar: false };

  componentDidMount() {
    const { value } = this.props;

    this.editor = new Quill('#editor');
    this.tools = new Tools(this.editor, Quill);
    this.domParser = new DOMParser();

    this.setValue(value);
    this.setState({ showToolbar: true }); // eslint-disable-line

    this.editor.on('editor-change', this.onChange);
  }

  componentDidUpdate() {
    const { value } = this.props;

    if (value !== this.getValue()) this.setValue(value);
  }

  componentWillUnmount() {
    this.editor.off('editor.change', this.onEditorChange);
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

  @debounce(500)
  hydrateComponents() {
    hydrateComponents(this.editor.root);
  }

  onChange = () => {
    const { value, onChange } = this.props;
    const newVal = this.getValue();

    if (value === newVal) return;

    onChange(newVal);
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

export { Editor as default, hydrateComponents, PostRenderHelpers };
