import { AuthProvider } from '../components/contexts/AuthContext';
import '../styles/globals.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from "../components/Navbar";
import 'swiper/css';
import DrawerContainer from "../components/DrawerContainer";
import Head from 'next/head';



const stripePromise = loadStripe("pk_test_51FphUvF84nza37ikyfwSvhsQsIIMr7l0Gx9ou225c6TRs191y9IlLmcEvuLolsuNGmofgEj5n0kRXl6JGktkaTYA00hoj2pJBo");

function MyApp({ Component, pageProps, metaTags }) {

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/ggHemIcon.png" />
        {metaTags &&
          Object.entries(metaTags).map((entry) => (
            <meta property={entry[0]} content={entry[1]} />
          ))}
      </Head>
      <Elements stripe={stripePromise}>
        <AuthProvider>
          <div className="drawer drawer-end">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content min-h-screen">
              <Navbar />
              <Component {...pageProps} />
            </div>
            <DrawerContainer />
          </div>
          {/* <Footer></Footer> */}
        </AuthProvider>
      </Elements>
    </>
  )
}

export default MyApp
