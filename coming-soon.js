(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const config = window.PALME_CONFIG || {};
  const contact = config.contact || {};
  const target = new Date(2027, 0, 1, 0, 0, 0);
  const cookieConsentKey = 'palme-cookie-consent';

  function loadAnalytics() {
    const id = config.analytics?.measurementId;
    if (typeof id !== 'string' || !/^G-[A-Z0-9]{6,}$/i.test(id.trim())) return;
    const measurementId = id.trim();
    if (document.querySelector(`script[data-google-analytics="${measurementId}"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.googleAnalytics = measurementId;
    document.head.append(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });
  }

  function storedCookieConsent() {
    try { return window.localStorage.getItem(cookieConsentKey); } catch (_) { return null; }
  }

  function saveCookieConsent(value) {
    try { window.localStorage.setItem(cookieConsentKey, value); } catch (_) { /* The banner will reappear when storage is unavailable. */ }
  }

  const cookieBanner = $('#cookie-banner');
  const acceptCookies = $('#accept-cookies');
  const rejectCookies = $('#reject-cookies');
  if (cookieBanner && acceptCookies && rejectCookies) {
    const cookieConsent = storedCookieConsent();
    if (cookieConsent === 'accepted') loadAnalytics();
    else if (cookieConsent !== 'rejected') cookieBanner.hidden = false;
    acceptCookies.addEventListener('click', () => {
      saveCookieConsent('accepted');
      cookieBanner.hidden = true;
      loadAnalytics();
    });
    rejectCookies.addEventListener('click', () => {
      saveCookieConsent('rejected');
      cookieBanner.hidden = true;
    });
  }

  const format = value => String(value).padStart(2, '0');
  const updateCountdown = () => {
    const remaining = Math.max(0, target.getTime() - Date.now());
    const seconds = Math.floor(remaining / 1000);
    $('#days').textContent = format(Math.floor(seconds / 86400));
    $('#hours').textContent = format(Math.floor((seconds % 86400) / 3600));
    $('#minutes').textContent = format(Math.floor((seconds % 3600) / 60));
    $('#seconds').textContent = format(seconds % 60);
  };

  const location = typeof contact.location === 'string' ? contact.location.trim() : '';
  const email = typeof contact.email === 'string' ? contact.email.trim() : '';
  const phone = typeof contact.phone === 'string' ? contact.phone.trim() : '';
  const hasEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email);
  const hasPhone = /^\+?[0-9\s().-]{6,24}$/.test(phone);

  $('#opening-date').textContent = 'We tellen af naar 1 januari 2027.';
  $('#contact-location').textContent = location || 'IJsselstein';
  $('#year').textContent = new Date().getFullYear();

  if (hasEmail) {
    const emailLink = $('#contact-email');
    emailLink.textContent = email;
    emailLink.href = `mailto:${encodeURIComponent(email)}`;
    emailLink.hidden = false;
  }
  if (hasPhone) {
    const phoneLink = $('#contact-phone');
    phoneLink.textContent = phone;
    phoneLink.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
    phoneLink.hidden = false;
  }
  $('#contact-pending').hidden = hasEmail || hasPhone;

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
})();