// TODO: move to Toolbar/modules/

import Quill from 'quill/core';

import Header from 'quill/formats/header';
import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import Indent from 'quill/formats/indent';
import { AlignClass } from 'quill/formats/align';
import ListItem, { ListContainer } from 'quill/formats/list';

import Component from './formats/component.quill';
import Image from './embeds/image.quill';

ListContainer.tagName = 'ul';

Quill.register({
  'formats/bold': Bold,
  'formats/italic': Italic,
  'formats/header': Header,
  'formats/list': ListContainer,
  'formats/list-item': ListItem,
  'formats/indent': Indent,
  'formats/align': AlignClass,
  'formats/component': Component,
});

Quill.register(Image);

export default Quill;
