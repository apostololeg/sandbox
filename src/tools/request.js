import { stringify } from 'tools/queryParams';

function parseResponse(res) {
  try {
    return JSON.parse(res);
  } catch (e) {} // eslint-disable-line

  return res;
}

function request(url, params = {}) {
  const xhr = new XMLHttpRequest();
  const { method, headers = {}, data } = params;
  const isGet = method === 'GET';
  const hasData = data && Object.keys(data).length > 0;

  headers['Content-Type'] = 'application/json;charset=UTF-8';

  if (isGet && hasData) url += stringify(data); // eslint-disable-line

  return new Promise((resolve, reject) => {
    xhr.open(method, url);
    xhr.onreadystatechange = () => {
      const { readyState, status } = xhr;

      if (readyState === XMLHttpRequest.DONE) {
        /200|201/.test(status)
          ? resolve(parseResponse(xhr.response))
          : reject(xhr);
      }
    };

    Object.entries(headers).forEach(([name, value]) =>
      xhr.setRequestHeader(name, value)
    );

    xhr.send(isGet ? null : JSON.stringify(data));
  });
}

export const api = {
  get: (url, params = {}) => request(`/api${url}`, { ...params, method: 'GET' }),
};

export default request;
