import React, { useEffect, useState } from "react";
import CaretIcon from "../Icons/CaretIcon";
import Popup from "../Popup";
import CounterDownTimer from "../CounterDownTimer";
import Logo from "../../logo_dark.png";

// Add custom styles for animations
const customStyles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s infinite;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default function Pay({
  purchaseData,
  timer,
  percent,
  isPopupOpen,
  closePopup,
  handleClosePay,
}) {
  // Simple state management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Simple, reliable MPGS script loading with retry
  // Simple check for window.Checkout (preloaded by App.js)
  const checkMPGSReady = () => {
    return new Promise((resolve, reject) => {
      console.log('🔍 Checking for window.Checkout...');

      // Check if window.Checkout is available (should be preloaded by App.js)
      if (window.Checkout && typeof window.Checkout.configure === 'function') {
        console.log('✅ window.Checkout is ready!');
        resolve(true);
        return;
      }

      // If not available immediately, wait a bit (script might still be loading)
      console.log('⏳ Waiting for window.Checkout...');
      let attempts = 0;
      const maxAttempts = 30; // 3 seconds max

      const checkCheckout = () => {
        attempts++;

        if (window.Checkout && typeof window.Checkout.configure === 'function') {
          console.log('✅ window.Checkout is now ready!');
          resolve(true);
        } else if (attempts >= maxAttempts) {
          console.error('❌ window.Checkout not available. Please refresh the page.');
          reject(new Error('MPGS script not loaded. Please refresh the page.'));
        } else {
          setTimeout(checkCheckout, 100);
        }
      };

      checkCheckout();
    });
  };

  // Initialize checkout with session
  const initializeCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🚀 Starting checkout initialization...');

      // Step 1: Check if MPGS script is ready (preloaded by App.js)
      await checkMPGSReady();
      console.log('✅ Script loaded, fetching session...');

      // Step 2: Fetch session ID (using correct API format)
      const url = `${process.env.REACT_APP_BASE_URL}/?action=mpgSession`;
      const formData = new FormData();
      formData.append("returnUrl", `${process.env.REACT_APP_URL}view-ticket/${purchaseData.purchase_number}`);
      formData.append("amount", purchaseData.total);
      formData.append("id", purchaseData.purchase_number);
      formData.append("ticket_name", purchaseData.ticket_name);

      const sessionResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!sessionResponse.ok) {
        throw new Error(`Session creation failed: ${sessionResponse}`);
      }

      const sessionData = await sessionResponse.json();
      console.log('✅ Session created:', sessionData.session.id);

      // Step 3: Configure checkout
      window.Checkout.configure({
        session: {
          id: sessionData.session.id
        }
      });

      console.log('✅ Checkout configured');
      setCheckoutReady(true);
      setIsLoading(false);

      // Step 4: Show payment page
      window.Checkout.showPaymentPage();
      console.log('✅ Payment page shown');

    } catch (error) {
      console.error('❌ Checkout initialization failed:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Retry logic with exponential backoff
  const handleRetry = async () => {
    if (retryCount < 3) {
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      console.log(`🔄 Retry attempt ${newRetryCount}/3`);

      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, newRetryCount) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, delay));

      await initializeCheckout();
    } else {
      console.error('❌ Max retries reached');
      setError('Maximum retry attempts reached. Please refresh the page.');
    }
  };

  // Initialize on mount
  useEffect(() => {
    console.log('🎬 Pay component mounted, initializing checkout...');
    initializeCheckout();
  }, []);

  return (
    <div className="pay flex flex-col min-h-full sm:px-6 lg:px-8 h-[100vh] sm:h-auto pb-0">
      <div className="flex flex-row justify-between items-center shadow-[0_4px_4px_-1px_rgba(0,0,0,0.1)] p-6 sm:px-6 sm:py-6 mx-auto w-full sticky top-0 bg-[#fff] z-10">
        <div className="flex"></div>
        <img
          src={Logo}
          alt="Visa and Mastercard Logos"
          className={`h-[30px] w-[100%] object-contain`}
        />
        <div className="flex"></div>
      </div>
      <div className="flex flex-1 flex-col px-6 sm:mx-auto sm:w-full sm:max-w-lg   sm:px-6  h-min-[100vh] sm:h-auto pb-0 justify-start">
        <div className="flex flex-row justify-between items-center w-full">
          <h2 className="text-[26px] mt-[1rem] mb-[1rem] text-left w-full text-4xl leading-9 tracking-tight text-primary-orange">
            {/* Select your method of payment */}
          </h2>
          {/* <div className="w-[40px] flex justify-end">
            <button className="text-[20px] font-bold" onClick={handleClosePay}>
              &#x2715;
            </button>
          </div> */}
        </div>
        <CounterDownTimer timer={timer} percent={percent} />
        <div
          className={` mx-5 summaryCard rounded-lg cursor-pointer px-[28px] py-[15px] transition-all ease-in-out duration-500   bg-[#FFF7E0] mt-8 mb-0   `}
        >
          <div className={`flex items-center content-between w-full mb-3 mt-3`}>
            <p className="text-[14px] capitalize font-medium text-left flex-1 text-primary-orange">
              Invoice number
            </p>
            <p className="text-xs capitalize font-semibold text-right text-primary-orange w-[40%]">
              {purchaseData.purchase_number}
            </p>
          </div>
          <div className={`flex items-center content-between w-full`}>
            <p className="text-[14px] capitalize font-medium text-left flex-1 text-primary-orange">
              Total
            </p>
            <p className="text-xs capitalize font-semibold text-right text-primary-orange w-[40%]">
              AED {purchaseData.total}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-[400px] mx-5 my-5">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-orange"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary-orange rounded-full opacity-20"></div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-medium text-gray-700 mb-2">
                Preparing secure payment...
              </p>
              <p className="text-sm text-gray-500">
                Loading payment system, please wait
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mx-5 my-5 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Payment System Error
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
                <div className="mt-4">
                  {retryCount < 3 ? (
                    <button
                      onClick={handleRetry}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Try Again ({retryCount}/3)
                    </button>
                  ) : (
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Refresh Page
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {checkoutReady && !isLoading && !error && (
          <div className="mx-5 my-5 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Payment system ready! The checkout window should open automatically.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      <Popup isOpen={isPopupOpen} width="w-[90vw] sm:w-[50vw]">
        <h2 className="text-xl font-bold mb-2 text-center">Session Expired</h2>
        <p className="text-center m-3">
          Your Ticket booking session has been expired.
        </p>
        <div className="flex gap-0 sm:gap-2 justify-center flex-col  ">
          <div
            onClick={closePopup}
            // className="flex justify-between items-center text-white bg-black px-[1rem] py-[2rem] cursor-pointer mt-12"
            className="w-full text-center  flex   justify-center items-center text-white bg-black px-[1rem] py-[1rem] cursor-pointer mt-2"
          >
            Start new Booking
            <CaretIcon className="mx-2" />
          </div>
        </div>
      </Popup>
    </div>
  );
}