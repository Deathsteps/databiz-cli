// @flow

type Callback = (err: ?Error, data: ?Object) => any

function ajax (
  url: string,
  method: 'POST' | 'GET',
  params: ?Object,
  callback: Callback,
  onBeforeSend: (xhr: XMLHttpRequest) => any
) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      let body = xhr.responseText;
      if (xhr.status >= 200 && xhr.status < 300 ||
        xhr.status === 304) {
        let data;
        try {
          data = JSON.parse(body);
        }catch(ex){
          callback(ex);
        }
        if(data){
          callback(null, data);
        }
      } else {
        callback(new Error(body))
      }
    }
  };

  let content = onBeforeSend(xhr);
  content = params ? JSON.stringify(params) : content;

  try {
    xhr.send(content);
  } catch (e) {
    alert(e);
    throw new Error(e);
  }

  return xhr
}

let requestCache = {}
/**
 * set up request cache for specified service
 * NOTE: This approach only cache requests without parameters
 * @param  {string} serviceName [description]
 */
export function setupRequestCache (serviceName: string) {
  requestCache[serviceName] = false
}

const SERVICE_URL: string = 'http://api.project.com'
const SERVICE_TEST_URL: string = 'http://test.api.project.com'

/**
 * Request service api
 * @param  {String} serviceName service name
 * @param  {Object} params      request parameters
 * @return {Promise}            request promise
 */
export default function request (serviceName: string, params: Object): Promise<*> {
  return new Promise(function(resolve: Function, reject: Function) {
    // check request cache
    if (serviceName in requestCache && requestCache[serviceName]) {
      return resolve(requestCache[serviceName])
    }
    // send ajax request
    // const serviceUrl = SERVICE_TEST_URL
    const serviceUrl = window.topDebug === 1 ? SERVICE_TEST_URL : SERVICE_URL
    ajax(
      serviceUrl + serviceName,
      'POST',
      params,
      // onFinish
      function (err, data) {
        if (err) {
          reject(err)
        } else {
          if (!data) {
            reject(new Error('Something wrong happened!'))
          } else if (data.ResultStatus && data.ResultStatus.ResultCode !== 0) {
            let err = new Error(data.ResultStatus.ResultMess);
            // err.code = data.ResultStatus.ResultCode;
            reject(err)
          } else {
            // cache the response of pre-configured services
            if (serviceName in requestCache) {
              requestCache[serviceName] = data
            }
            resolve(data)
          }
        }
      },
      // Set headers
      function(xhr){
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
      }
    )
  })
}
