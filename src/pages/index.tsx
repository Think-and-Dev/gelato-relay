import { EthereumContext } from '../eth/context';
import { createProvider } from '../eth/provider';
import { createInstance } from '../eth/registry';

import Registrations from '../components/Registrations';
import Register from '../components/Register';

import { ToastContainer } from 'react-toastify';

export default function Home() {
  const provider = createProvider();
  const registry = createInstance(provider);
  const ethereumContext = { provider, registry };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Names Registry</h1>
        <p>powered by Defender Relayer meta-transactions</p>
      </header>
      <section className="App-content">
        <EthereumContext.Provider value={ethereumContext}>
          <Register />
          <Registrations />
        </EthereumContext.Provider>
      </section>
      <ToastContainer hideProgressBar={true} />
    </div>
  );
}
