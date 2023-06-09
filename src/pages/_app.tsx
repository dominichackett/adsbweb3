import '@/styles/global.scss'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { Chain ,goerli,optimismGoerli,gnosisChiado,filecoinHyperspace} from 'wagmi/chains';

import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitSiweNextAuthProvider ,GetSiweMessageOptions} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import {
  getDefaultWallets,
  RainbowKitProvider,darkTheme 
} from '@rainbow-me/rainbowkit';




const zkEVM :Chain = {
    id:1442,
    name:"zkEVM Testnet",
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://explorer.public.zkevm-test.net']
      },
      public: {
        http: ['https://explorer.public.zkevm-test.net']
      },
    },
    blockExplorers: {
      default: { name: 'zkScan', url: 'https://explorer.public.zkevm-test.net' },
    },
    testnet: true,
  };

  
  

  const scrollTestnet :Chain = {
    id:534353,
    name:"Scroll Testnet",
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://alpha-rpc.scroll.io/l2']
      },
      public: {
        http: ['https://alpha-rpc.scroll.io/l2']
      },
    },
   
    testnet: true,
  };
    

// Configure chains & providers
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider } = configureChains(
  [gnosisChiado,zkEVM,optimismGoerli,scrollTestnet,filecoinHyperspace,goerli],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'Ads-B Web3',
  chains
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Ads-b Web3',
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
