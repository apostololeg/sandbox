import { Component } from 'react';
import { createStore } from 'justorm/react';

import { Input, Button, Popup, debounce } from '@foreverido/uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';
import FileUploader from 'components/FileUploader/FileUploader';

import Icon from './Image.svg';
import s from './Image.styl';

type Props = {
  className?: string;
  tools?: any;
};

class Image extends Component<Props> {
  store;

  constructor(props) {
    super(props);
    this.store = createStore(this, {
      alt: '',
      url: '',
      isInserted: false,
      isUploaded: false,
      isOpen: false,
    });

    this.onAltChange = debounce(this.onAltChange, 500);
  }

  onOpen = () => (this.store.isOpen = true);
  onClose = () => (this.store.isOpen = false);

  onFileChoose = () => {
    Object.assign(this.store, { url: '', isUploaded: false });
  };

  onUpload = url => {
    Object.assign(this.store, { url, isUploaded: true });
  };

  onAltChange = alt => (this.store.alt = alt);

  onPopupClose = () => {
    if (!this.store.isInserted) {
      // TODO: remove file from DO Space
    }

    Object.assign(this.store, {
      url: '',
      alt: '',
      isInserted: false,
    });
  };

  insert = () => {
    const { tools } = this.props;
    const { alt, url } = this.store;

    tools.insertEmbed('image', { alt, url });
    this.store.isOpen = false;
  };

  render() {
    const { className } = this.props;
    const { isUploaded, isOpen } = this.store;

    return (
      <Popup
        className={className}
        direction="left"
        onOpen={this.onOpen}
        onClose={this.onPopupClose}
        idOpen={isOpen}
        trigger={
          <Button size="m" square>
            <SvgIcon icon={Icon} size={20} />
          </Button>
        }
        content={
          <div className={s.popupContainer}>
            <FileUploader
              className={s.item}
              prefix="post"
              onChange={this.onFileChoose}
              onUpload={this.onUpload}
              accept="image/png, image/jpeg, image/svg+xml"
              limit={2} // 2mb
            />
            <Input
              className={s.item}
              onInput={e => this.onAltChange(e.target.value)}
              placeholder="alt"
            />
            <Button
              size="m"
              className={s.item}
              onClick={this.insert}
              disabled={!isUploaded}
            >
              Insert
            </Button>
          </div>
        }
      />
    );
  }
}

export default {
  name: 'image',
  Module: Image,
};
