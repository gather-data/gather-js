import Gather from './gather';

beforeEach(() => {
    delete window.gather;
    jest.resetModules();
    fetchMock.resetMocks();
});

test('Initializes clientId', () => {
    window.gather = {
        clientId: '123',
        stubCalls: {
            user: [],
            track: [],
            page: [],
            account: [],
        },
    };

    require('./index.browser');

    expect(window.gather.clientId).toEqual('123');
});

test('Throws if gatherStub not initialized', () => {
    expect(() => require('./index.browser')).toThrow(
        'Cannot find your clientId. Have you copied the Gather.js snippet correctly?',
    );
});

test('Handles queues', () => {
    fetchMock.mockResponse('{}');

    window.gather = {
        clientId: '123',
        stubCalls: {
            user: [['my_user_id', { first_name: 'Ada' }]],
            track: [['order.created', { product_name: 'Babbage Machine' }]],
            page: [['Getting Started with The Babbage Machine', 'babbage.com']],
            account: [['my_account_id', { name: 'Lovelace, Inc' }]],
        },
    };

    require('./index.browser');

    expect(fetchMock.mock.calls.length).toEqual(4);

    expect(fetchMock.mock.calls[0][0]).toEqual(
        'https://api.gatherdata.co/models/account/records',
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
        id: 'my_account_id',
        traits: {
            name: 'Lovelace, Inc',
        },
    });

    expect(fetchMock.mock.calls[1][0]).toEqual(
        'https://api.gatherdata.co/models/user/records',
    );
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
        id: 'my_user_id',
        traits: {
            first_name: 'Ada',
            account_id: 'my_account_id',
        },
    });

    expect(fetchMock.mock.calls[2][0]).toEqual(
        'https://api.gatherdata.co/events',
    );
    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({
        user: 'my_user_id',
        type: 'page.viewed',
        properties: {
            title: 'Getting Started with The Babbage Machine',
            url: 'babbage.com',
        },
    });

    expect(fetchMock.mock.calls[3][0]).toEqual(
        'https://api.gatherdata.co/events',
    );
    expect(JSON.parse(fetchMock.mock.calls[3][1].body)).toEqual({
        user: 'my_user_id',
        type: 'order.created',
        properties: {
            product_name: 'Babbage Machine',
        },
    });
});
