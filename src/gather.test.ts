import Gather from './gather';

let gather: Gather;

describe('Basic', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    gather = new Gather({ clientId: 'test_client_id' });
  });

  test('test fetch', () => {
    fetchMock.mockResponse('{}');

    gather.account('123', { name: 'Lovelace, Inc' });

    expect(fetchMock.mock.calls[0][1].method).toEqual('POST');
    expect(fetchMock.mock.calls[0][1].headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'GatherJS test_client_id',
    });
  });
});

describe('Data syncing', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    gather = new Gather({ clientId: 'test_client_id' });
  });

  test('test account', () => {
    fetchMock.mockResponse('{}');

    gather.account('123', { name: 'Lovelace, Inc' });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'https://api.gatherdata.co/models/account/records',
    );

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      id: '123',
      name: 'Lovelace, Inc',
    });

    expect(gather.accountId).toEqual('123');
  });

  test('test user without account', () => {
    fetchMock.mockResponse('{}');

    gather.user('123', {
      first_name: 'Ada', // eslint-disable-line
      last_name: 'Lovelace', // eslint-disable-line
      email: 'ada@lovelace.com',
    });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(
      'https://api.gatherdata.co/models/user/records',
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      id: '123',
      first_name: 'Ada', // eslint-disable-line
      last_name: 'Lovelace', // eslint-disable-line
      email: 'ada@lovelace.com',
    });
  });

  test('test user with account', () => {
    fetchMock.mockResponse('{}');

    gather.account('123', {});
    gather.user('123', {
      first_name: 'Ada', // eslint-disable-line
      last_name: 'Lovelace', // eslint-disable-line
      email: 'ada@lovelace.com',
    });

    expect(fetchMock.mock.calls.length).toEqual(2);
    expect(fetchMock.mock.calls[1][0]).toEqual(
      'https://api.gatherdata.co/models/user/records',
    );
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      id: '123',
      first_name: 'Ada', // eslint-disable-line
      last_name: 'Lovelace', // eslint-disable-line
      email: 'ada@lovelace.com',
      account_id: '123', // eslint-disable-line
    });
  });
});

describe('Events', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    gather = new Gather({ clientId: 'test_client_id' });
  });

  test('track custom event for user', () => {
    fetchMock.mockResponse('{}');

    gather.account('123', {});
    gather.user('123', {});
    gather.track('something.happened', {
      foo: 'bar',
    });

    expect(fetchMock.mock.calls.length).toEqual(3);
    expect(fetchMock.mock.calls[2][0]).toEqual(
      'https://api.gatherdata.co/events',
    );
    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({
      type: 'something.happened',
      user: '123',
      properties: {
        foo: 'bar',
      },
    });
  });

  test('track custom event for account', () => {
    fetchMock.mockResponse('{}');

    gather.account('123', {});
    gather.track('something.happened', {
      foo: 'bar',
    });

    expect(fetchMock.mock.calls.length).toEqual(2);
    expect(fetchMock.mock.calls[1][0]).toEqual(
      'https://api.gatherdata.co/events',
    );
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      type: 'something.happened',
      account: '123',
      properties: {
        foo: 'bar',
      },
    });
  });

  test('user takes precendence', () => {
    fetchMock.mockResponse('{}');

    gather.account('123', {});
    gather.user('123', {});
    gather.track('something.happened', {
      foo: 'bar',
    });

    expect(fetchMock.mock.calls.length).toEqual(3);
    expect(fetchMock.mock.calls[2][0]).toEqual(
      'https://api.gatherdata.co/events',
    );
    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({
      type: 'something.happened',
      user: '123',
      properties: {
        foo: 'bar',
      },
    });
  });

  test('throws if no user or account', () => {
    fetchMock.mockResponse('{}');

    expect(() => {
      gather.track('something.happened', {
        foo: 'bar',
      });
    }).toThrow(
      'user() or account() must have been called before tracking events',
    );
  });

  test('track page view', () => {
    fetchMock.mockResponse('{}');

    gather.account('123', {});
    gather.user('123', {});
    gather.page('Pricing', 'https://charles.babbage.com');

    expect(fetchMock.mock.calls.length).toEqual(3);
    expect(fetchMock.mock.calls[2][0]).toEqual(
      'https://api.gatherdata.co/events',
    );
    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({
      type: 'page.viewed',
      user: '123',
      properties: {
        url: 'https://charles.babbage.com',
        title: 'Pricing',
      },
    });
  });

  test('track page view for current page', () => {
    fetchMock.mockResponse('{}');

    document.title = 'My Web Page';

    const location = {
      ...window.location,
      href: 'https://charles.babbage.com/hello/world#what?is=love',
    };
    Object.defineProperty(window, 'location', {
      writable: true,
      value: location,
    });

    gather.account('123', {});
    gather.user('123', {});
    gather.page();

    expect(fetchMock.mock.calls.length).toEqual(3);
    expect(fetchMock.mock.calls[2][0]).toEqual(
      'https://api.gatherdata.co/events',
    );
    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({
      type: 'page.viewed',
      user: '123',
      properties: {
        url: 'http://localhost/',
        title: 'My Web Page',
      },
    });
  });
});
