"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function CookieConsentBanner({ onChange }: { onChange: () => void }) {
    const [showComponent, setShowComponent] = useState(false);
    const cookieConsent = Cookies.get('consent');

    useEffect(() => {
        console.log("useEffect CookieConsentBanner cookieConsent", cookieConsent);
        if (cookieConsent === "true") {
            setShowComponent(false);
        }
        else {
            setShowComponent(true);
        }
    }, [cookieConsent]);

    const handleAccept = () => {
        // Set cookie or perform other actions
        Cookies.set('consent', 'true', { expires: 365 }); // Expires in 1 year
        onChange();
    };

    const handleDecline = () => {
        // Remove cookie or perform other actions
        setShowComponent(false);
        Cookies.remove('consent');
        onChange();
    };

    return (
        <>
            {showComponent && (
                <div className='flex flex-row justify-around'>
                    <div className="fixed bottom-2 max-w-3xl w-full mx-auto p-4 rounded-md cookie-surface theme-text">
                        <div className='flex flex-auto justify-between items-center'>
                            <div>
                                <p className="text-lg">
                                    This website uses Google analytics cookies to obtain visitor data.<br />
                                </p>
                                <span className='text-sm'>I use this information to understand how many users are visiting this site, and to gain experience using Analytics.</span>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    className="cookie-bg-primary text-white cookie-button-border border-x border-y py-2 px-4 rounded-md mr-2"
                                    onClick={handleAccept}
                                >
                                    Accept
                                </button>
                                <button
                                    className="cookie-bg-secondary text-white cookie-button-border border-x border-y py-2 px-4 rounded-md mr-2"
                                    onClick={handleDecline}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};