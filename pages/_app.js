import { AuthProvider } from '../components/contexts/AuthContext';
import '../styles/globals.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51FphUvF84nza37ikyfwSvhsQsIIMr7l0Gx9ou225c6TRs191y9IlLmcEvuLolsuNGmofgEj5n0kRXl6JGktkaTYA00hoj2pJBo");

function MyApp({ Component, pageProps }) {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Elements>
  )
}

export default MyApp
