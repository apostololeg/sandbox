export class FileURL {
  constructor(params) {
    this.params = params;
  }

  build(pref, key, size) {
    if (!key) return null;

    return `${UPLOADS_DOMAIN}/${UPLOADS_DIR}/${pref}/${size}/${key}-${size}.png`;
  }
}
