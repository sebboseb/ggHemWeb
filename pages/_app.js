import { AuthProvider } from '../components/contexts/AuthContext';
import '../styles/globals.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from "../components/Navbar";
import 'swiper/css';
import DrawerContainer from "../components/DrawerContainer";
import Head from 'next/head';
import Footer from '../components/Footer';
import Layout from '../components/Layout';



const stripePromise = loadStripe("pk_test_51FphUvF84nza37ikyfwSvhsQsIIMr7l0Gx9ou225c6TRs191y9IlLmcEvuLolsuNGmofgEj5n0kRXl6JGktkaTYA00hoj2pJBo");

function MyApp({ Component, pageProps }) {

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/ggHemIcon.png" />
        <meta name="og:url" content="https://gghem.se/" />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content="ggHem | Handla glass med fri hemleverans"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="og:description"
          content="Välj bland massa goda glassar med snabb och fri hemleverans!"
        />
        <meta name="og:image" content={"/ggHemIcon.png"} />
      </Head>
      <Elements stripe={stripePromise}>
        <AuthProvider>
          <Layout>
            <Navbar />
            <Component {...pageProps} />
            <Footer />
          </Layout>
        </AuthProvider>
      </Elements>
    </>
  )
}

export default MyApp
