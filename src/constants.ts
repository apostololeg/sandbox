import FileUploader from 'tools/fileUploader';

export const uploader = new FileUploader({ url: '/uploads' });

export const photosUploader = params =>
  uploader.upload(params).then(res => res.key);
