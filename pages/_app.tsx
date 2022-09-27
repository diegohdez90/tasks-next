import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/client';
import { useEffect, useState } from 'react';


function MyApp({ Component, pageProps }: AppProps) {
  const [apolloClient, setApolloClient] = useState<ApolloClient<any>>(useApollo(pageProps.initialApolloState));
  //const [apolloClient, setApolloClient] = useState<ApolloClient<any> | null>(null);
  //useEffect(() => {
  //  setApolloClient(() => useApollo(pageProps.initialApolloState));
  //},
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //[]);
  return <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
}

export default MyApp
