import { ethers, providers } from 'ethers';
import { signMetaTxRequest } from './signer';

async function sendMetaTx(counter: any, userProvider: providers.Web3Provider, chainId: number) {
  console.log(`Sending increaseCounter meta-tx using Gelato`);

  const signer = userProvider.getSigner();
  const from = await signer.getAddress();
  const unsignedTx = await counter.populateTransaction.incrementContext();
  
  const request = await signMetaTxRequest(userProvider, { 
    chainId: chainId,
    target: unsignedTx.to,
    data: unsignedTx.data,
    user: from,
  });

  console.log('request', request);

  const reponse = await fetch('/api/relay', {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
  return reponse.json();
}


export async function incrementCounter(counter: any, userProvider: providers.Web3Provider) {
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5) throw new Error(`Please switch to Goerli for signing`);
  
  return sendMetaTx(counter, userProvider, userNetwork.chainId);
}
