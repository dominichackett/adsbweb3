import '@/styles/global.scss'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { Chain } from 'wagmi/chains';

import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitSiweNextAuthProvider ,GetSiweMessageOptions} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import {
  getDefaultWallets,
  RainbowKitProvider,darkTheme 
} from '@rainbow-me/rainbowkit';
const fantomChain: Chain = {
  id: 4002,
  name: 'Fantom Testnet',
  network: 'fantom',
  nativeCurrency: {
    decimals: 18,
    name: 'Fantom',
    symbol: 'FTM',
  },
  rpcUrls: {
    default: {
      http: ['https://endpoints.omniatech.io/v1/fantom/testnet/public']
    },
    public: {
      http: ['https://endpoints.omniatech.io/v1/fantom/testnet/public']
    },
  },
  blockExplorers: {
    default: { name: 'FtmScan', url: 'https://testnet.ftmscan.com' },
  },
  testnet: false,
};
// Configure chains & providers
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider } = configureChains(
  [fantomChain],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'NFT Admissions',
  chains
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to NFT Admissions',
});

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: connectors,
  provider,
  
})

export default function App({ Component, pageProps }: AppProps) {
  return   <WagmiConfig client={client}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
  
    <RainbowKitSiweNextAuthProvider
  getSiweMessageOptions={getSiweMessageOptions}
>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>

  <Component {...pageProps} /></RainbowKitProvider></RainbowKitSiweNextAuthProvider>
  </SessionProvider></WagmiConfig>
}
