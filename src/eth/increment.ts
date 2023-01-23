import { ethers, providers } from 'ethers';
import { signMetaTxRequest } from './signer';


async function incrementContextUnsignedTx(counter: any) {
  return counter.populateTransaction.incrementContext();
}

async function incrementContextByStepUnsignedTx(counter: any, step: number) {
  return counter.populateTransaction.incrementContextByStep(step);
}

async function sendMetaTx(counter: any, userProvider: providers.Web3Provider, chainId: number, unsignedTx: any) {
  console.log(`Sending meta-tx using Gelato`);

  const signer = userProvider.getSigner();
  const from = await signer.getAddress();
  
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
  return sendMetaTx(counter, userProvider, userNetwork.chainId, await incrementContextUnsignedTx(counter));
}

export async function incrementCounterByStep(counter: any, userProvider: providers.Web3Provider) {
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 5) throw new Error(`Please switch to Goerli for signing`);
  return sendMetaTx(counter, userProvider, userNetwork.chainId, await incrementContextByStepUnsignedTx(counter,5));
}
