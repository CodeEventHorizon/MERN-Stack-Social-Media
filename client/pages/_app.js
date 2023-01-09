// Next API Reference
import Head from "next/head";

// Custom Components
import NavigationBar from "../components/NavigationBar";
import { UProvider } from "../context";

// Toast
import { ToastContainer } from "react-toastify";

// Styles
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// MyApp (_app.js) is an Advanced feature in next.js that overrides default `App`
// and creates a custom `App`
function MyApp({ Component, pageProps }) {
  return (
    <UProvider>
      <Head>
        <title>Social Media by Nikoloz Muladze</title>
        {/* metas are for SEO */}
        <meta name="description" content="Social Media" />
        <meta property="og:description" content="Social Media" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Social Media" />
        {/* <meta property="og:url" content="http://..." /> */}
        {/* Styles */}
        <link rel="stylesheet" href="/css/customStyles.css" />
      </Head>
      <NavigationBar />
      <ToastContainer position="top-center" />
      <Component {...pageProps} />
    </UProvider>
  );
}

export default MyApp;
