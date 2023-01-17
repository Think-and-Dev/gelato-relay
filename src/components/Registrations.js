import { useContext, useState, useEffect } from "react";
import { EthereumContext } from "../eth/context";

const mapEvent = (event) => ({
  blockNumber: event.blockNumber,
  who: event.args.who,
  name: event.args.name,
  id: `${event.blockHash}/${event.transactionIndex}/${event.logIndex}`,
})

function Registrations() {
  const { registry, provider } = useContext(EthereumContext);
  const [registrations, setRegistrations] = useState(undefined);

  useEffect(() => {
    console.log('registry',registry)
    const filter = registry.filters.Registered();
    console.log('filter',filter)
    const listener = (...args) => {
      const event = args[args.length-1];
      setRegistrations(rs => [mapEvent(event), ...rs || []]);
    };
    
    const subscribe = async() => {  
      const latestBlock = await provider.getBlockNumber();
      const past = await registry.queryFilter(filter, Number(latestBlock) - 10000,latestBlock);
      console.log('past', past);
      setRegistrations((past.reverse() || []).map(mapEvent));
      registry.on(filter, listener);  
    }
    
    subscribe();
    return () => registry.off(filter, listener);
  }, [registry]);

  return <div className="Registrations">
    <h3>Last registrations 📝</h3>
    {registrations === undefined && (
      <span>Loading..</span>
    )}
    {registrations && (
      <ul>
        {registrations.map(r => (
          <li key={r.id}><span className="address">{r.who}</span> {r.name}</li>
        ))}
      </ul>
    )}
    {!process.env.NEXT_PUBLIC_QUICKNODE_URL && (
      <h3>Main rpc does not update this values, set NEXT_PUBLIC_QUICKNODE_URL if you want to see latest transactions</h3>
    )}
  </div>
}

export default Registrations;