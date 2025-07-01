import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Calendar, CircleCheckBig, DollarSign, Clock, LockKeyhole, LockOpen, User, X } from "lucide-react";

const stripePromise = loadStripe('pk_test_51Or1yFSIhFMykOAdbnb30ziuWvVCUQNkfFeEVwV0OcfiM2Prdc81Wl5vpbwE87UzbNs3BaI3CLf1jERmAtEzf0zz00lx2HcPeI');
const elementOptions = {
  style: {
    base: { fontSize: '14px', color: '#ffffff', backgroundColor: '#1a2232', '::placeholder': { color: '#9ca3af' } },
    invalid: { color: '#ef4444' },
  },
};

export default function Checkout() {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [country, setCountry] = useState("US");
  const [loading, setLoading] = useState(false);
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-[1000px] max-w-full rounded-2xl border border-blue-400 p-0 max-h-[860px]" style={{ background: "linear-gradient(180deg, #111113 0%, #0F172A 100%)" }}>
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            setIsOpen={setIsOpen} 
            email={email} 
            setEmail={setEmail} 
            nameOnCard={nameOnCard} 
            setNameOnCard={setNameOnCard} 
            country={country} 
            setCountry={setCountry} 
            zip={zip} 
            setZip={setZip} 
            loading={loading} 
            setLoading={setLoading}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}

interface CheckoutFormProps {
  setIsOpen: (open: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  nameOnCard: string;
  setNameOnCard: (name: string) => void;
  country: string;
  setCountry: (country: string) => void;
  zip: string;
  setZip: (zip: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
  success: boolean;
  setSuccess: (success: boolean) => void;
}

function CheckoutForm({ 
  email, setEmail, nameOnCard, setNameOnCard, 
  country, setCountry, zip, setZip, loading, setLoading,
  error, setError, success, setSuccess 
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        setError('Card information is incomplete.');
        setLoading(false);
        return;
      }
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: nameOnCard,
          email,
          address: {
            country,
            postal_code: zip
          }
        }
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message ?? 'Payment method error');
        setLoading(false);
        return;
      }

      console.log('Payment Method created:', paymentMethod);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          email,
          name: nameOnCard,
          amount: 29900,
          currency: 'usd',
          billing_details: {
            name: nameOnCard,
            email,
            address: {
              country,
              postal_code: zip
            }
          }
        }),
      });

      const paymentResult = await response.json();

      if (!response.ok) {
        setError(paymentResult.error || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentResult.requires_action) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          paymentResult.client_secret
        );

        if (confirmError) {
          setError(confirmError.message ?? 'Payment confirmation error');
          setLoading(false);
          return;
        }
      }

      if (paymentResult.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Payment error:', err);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="px-12 pt-10 pb-8 text-center">
        <div className="text-green-400 text-6xl mb-4">✓</div>
        <h2 className="text-white text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="text-gray-400 text-base mb-4">
          Welcome to StepIn Premium! You now have full access for 60 days.
        </p>
        <p className="text-gray-400 text-sm">
          Redirecting you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="px-12 pt-10 pb-8">
      <h2 className="text-white text-2xl font-bold text-center mb-2">Unlock the Real Story Behind Every Candidate</h2>
      <p className="text-gray-400 text-base text-center mb-8">Resumes show what they've done. StepIn shows who they are.</p>
      
      {error && (
        <div className="bg-red-900 border border-red-600 rounded-xl p-4 mb-6">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-14">
        <div>
          <div className="rounded-xl border border-blue-400 p-4 mb-7" style={{ background: "linear-gradient(90deg, #11171E 0%, #0D2B49 100%)" }}>
            <h3 className="text-white font-semibold mb-2 text-xl text-left flex justify-center">Your Plan</h3>
            <ul className="space-y-2 text-md font-[500]">
              <li className="flex items-center text-blue-100"><User className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Plan: StepIn Premium</li>
              <li className="flex items-center text-blue-100"><Calendar className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Duration: 60 days</li>
              <li className="flex items-center text-blue-100"><LockOpen className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Access: Unlimited candidate insights</li>
              <li className="flex items-center text-blue-100"><DollarSign className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Price: $299 (one-time)</li>
              <li className="flex items-center text-blue-100"><Clock className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Status: Founding rate, expires soon</li>
            </ul>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold mb-2 text-xl flex justify-center">Why StepIn Premium?</h3>
            <ul className="space-y-2 text-md font-[500]">
              <li className="flex items-center text-blue-100"><CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Full culture + technical fit breakdown</li>
              <li className="flex items-center text-blue-100"><CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Personality-driven insights</li>
              <li className="flex items-center text-blue-100"><CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Red flags and working style</li>
              <li className="flex items-center text-blue-100"><CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>No auto-renew, no hidden fees</li>
              <li className="flex items-center text-blue-100"><CircleCheckBig className="mr-2 font-[900] text-[#0A84FF]" height={20} width={20}/>Dedicated support during your pilot</li>
            </ul>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white text-md font-medium mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email Address" 
                className="w-full bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" 
                required 
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Card Information</label>
              <div className="bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 mb-2">
                <CardNumberElement options={elementOptions} />
              </div>
              <div className="flex gap-2 mb-2">
                <div className="bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 flex-1">
                  <CardExpiryElement options={elementOptions} />
                </div>
                <div className="bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 flex-1">
                  <CardCvcElement options={elementOptions} />
                </div>
              </div>
              <input 
                type="text" 
                value={nameOnCard} 
                onChange={(e) => setNameOnCard(e.target.value)} 
                placeholder="Name on Card" 
                className="w-full bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" 
                required 
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Country or Region</label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                placeholder="Country or Region" 
                className="w-full bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 mb-2" 
                required 
                disabled={loading}
              />
              <input 
                type="text" 
                value={zip} 
                onChange={(e) => setZip(e.target.value)} 
                placeholder="ZIP" 
                className="w-[43%] bg-[#1a2232] border border-[#0A84FF] rounded-xl px-4 py-2 text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" 
                required 
                disabled={loading}
              />
            </div>
            <div className="flex justify-center">
              <button 
                type="submit"
                disabled={!stripe || loading} 
                className="w-full hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-xl text-lg transition-colors duration-200 shadow-lg mt-2 disabled:opacity-50" 
                style={{ background: "linear-gradient(90deg, #0A84FF 0%, #33BFFF 100%)" }}
              >
                {loading ? 'Processing...' : 'Get Full Access – $299'}
              </button>
            </div>
          </form>
          <div>
            <p className="text-xs text-[#A0A0A0] text-center mt-2">No subscriptions. No surprises. You keep access for 60 days.</p>
            <p className="text-xs text-[#A0A0A0] flex flex-row justify-center mt-1"><LockKeyhole className="mr-2 text-[#0A84FF]" height={14} width={14}/>Secured by Stripe. Instant access on success.</p>
            <p className="text-xs text-[#A0A0A0] text-center">
              <span className="block mt-2 text-[#0A84FF] underline">Need help? <a href="mailto:support@stepincompany.com" className="text-[#0A84FF] underline">support@stepincompany.com</a></span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}