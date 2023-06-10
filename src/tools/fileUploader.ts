import { api } from 'tools/request';

type Props = {
  url: string;
};

type UploadParams = {
  file: File;
  onProgress?: (progress: number) => void;
  getXHR?: () => XMLHttpRequest;
  headers?: { [key: string]: string };
};

export default class FileUploader {
  url;

  constructor({ url }: Props) {
    this.url = url;
  }

  upload = (params: UploadParams) => {
    const { file, onProgress, getXHR, headers = {} } = params;
    const data = new FormData();

    data.append('file', file);

    return api.post(this.url, { getXHR, data, headers }, onProgress);
  };

  remove = key => {
    if (/^http/.test(key)) return;
    api.delete(`${this.url}/${key}`);
  };
}
