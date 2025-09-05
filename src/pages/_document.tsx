import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png"></link>
        <meta name="theme-color" content="#0070f3" />
      </Head>
      <body className="antialiased  ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
