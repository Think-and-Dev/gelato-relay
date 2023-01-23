import { useEffect, useState, useContext } from 'react';
import { useForm } from "react-hook-form";
import { incrementCounter, incrementCounterByStep } from '../eth/increment';
import { EthereumContext } from "../eth/context";
import { getTaskStatus } from "../eth/status";
import { useInterval } from "../hooks/useInterval";
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

export default function Counter() {
  const [submitting, setSubmitting] = useState(false);
  const [taskId, setTaskId] = useState(undefined);
  const [taskState, setTaskState] = useState(undefined);
  const [userCount, setUserCount] = useState(undefined);
  const [userAddress, setUserAddress] = useState(undefined);
  const [userProvider, setUserProvider] = useState(undefined);
  const { counter } = useContext(EthereumContext);
  const { handleSubmit } = useForm();
  
  if (typeof window !== "undefined") {
    useEffect(() => {
      const connectWallet = async () => {
        const metamask = window.ethereum;
        if (!metamask) {
          setUserAddress(undefined);
          setUserProvider(undefined);
          alert(`User wallet not found`);
          return;
        }
      
        await metamask.enable();
        const provider = new ethers.providers.Web3Provider(metamask);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
        setUserProvider(provider);
        const userNetwork = await provider.getNetwork();
        if (userNetwork.chainId !== 5) {
          alert(`Please switch to Goerli for signing`);
          return;
        }
      }
      connectWallet();
    }, [window.ethereum]);

    const getCount = async() => {  
      if (window.ethereum && userAddress && counter) {
        const count = await counter.contextCounter(userAddress);
        setUserCount(count);
      }
    }

    useEffect(() => {
      getCount();
    }, [window.ethereum, userAddress, counter]);

    useInterval(async () => {
      if (submitting && taskId) {
        const status = await getTaskStatus(taskId);
        setTaskState(status.taskState)
        console.log('status', status)
        if (status && status.taskState !== "CheckPending") {
          setSubmitting(false);
          setTaskId(undefined);
          getCount();
          if(status.taskState !== 'Cancelled'){
            setTaskState(undefined)
          }
        }
      }
    }, 3000);
  }

  const onIncrementCounter = async () => {
    const response = await incrementCounter(counter, userProvider);
    sendTx(response)
  }

  const onIncrementCounterByStep = async () => {
    const response = await incrementCounterByStep(counter, userProvider);
    sendTx(response) 
  }


  const sendTx = async (response) => {
    //event.preventDefault();
    setSubmitting(true);
    setTaskState(undefined);
    
    try {
      console.log('response.taskId', response.taskId)
      setTaskId(response.taskId);
      toast('Transaction sent!', { type: 'info' });
    } catch(err) {
      console.error(err)
      toast(err.message || err, { type: 'error' });
      setSubmitting(false);
    }
  }

  return <div>
    <div className="Container">
      <form>
        <label>Your address</label>
        <input placeholder="0x..." disabled value={userAddress || ''}/>
        <button type="submit" disabled={submitting} onClick={handleSubmit(onIncrementCounter)}>
          {submitting ? 'Increasing Counter...' : 'Increment Count'}
        </button>

        <button type="submit" disabled={submitting} onClick={handleSubmit(onIncrementCounterByStep)}>
          {submitting ? 'Increasing Counter By Step...' : 'Increment Count By Step'}
        </button>

      </form>
    </div>
    <div className="Registrations">
      <h3>Current Count 📝</h3>
      {userCount === undefined && (
        <p>Loading..</p>
      )}
      { taskState && (
        <p>{taskState}</p>
      )}
      {userCount && (
        <p>{userCount.toString()}</p>
      )}
    </div>
  </div>
}
