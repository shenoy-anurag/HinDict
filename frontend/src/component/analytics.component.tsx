"use client";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { GoogleAnalytics } from '@next/third-parties/google';
import CookieConsentBanner from '@/component/cookie-consent.component';

export default function AnalyticsWrapper() {
  const [consent, setConsent] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(Cookies.get('consent'));

  useEffect(() => {
    console.log("useEffect AnalyticsWrapper cookieConsent", cookieConsent);
    if (cookieConsent === "true") {
      setConsent(true);
    } else { setConsent(false); }
  }, [cookieConsent]);

  const handleConsent = () => {
    setCookieConsent(Cookies.get('consent'));
  }

  return (
    <>
      {consent && (
        <GoogleAnalytics gaId="G-KXT5VL09V8" />
      )}
      <CookieConsentBanner onChange={handleConsent} />
    </>
  )
}
