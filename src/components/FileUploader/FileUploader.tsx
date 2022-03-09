import { Component, HTMLProps } from 'react';
import { createStore } from 'justorm/react';
import cn from 'classnames';
import { bind } from 'decko';
import nanoid from 'nanoid';

import { Input } from 'uilib';

import S from './FileUploader.styl';
import { api } from 'tools/request';

type Props = {
  className?: string;
  size?: string;
  prefix: string;
  onChange?: (files: string | Blob) => void;
  onUpload: (src: string) => void;
  accept?: HTMLProps<HTMLInputElement>['accept'];
  limit?: number; // megabytes
};

class FileUploader extends Component<Props> {
  store;

  constructor(props) {
    super(props);
    this.store = createStore(this, {
      total: 0,
      loaded: 0,
      inProgress: false,
      isComplete: false,
      isError: false,
    });
  }

  static defaultProps = { size: 'm' };

  onChange = async e => {
    const { onChange } = this.props;

    Object.assign(this.store, {
      total: 1,
      loaded: 0,
      isComplete: false,
      inProgress: true,
      isError: false,
    });

    const { files } = e.target;

    onChange?.(files);

    if (files.length === 0) return;

    try {
      await this.upload(files[0]);
    } catch (err) {
      Object.assign(this.store, {
        inProgress: false,
        isError: true,
      });
    }
  };

  onProgress = ({ loaded, total }) => {
    const isComplete = loaded === total;

    Object.assign(this.store, {
      total,
      loaded,
      isComplete,
      inProgress: !isComplete,
    });
  };

  async upload(file) {
    const { limit, prefix, onUpload } = this.props;

    if (limit) {
      const sizeMb = file.size / 1024 / 1024;

      if (sizeMb > limit) {
        console.error(`Max file size - ${limit}Mb`);
        return;
      }
    }

    const formData = new FormData();
    const ext = file.type.split('/')[1];
    const fileName = `${prefix}/${nanoid()}.${ext}`;

    formData.append('file', file);

    const params = {
      data: formData,
      headers: {
        'x-filename': fileName,
      },
    };

    await api.post('/upload', params, this.onProgress);

    Object.assign(this.store, {
      inProgress: false,
      isComplete: true,
      loaded: 1,
    });

    onUpload(`https://${DO_SPACE_NAME}.${DO_SPACE_NS}/${fileName}`);
  }

  render() {
    const { className, size, accept } = this.props;
    const { isComplete, isError, total, loaded } = this.store;

    const classes = cn(S.root, className, S[`size-${size}`]);
    const indicatorClasses = cn(
      S.progress,
      isComplete && (isError ? S.error : S.success)
    );

    return (
      <div className={classes}>
        <div className={S.label}>Choose file</div>
        <Input
          size={size}
          className={S.input}
          controlProps={{ className: S.control }}
          type="file"
          accept={accept}
          onChange={this.onChange}
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
