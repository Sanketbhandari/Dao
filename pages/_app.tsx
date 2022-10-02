import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import { ApeDaoProvider } from '../context/context'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai

function MyApp({ Component, pageProps }: AppProps) {
    return (
            <ThirdwebProvider desiredChainId={activeChainId}>
            <ApeDaoProvider>
                <Component {...pageProps} />
            </ApeDaoProvider>
            </ThirdwebProvider>
    )
}

export default MyApp
