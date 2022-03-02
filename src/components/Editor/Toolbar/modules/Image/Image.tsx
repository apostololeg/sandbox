import { Component } from 'react';
import { createStore } from 'justorm/react';
import { bind, debounce } from 'decko';

import { Input, Button, Popup } from 'uilib';

import SvgIcon from 'components/UI/SvgIcon/SvgIcon';
import FileUploader from 'components/FileUploader/FileUploader';

import Icon from './Image.svg';
import s from './Image.styl';

class Image extends Component {
  store;

  constructor(props) {
    super(props);
    this.store = createStore(this, {
      alt: '',
      url: '',
      inserted: false,
      uploaded: false,
    });
  }

  onFileChoose = url => {
    Object.assign(this.store, { url, uploaded: false });
  };

  onUpload = url => {
    Object.assign(this.store, { url, uploaded: true });
  };

  @debounce(500)
  onAltChange(alt) {
    this.store.alt = alt;
  }

  onPopupClose = () => {
    if (!this.store.inserted) {
      // TODO: remove file from DO Space
    }

    Object.assign(this.store, {
      url: '',
      alt: '',
      inserted: false,
    });
  };

  insert = () => {
    const { tools } = this.props;
    const { alt, url } = this.store;

    tools.insertEmbed('image', { alt, url });
    // this.popupApi.setOpen(false);
  };

  render() {
    const { className } = this.props;
    const { uploaded } = this.store;

    return (
      <Popup
        className={className}
        direction="left"
        onClose={this.onPopupClose}
        // onApi={api => (this.popupApi = api)}
      >
        <Button>
          <SvgIcon icon={Icon} size={20} />
        </Button>
        <div className={s.popupContainer}>
          <FileUploader
            className={s.item}
            prefix="post"
            onChange={this.onFileChoose}
            onUpload={this.onUpload}
          />
          <Input
            className={s.item}
            onInput={e => this.onAltChange(e.target.value)}
            placeholder="alt"
          />
          <Button
            className={s.item}
            onClick={this.insert}
            disabled={!uploaded}
            fullWidth
          >
            Insert
          </Button>
        </div>
      </Popup>
    );
  }
}

export default {
  Module: Image,
};
