import {configureChains, createConfig} from 'wagmi'
import {goerli} from 'wagmi/chains'
import {CoinbaseWalletConnector} from 'wagmi/connectors/coinbaseWallet'
import {InjectedConnector} from 'wagmi/connectors/injected'
import {MetaMaskConnector} from 'wagmi/connectors/metaMask'

import {alchemyProvider} from 'wagmi/providers/alchemy'

const {chains, publicClient, webSocketPublicClient} = configureChains(
    [goerli],
    [
        alchemyProvider({apiKey: import.meta.env?.VITE_ALCHEMY_API_KEY}),
    ],
)

export const config = createConfig({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({chains}),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: 'wagmi',
            },
        }),
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
    publicClient,
    webSocketPublicClient,
})
