import { post } from './fetch';

const API_URL = 'https://api.gatherdata.co';

interface GatherOptions {
  clientId: string;
}

interface GatherInterface {
  clientId: string;
  // This is to satisfy the browser tests that create a stubbed gather
  stubCalls?: object;
}

class Gather implements GatherInterface {
  public clientId: string;
  public accountId?: string;
  public userId?: string;
  public stubCalls?: object;

  public constructor(options: GatherOptions) {
    const { clientId } = options;

    this.clientId = clientId;
  }

  public account(accountId: string, properties: object): void {
    const data = {
      ...properties,
      id: accountId,
    };

    this.accountId = accountId;

    this.post('/models/account/records', data);
  }

  public user(userId: string, properties: object): void {
    const data = {
      ...properties,
      id: userId,
      account_id: this.accountId, // eslint-disable-line
    };

    this.userId = userId;

    this.post('/models/user/records', data);
  }

  public track(eventType: string, properties: object = {}): void {
    interface TrackData {
      type: string;
      properties: object;
      user?: string;
      account?: string;
    }

    const data: TrackData = {
      type: eventType,
      properties,
    };

    if (this.userId) {
      data.user = this.userId;
    } else if (this.accountId) {
      data.account = this.accountId;
    } else {
      throw new Error(
        'user() or account() must have been called before tracking events',
      );
    }

    this.post('/events', data);
  }

  public page(title?: string, url?: string): void {
    const properties = {
      title: title || document.title,
      url: url || location.href,
    };

    this.track('page.viewed', properties);
  }

  private post(url: string, data: object): void {
    const headers = this.getHeaders();
    const fullUrl = `${API_URL}${url}`;

    post(fullUrl, {
      headers,
      data,
    });
  }

  private getHeaders(): object {
    return {
      Authorization: `GatherJS ${this.clientId}`,
    };
  }
}

export default Gather;
