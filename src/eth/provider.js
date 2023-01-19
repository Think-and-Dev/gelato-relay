/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';

const MAIN_ENDPOINT = 'https://rpc.ankr.com/eth_goerli';

export function createProvider() {  
  return new ethers.providers.JsonRpcProvider(MAIN_ENDPOINT, 5);
}