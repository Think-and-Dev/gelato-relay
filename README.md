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

Take into account that Gelato does not use the value field when relaying transactions so we can't relay ETH transfers.

Example addresses are sometimes wrong in gelato docs, trusted forwarder used by the SDK is 0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0d, but the deployed example contracts are pointing to the wrong address so we had to deploy new ones https://github.com/Think-and-Dev/gelato-relay-contract.
In case you are getting errors that don't make much sense try reaching out to [their discord](https://discord.com/channels/733646962045222912/975978574857256980)


## Highlights

The most important parts are:
- The smart contract needs to implement [EIP-2771](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/metatx/ERC2771Context.sol) and we need to use [GelatoRelayERC2771 at 0xBf175FCC7086b4f9bd59d5EAE8eA67b8f940DE0don](https://github.com/gelatodigital/relay-context-contracts/blob/master/contracts/GelatoRelayContextERC2771.sol)
- User signing of chain using signType_v4 at [signer.js](./src/eth/signer.js)
- Send the signed message to the backend at [increment.js](./src/eth/increment.ts), where is [sent to the relayer](./src/pages/api/relay.ts).


## More info
This code is based on [Gelato [examples](https://docs.gelato.network/developer-services/relay/quick-start/sponsoredcallerc2771#example-code) which make use of `gelato sdk and relayers` on the Goerli network. Functionality is supported across any of Gelato's [supported chains](https://docs.gelato.network/developer-services/automate/supported-networks) -- simply modify the code.

