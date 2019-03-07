import 'whatwg-fetch';

import Gather from './gather';

type stubFunctionCall = (number | string | object)[];

interface GatherStub {
  user: stubFunctionCall[];
  account: stubFunctionCall[];
  page: stubFunctionCall[];
  track: stubFunctionCall[];
  clientId: string;
}

declare global {
  interface Window {
    gather: Gather | GatherStub;
  }
}

/* When this is loaded:
- global.client_id exists
- global[user|account|track|page] will each have an array that needs to be processed
*/
const gatherStub = window.gather;

if (!gatherStub) {
  throw new Error(
    'Cannot find your clientId. Have you copied the Gather.js snippet correctly?',
  );
}

const clientId = gatherStub.clientId;
const gather = new Gather({ clientId });

// Account comes before user
const methods = ['account', 'user', 'page', 'track'];
methods.forEach(method => {
  // @ts-ignore
  gatherStub[method].forEach((args: stubFunctionCall) => {
    // @ts-ignore
    gather[method](...args);
  });
});

window.gather = gather;
