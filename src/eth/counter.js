import { ethers } from 'ethers';
import deployJson from '../../contracts/deploy.json';
import CounterERC2771Abi from '../../contracts/CounterERC2771.json';
const address = deployJson.CounterERC2771
const abi = CounterERC2771Abi

export function createInstance(provider) {
  return new ethers.Contract(address, abi, provider);
}
