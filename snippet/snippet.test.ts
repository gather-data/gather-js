import { JSDOM } from 'jsdom';

const snippet = require('./snippet.html');

test('works', () => {
    const dom = new JSDOM(
        `
        <html>
            <head>
                <title>Lovelace, Inc</title>
                ${snippet}
            </head>
        </html>
    `,
        { runScripts: 'dangerously' },
    );

    dom.window.location.href === 'babbage.com';

    expect(dom.window.gather.clientId).toEqual('GATHER_CLIENT_ID');
    expect(dom.window.gather.stubCalls).toEqual({
        user: [
            [
                'USER_ID',
                {
                    first_name: 'FIRST NAME',
                    last_name: 'LAST_NAME',
                    email: 'EMAIL',
                },
            ],
        ],
        account: [['ACCOUNT_ID', { name: 'MY ACCOUNT NAME' }]],
        track: [],
        page: [[]],
    });
});
