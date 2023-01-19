# Example of Relaying Meta-Transactions Using Gelato
Demo code for relaying meta-transactions using [Gelato](https://www.gelato.network/) using the [client API](https://docs.gelato.network/developer-services/relay/quick-start/api#relay-endpoints).

This project consists of a sample _names registry_ contract that accepts registrations for names either directly or via a meta-transaction, along with a client Dapp, plus the meta-transaction relayer implementation.

## Environment

Expected `.env` file in the project root:

- `RELAY_API_KEY`: Gelato Relay API key.

To get the Realy keys you will need to [sign up to 1Balance](https://relay.gelato.network/). See more information [here](https://docs.gelato.network/developer-services/relay/payment-and-fees/1balance)

## Run the code
Once you set up the .env file you need to install the dependencies
`yarn install`

Then start the next app
`yarn dev`

It will start a webpage at localhost:3000 and a backend that is used for APIs.

## Warning if using Gelato SDK
Gelato comes with an SDK but it's meant to be used directly from the front end as relayWithSponsoredCallERC2771 needs a provider that can sign the transaction, as the wallet in most cases would be the user signing off-chain with Metamask this would have to go on the front end. 
But if we do that, we would expose our API KEY and an attacker may use your API KEY to relay their transactions. 

```js
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";

const counter = "0x...";
const abi = ["function increment()"];
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const user = signer.getAddress();

const contract = new ethers.Contract(counter, abi, signer);
const { payload } = await contract.populateTransaction.increment();

const relayRequest = {
  chainId: provider.network.chainId;
  target: counter;
  data: payload;
  user: user;
};

const apiKey = "stracciatella";

// Get user signature and send relay request to Gelato Relay
const relayResponse =
  await GelatoRelaySDK.relayWithSponsoredCallERC2771(relayRequest, provider, apiKey);

console.log(relayResponse);`
```

As we need to use this in the backend we ended up using the Gelato API instead.
Also, take into account that Gelato does not use the value field when relaying transactions so we can't relay ETH transfers.

## Highlights

The most important parts are:
- The smart contract needs to implement EIP-2771 and we need a minimal forwarder [Registry.](./contracts/Registry.sol)sol](./contracts/Registry.sol)
- User signing of chain using signType_v4 at [signer.js](./src/eth/signer.js)
- Send the signed message to the backend at [register.js](./src/eth/register.js), where is [sent to the relayer](./src/pages/api/relay.ts). Alternatively, if you don't want to use a backend you can use [Webhook](https://github.com/OpenZeppelin/workshops/blob/master/25-defender-metatx-api/app/src/eth/register.js#L10) and
[Autotask](https://github.com/OpenZeppelin/workshops/blob/master/25-defender-metatx-api/autotasks/relay/index.js)


## More info
This code is based on [Workshop 01](https://github.com/OpenZeppelin/workshops/tree/master/01-defender-meta-txs) which makes use of `defender-client` on the Goerli network. Functionality is supported across any of Defender's [supported chains](https://docs.openzeppelin.com/defender/#networks) -- simply modify the code.

Live demo running at [defender-metatx-workshop-demo.openzeppelin.com](https://defender-metatx-workshop-demo.openzeppelin.com/).

[Video tutorial](https://youtu.be/Bhz5LJbq9YY)

[Written guide](https://docs.openzeppelin.com/defender/guide-metatx)