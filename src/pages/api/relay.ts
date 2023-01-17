import { ethers } from 'ethers';
import { DefenderRelaySigner, DefenderRelayProvider } from 'defender-relay-client/lib/ethers';

import { ForwarderAbi } from '../../eth/forwarder';
import deployJson from '../../../contracts/deploy.json';
import { NextApiRequest, NextApiResponse } from 'next';
const ForwarderAddress = deployJson.MinimalForwarder;
const RegistryAddress = deployJson.Registry;

async function relay(forwarder: any, request: any, signature: any, whitelist: any = undefined) {
  // Decide if we want to relay this request based on a whitelist
  const accepts = !whitelist || whitelist.includes(request.to);
  if (!accepts) throw new Error(`Rejected request to ${request.to}`);

  // Validate request on the forwarder contract
  const valid = await forwarder.verify(request, signature);
  if (!valid) throw new Error(`Invalid request`);
  
  // Send meta-tx through relayer to the forwarder contract
  const gasLimit = (parseInt(request.gas) + 50000).toString();
  return await forwarder.execute(request, signature, { gasLimit });
}

export default async function handler(req: NextApiRequest, res:  NextApiResponse) {
  const API_KEY = process.env.RELAY_API_KEY;
  if (!API_KEY) throw new Error(`Missing relayer api key`);
  const API_SECRET = process.env.RELAY_API_SECRET;
  if (!API_SECRET) throw new Error(`Missing relayer api secret`);

  const {request, signature} = req.body;

  console.log(`Relaying`, request);
  
  // Initialize Relayer provider and signer, and forwarder contract
  const credentials = { apiKey: API_KEY, apiSecret: API_SECRET };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
  const forwarder = new ethers.Contract(ForwarderAddress, ForwarderAbi, signer);
  
  // Relay transaction!
  const tx = await relay(forwarder, request, signature);
  console.log(`Sent meta-tx: ${tx.hash}`);
  return res.status(200).json({ txHash: tx.hash });
}
