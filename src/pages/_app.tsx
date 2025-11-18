import React from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";
import Layout from "../layout";

const CurrencyConverterApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Currency Converter | Live Exchange Rates</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Convert between AUD, USD, EUR, GBP, CAD, and NZD with live exchange rates and 14-day historical charts."
        />
        <meta
          name="keywords"
          content="currency converter, AUD, USD, EUR, GBP, CAD, NZD, exchange rate, forex, currency exchange"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default CurrencyConverterApp;
