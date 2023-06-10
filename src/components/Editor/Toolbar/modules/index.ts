import Headers from './Headers/Headers';
import Italic from './Italic/Italic';
import Bold from './Bold/Bold';
import Align from './Align/Align';
import List from './List/List';
import IndentIncrease from './IndentIncrease/IndentIncrease';
import IndentDecrease from './IndentDecrease/IndentDecrease';
import Image from './Image/Image';
import Link from './Link/Link';
import type Quill from 'components/Editor/Quill';

type Selection = {
  index: number;
  length: number;
};

type API = {
  editor: Quill;
  selection: Selection;
  format: any;
};

type Action = (props: API, moduleProps?: any) => void;

type ModuleProps = API & {
  className: string;
  // icon: string;
  action: Action;
};

export type Module = {
  name: string;
  hotkey?: string;
  action: Action;
  Module: (props: ModuleProps) => JSX.Element;
};

export default [
  Headers,
  Italic,
  Bold,
  Align,
  List,
  IndentDecrease,
  IndentIncrease,
  Link,
  Image,
] as Module[];
