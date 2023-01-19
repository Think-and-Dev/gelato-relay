import { EthereumContext } from '../eth/context';
import { createProvider } from '../eth/provider';
import { createInstance } from '../eth/counter';

import Counter from '../components/Counter';

import { ToastContainer } from 'react-toastify';

export default function Home() {
  const provider = createProvider();
  const counter = createInstance(provider);
  const ethereumContext = { provider, counter };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gasless Counter</h1>
        <p>powered by Gelato meta-transactions</p>
      </header>
      <section className="App-content">
        <EthereumContext.Provider value={ethereumContext}>
          <Counter />
        </EthereumContext.Provider>
      </section>
      <ToastContainer hideProgressBar={true} />
    </div>
  );
}
