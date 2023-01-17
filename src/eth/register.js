import { ethers } from 'ethers';
import { createInstance } from './forwarder';
import { signMetaTxRequest } from './signer';

async function sendMetaTx(registry, provider, signer, name) {
  console.log(`Sending register meta-tx to set name=${name}`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  const data = registry.interface.encodeFunctionData('register', [name]);
  const to = registry.address;
  
  const request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });
  console.log('request', request);

  return fetch('/api/relay', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function registerName(registry, provider, name) {
  if (!name) throw new Error(`Name cannot be empty`);
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5) throw new Error(`Please switch to Goerli for signing`);

  const signer = userProvider.getSigner();
  
  return sendMetaTx(registry, provider, signer, name);
}
