# Example of Relaying Meta-Transactions Using Open Zeppelin Defender
Demo code for relaying meta-transactions using [OpenZeppelin Defender](https://openzeppelin.com/defender) using the [client API](https://docs.openzeppelin.com/defender/relay-api-reference).

This project consists of a sample _names registry_ contract that accepts registrations for names either directly or via a meta-transaction, along with a client Dapp, plus the meta-transaction relayer implementation.

## Environment

Expected `.env` file in the project root:

- `RELAY_API_KEY`: Defender Relay API key.
- `RELAY_API_SECRET`: Defender Relay API secret.
`NEXT_PUBLIC_QUICKNODE_URL`Rpc URL that accepts historical queries, can be quicknode, alchemy, etc. If it's null default will show a list of older transactions.

To get the Realy keys you will need to [sign up to Defender](https://defender.openzeppelin.com/).

## Run the code
Once you set up the .env file you need to install the dependencies
`yarn install`

Then start the next app
`yarn dev`

It will start a webpage at localhost:3000 and a backend that is used for APIs.

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