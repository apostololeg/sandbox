import { Component } from 'react';
import { createStore } from 'justorm/react';
import cn from 'classnames';
import { bind } from 'decko';
import nanoid from 'nanoid';

import { Input } from 'uilib';

import upload from 'tools/xhrLoad';

import s from './FileUploader.styl';

class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.store = createStore(this, {
      total: 0,
      loaded: 0,
      progress: false,
      complete: false,
      error: false,
    });
  }

  @bind
  async onChange(e) {
    Object.assign(this.store, {
      total: 1,
      loaded: 0,
      complete: false,
      progress: true,
      error: false,
    });

    const { files } = e.target;

    if (files.length === 0) {
      return;
    }

    try {
      await this.upload(files[0]);
    } catch (err) {
      Object.assign(this.store, {
        progress: false,
        error: true,
      });
    }
  }

  @bind
  onProgress({ loaded, total }) {
    const complete = loaded === total;

    Object.assign(this.store, {
      total,
      loaded,
      complete,
      progress: !complete,
    });
  }

  async upload(file) {
    const { prefix, onUpload } = this.props;
    const formData = new FormData();
    const ext = file.type.split('/')[1];
    const fileName = `${prefix}/${nanoid()}.${ext}`;

    formData.append('file', file);

    const params = {
      method: 'POST',
      body: formData,
      headers: {
        'x-filename': fileName,
      },
    };

    await upload('/upload', params, this.onProgress);
    Object.assign(this.store, {
      progress: false,
      complete: true,
    });

    onUpload(`https://${DO_SPACE_NAME}.${DO_SPACE_NS}/${fileName}`);
  }

  render() {
    const { className } = this.props;
    const { progress, complete, error, total, loaded } = this.store;

    const classes = cn(s.root, className);
    const indicatorClasses = cn(
      s.progress,
      complete && (error ? s.error : s.success)
    );

    return (
      <div className={classes}>
        <Input
          type="file"
          onChange={this.onChange}
          placeholder="Choose file"
          loading={progress}
        />
        <div
          className={indicatorClasses}
          style={{ left: `${(loaded / total) * 100 - 100}%` }}
        />
      </div>
    );
  }
}

export default FileUploader;
