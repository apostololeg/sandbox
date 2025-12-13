import { ReactNode, useEffect, useRef, useState, useMemo } from 'react';
import { Button, Icon, Scroll, debounce } from 'uilib';
import cn from 'classnames';
import Time from 'timen';

import Quill from './Quill';
import Toolbar from './Toolbar/Toolbar';
import Tools from './tools';

import S from './Editor.styl';
import { hydrateComponents, bus, removeAllChildNodes } from './Editor.helpers';
import PostRenderHelpers from './PostRenderHelpers';

type Props = {
  value: string;
  onChange?: (value: string) => void;
  toolbarAddons?: ReactNode;
};

export default function Editor({ value, onChange, toolbarAddons }: Props) {
  const editorRef = useRef<any>();
  const toolsRef = useRef<any>();
  const [showToolbar, setShowToolbar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hydrateComponentsDebounced = useMemo(
    () =>
      debounce(
        () => hydrateComponents(editorRef.current?.root, { isEditor: true }),
        500
      ),
    []
  );

  useEffect(() => {
    const editor = new Quill('#editor');
    editorRef.current = editor;
    toolsRef.current = new Tools(editor, Quill);

    setValue(value);
    setShowToolbar(true);

    editor.on('editor-change', handleChange);

    bus.addEventListener('change', handleChange);

    return () => {
      editor.off('editor-change', handleChange);
      bus.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (value !== getValue()) {
      setValue(value);
    }
  }, [value]);

  function setValue(val: string) {
    if (!editorRef.current) return;
    editorRef.current.root.innerHTML = val;
    hydrateComponentsDebounced();
  }

  function getValue() {
    if (!editorRef.current) return '';
    const { root } = editorRef.current;
    const tree = root.cloneNode(true);

    tree.querySelectorAll('[data-props]').forEach((node: Element) => {
      removeAllChildNodes(node);
      node.removeAttribute('data-inited');
    });

    return tree.innerHTML;
  }

  function handleChange() {
    const newVal = getValue();

    if (value !== newVal) {
      onChange?.(newVal);
      hydrateComponentsDebounced();
    }
  }

  function toggleFullscreen() {
    if (!editorRef.current) return;
    const content = editorRef.current.root.innerHTML;

    setIsFullscreen(prev => {
      const newValue = !prev;
      Time.after(100, () => {
        if (editorRef.current) {
          editorRef.current.root.innerHTML = content;
        }
      });
      return newValue;
    });
  }

  return (
    <div className={cn(S.root, isFullscreen && S.fullscreen)}>
      <PostRenderHelpers />
      {showToolbar && editorRef.current && toolsRef.current && (
        <Toolbar
          className={S.toolbar}
          editor={editorRef.current}
          tools={toolsRef.current}
        >
          {toolbarAddons}
          <Button
            className={S.fullscreenButton}
            square
            variant="clear"
            onClick={toggleFullscreen}
          >
            <Icon type="fullscreen" size="l" />
          </Button>
        </Toolbar>
      )}
      <Scroll y className={S.scroll} innerClassName={S.scrollInner}>
        <div id="editor" className={S.editor} />
      </Scroll>
    </div>
  );
}

export { hydrateComponents, PostRenderHelpers };
