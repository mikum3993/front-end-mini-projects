function createRequestSetTimeOut(timeout) {
  return function (url, options = {}) {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const { signal } = controller
      options.signal = signal

      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('Request timed out'));
      }, timeout);

      fetch(url, options).then(response => {
        clearTimeout(timeoutId);
        if (!request.ok) {
          throw new Error(`HTTP error:${response}`);
        };
        return response.json();

      }
      ).then(data =>resolve(data))
      .catch(err=>reject(err))
      .finally(()=> clearTimeout(timeoutId))

    })
  }
}


const request = createRequestSetTimeOut(5000);
