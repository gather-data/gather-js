[![Version](https://img.shields.io/npm/v/gather-js.svg)](https://www.npmjs.org/package/gather-js)
[![Build Status](https://travis-ci.org/gather-data/gather-js.svg?branch=master)](https://travis-ci.org/gather-data/gather-js)


# Gather.js - Gather client for Javascript
Gather.js provides a simple way to sync your accounts and users and push events to [Gather](https://gatherdata.co) directly from your website. To get started, choose your installation method:

* [Installation](#installation)
  * [Snippet for Basic Site](#snippet-for-basic-site)
  * [Snippet for Single Page App](#snippet-for-single-page-app)
  * [Via NPM](#via-apm)
* [Usage](#usage)

## Installation
### Install with snippet for basic site
If you have a basic website that has server-based pages that refresh on each page change, then you'll want to use this method. The snippet you'll include asynchronously loads the `gather.js` client, identifies the account and user, and sends a `page.viewed` event to track usage.

Copy and paste the following snippet into the `<head>` of each page you want to track:

  ```html
 <!-- Gather.js -->
 <script>
   (function(){var gather=window.gather=window.gather||{clientId:null,stubCalls:{user:[],track:[],page:[],account:[]}};if(typeof gather.track==="function"){return}if(gather.invoked){if(window.console&&console.error){console.error("Gather.js snippet included twice.")}return}gather.invoked=true;methods=["account","user","track","page"];gather.factory=function(method){return function(){var args=Array.prototype.slice.call(arguments);gather.stubCalls[method].push(args);return gather}};for(var i=0;i<methods.length;i++){var method=methods[i];gather[method]=gather.factory(method)}

     gather.clientId="GATHER_CLIENT_ID";
     gather.account("ACCOUNT_ID",{name:"MY ACCOUNT NAME"});
     gather.user("USER_ID",{
       first_name:"FIRST NAME",last_name:"LAST_NAME",email:"EMAIL"}
     );
     gather.page()})();
 </script>
 <script async src='https://unpkg.com/gather-js@latest/dist/index.umd.js'></script>
 <!-- End Gather.js -->

  ```

- `GATHER_CLIENT_ID` should be replaced with your Client ID, which you can find in your [settings](https://app.gatherdata.co/settings/client)
- `ACCOUNT_ID` and `MY_ACCOUNT_NAME` should be replaced with the account ID and name for the logged in user. Additional traits can be provided by adding extra keys to the 2nd argument of the `account()` call
- `USER_ID`, `FIRST_NAME`, `LAST_NAME`, and `EMAIL` should be replaced with the relevant info for the logged in user. Additional traits can be provided by adding extra keys to the 2nd argument of the `user()` call

### Install with snippet for single page app
If you have a single page app and want to easily install the client via snippet (as opposed to NPM), this is the method for you. The snippet you'll include asynchronously loads the `gather.js` client and makes an instance available via `window.gather`

Copy and paste the following snippet into the `<head>` of your page:

  ```html
 <!-- Gather.js -->
 <script>
   (function(){var gather=window.gather=window.gather||{clientId:null,stubCalls:{user:[],track:[],page:[],account:[]}};if(typeof gather.track==="function"){return}if(gather.invoked){if(window.console&&console.error){console.error("Gather.js snippet included twice.")}return}gather.invoked=true;methods=["account","user","track","page"];gather.factory=function(method){return function(){var args=Array.prototype.slice.call(arguments);gather.stubCalls[method].push(args);return gather}};for(var i=0;i<methods.length;i++){var method=methods[i];gather[method]=gather.factory(method)}

     gather.clientId="GATHER_CLIENT_ID";
 </script>
 <script async src='https://unpkg.com/gather-js@latest/dist/index.umd.js'></script>
 <!-- End Gather.js -->

  ```

- `GATHER_CLIENT_ID` should be replaced with your Client ID, which you can find in your [settings](https://app.gatherdata.co/settings/client)

### Install via NPM
To install via NPM:

```bash
npm install --save gather-js

or

yarn add gather-js
```

Create an instance using your `client_id`, which you can find in your [settings](https://app.gatherdata.co/settings/client):
```javascript
import Gather from 'gather-js';

const gather = new Gather({clientId: 'CLIENT_ID'});
```

## API

* [Gather({clientId})](#gatherclientid)
* [account(accountId, {name, ...})](#accountaccountid-name-)
* [user(accountId, {first_name, last_name, email, ...})](#useruserid-first_name-last_name-email-)
* [track(eventType, eventProperties)](#trackeventtype-eventproperties)
* [page({title, url, ...})](#pagetitle-url-extraproperties)

## `Gather({clientId})`
Instantiates a new Gather client using the provided `clientId`

## `account(accountId, {name, ...})`
Create or updates an account record identified by `accountId`. The only required field in the account traits is `name`. Additional fields are saved on the account.

## `user(userId, {first_name, last_name, email, ...})`
Create or updates a user record identified by `userId`. The required fields are `first_name`, `last_name`, and `email`. Additional fields are saved on the user.

**account() must be called before user()**

## `track(eventType, eventProperties)`
Tracks a new event with type `eventType` and `eventProperties`.

- `eventType` - one of the [built-in type](https://api.gatherdata.co/docs#tag/Event-Types) or any string for a custom event
- `eventProperties` - properties to store on the event, see [built-in types](https://api.gatherdata.co/docs#tag/Event-Types) for required properties for built-in event types

**account() or user() must be called before calling track()**

## `page(title?, url?, extraProperties)`
Creates a `page.viewed` event for the logged in user. If `title` or `url` are not provided, they are taken from `document.title` and `location.href`.

`extraProperties` are stored on the event.
