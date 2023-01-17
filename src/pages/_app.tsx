import '@/styles/app.css'
import '@/styles/index.css'
import '@/styles/register.css'
import '@/styles/registrations.css'
import 'react-toastify/dist/ReactToastify.css';

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
