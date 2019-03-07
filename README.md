![travis build](https://travis-ci.org/gather-data/gather-js.svg?branch=master "Travis build")

# Gather.js - Gather client for Javascript
The Javascript client for Gather makes it dead simple to authenticate your users with any SaaS applications supported by Gather. The main function within the client is `connectApplication` and is all you need authenticate your users within an application you've set up in Gather.

* [Usage](#usage)
* [Example](#example)
* [API](#api)

## Installation
```
yarn add gather-js
```

## Usage
You'll most likely use the client to authenticate your users with an application in Gather and it'll most likely happen when your users click a "Connect with X" in your product.

When `connectApplication` is called, it'll open a browser window to the third-party app that's been configured in the application in Gather. Once the user has either authorized or canceled the request, the promise returned will either throw an error or resolve with the authentication details.

### Step 1: Create a userTokenEndpoint
As the authentication flow happens in a browser window from your customer's session, we need a way to authenticate the request with Gather to ensure we know it was you who requested a user be added to your application. To do that you need to add a simple endpoint on your server that returns a JSON Web Token signed with your Gather secret key.

For example, here's how you'd do it in Express:
```javascript
app.post('/gather_user_token', (req, res) => {
  // Using HMAC_256
  const userToken = jwt.sign(
    {
      client_id: GATHER_CLIENT_ID,
      customer_id: {customer_id_from_request},
    },
    GATHER_SECRET_KEY,
  );

  res.setHeader('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      userToken,
    }),
  );
});
```

The endpoint must return a JSON object with three properties:
- `client_id` - this is your Gather client_id
- `customer_id` - this is a unique ID you use to refer to the customer that will be authenticated. This most likely will come from the user authenticated with the request to your server.

The JWT should be signed with HMAC_256.

**BEWARE: Make sure that this endpoint requires authentication to ensure no one can create auth request with Gather on your behalf**

### Step 2: Authenticate your customer
The next step is to use the Gather client to authenticate your user for a particular application.

First we instantiate the Gather client using the `userTokenEndpoint`:

```javascript
const gather = new Gather({userTokenEndpoint: 'https://mydomain.com/api/gather_user_token'});
```

The client returned is then authenticated with Gather **for the specific customer_id**. Any operation you perform with the client will only work for that customer.

Then, let's connect them to the application:

```javascript
const customerConfig = {
    'some': 'value',
}
const {uid, customerConfig} = await gather.connectApplication(applicationId, customerConfig);
```

- `applicationId` is the ID of the application to authenticate against
- `customerConfig` is an object you can use to store arbitrary configuration for the customer's authentication in Gather

This will returns a promise that resolves with the object:
```
{
    'uid': '123',
    'customer_config': {
        'some': 'value'
    }
}
```

- `uid` - a unique identifier within the external service being authenticated
- `customer_config` - the configuration set on the authentication for the customer

## Example
Checkout [the example](https://github.com/ben-davis/gather-js/tree/master/example) to see a working version. This example can also be used to test authentication for an application within Gather.

---

## API

* [Gather(config)](#gatherconfig)
* [connectApplication(applicationId, options)](#connectapplicationapplicationid-options)
* [updateCustomerConfig(applicationId, customerConfig)](#updateapplicationconfigapplicationid-customerconfig)
* [disconnectApplication(applicationId)](#disconnectapplicationapplicationid)

## `Gather(config)`

Instantiates a Gather client using the provided `config`. The config options are:

`userTokenEndpoint` - a URL to an endpoint on your server that returns a signed JWT for the current user

## `connectApplication(applicationId, options)`

Connects a user to an application you've set up in Gather. Calling this function opens a browser window that handles the entire OAuth process with the application.

- `applicationId`: **required** the ID of the application to connect the user to
- `options`: **optional** - Optional config, defined below

`options`
```
{
    // Any object data to store on the authentication for the customer
    customerConfig: {
        'some': 'value'
    }
}
```

Returns a promise that resolves with the following object:

```
{
    uid: '1234',
    customerConfig: {
        'some': 'value',
    }
}
```


## `updateCustomerConfigConfig(applicationId, customerConfig)`

Updates the customer configuration for an application.

- `applicationId`: **required** the ID of the application to update
- `customerConfig`: **required** - An object that shall be used to update the customer config

Returns a promise that resolves with the following object:

```
{
    uid: '1234',
    customerConfig: {
        'some': 'value',
    }
}
```

## `disconnectApplication(applicationId)`

Disconnects an application for the customer

- `applicationId`: **required** the ID of the application to disconnect
