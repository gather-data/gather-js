class FetchError extends Error {
  public response: Response;

  public constructor(errorMessage: string, response: Response) {
    super(errorMessage);
    this.response = response;
  }
}

function checkStatus(response: Response): Response {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new FetchError(response.statusText, response);
    throw error;
  }
}

interface PostOptions {
  data?: object;
  headers?: object;
}

function post(url: string, options: PostOptions = {}): Promise<object> {
  const { data = {}, headers = {} } = options;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(response => response.json());
}

export { post };
