/* PALME: dependency-free, public-facing website.
 * There is intentionally no API client or personal-data storage in this bundle.
 * Official Virtuagym public URLs/iframes are configured in config.js.
 */
(() => {
  'use strict';
  const config = window.PALME_CONFIG || {};
  const vg = config.virtuagym || {};
  const preview = config.preview !== false;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  // Only explicit HTTPS destinations are accepted for membership and booking.
  function publicUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value.trim());
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
    } catch (_) { return ''; }
  }
  function photoUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    if (/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)) return value;
    if (/^assets\/[a-z0-9_.\/-]+$/i.test(value) && !value.includes('..')) return value;
    return publicUrl(value);
  }
  function serviceSettings(key) {
    return { url: publicUrl(vg[key]?.url), embedUrl: publicUrl(vg[key]?.embedUrl) };
  }

  // Photo failures never leave a broken-image icon in the layout.
  $$('[data-photo]').forEach(image => {
    image.addEventListener('load', () => image.classList.add('is-loaded'));
    image.addEventListener('error', () => {
      image.classList.add('is-error');
      image.parentElement.setAttribute('role', 'img');
      image.parentElement.setAttribute('aria-label', `${image.alt}. Extern sfeerbeeld niet beschikbaar.`);
    });
    const src = photoUrl(config.images?.[image.dataset.photo]);
    if (src) image.src = src;
    else image.dispatchEvent(new Event('error'));
    if (image.complete && image.naturalWidth) image.classList.add('is-loaded');
  });

  const header = $('#site-header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 35);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  $('#year').textContent = new Date().getFullYear();
  $('#preview-badge').hidden = !preview;
  $('#concept-note').hidden = !preview;

  const contact = config.contact || {};
  if (typeof contact.location === 'string' && contact.location.trim()) {
    $('#contact-location').textContent = contact.location.trim();
  }
  const email = typeof contact.email === 'string' ? contact.email.trim() : '';
  const validEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) && !/[\r\n]/.test(email);
  if (validEmail) {
    const link = $('#contact-email');
    link.textContent = email;
    link.href = `mailto:${encodeURIComponent(email)}`;
    link.hidden = false;
  }
  const phone = typeof contact.phone === 'string' ? contact.phone.trim() : '';
  if (/^\+?[0-9\s().-]{6,24}$/.test(phone)) {
    const link = $('#contact-phone');
    link.textContent = phone;
    link.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
    link.hidden = false;
  }

  const menu = $('#mobile-menu');
  const menuToggle = $('#menu-toggle');
  const dialog = $('#service-dialog');
  const dialogBody = $('#service-body');
  let serviceTrigger = null;
  function updateScrollLock() {
    document.body.classList.toggle('modal-open', menu.open || dialog.open);
  }
  function closeMenu() {
    if (menu.open) menu.close();
    menuToggle.setAttribute('aria-expanded', 'false');
    updateScrollLock();
  }
  menuToggle.addEventListener('click', () => {
    if (menu.open) closeMenu();
    else {
      menu.showModal();
      menuToggle.setAttribute('aria-expanded', 'true');
      updateScrollLock();
    }
  });
  $('[data-close-menu]').addEventListener('click', closeMenu);
  menu.addEventListener('close', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    updateScrollLock();
  });
  $$('a[href^="#"]', menu).forEach(link => link.addEventListener('click', closeMenu));
  const breakpoint = window.matchMedia('(min-width: 961px)');
  breakpoint.addEventListener('change', event => { if (event.matches) closeMenu(); });
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    dialogBody.replaceChildren(); // Unmount third-party iframes on close.
    updateScrollLock();
    if (serviceTrigger && document.contains(serviceTrigger)) {
      (menu.contains(serviceTrigger) ? menuToggle : serviceTrigger).focus({ preventScroll: true });
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  function openDialog(title, eyebrow = 'Jouw moment bij PALM\u00c9') {
    serviceTrigger = document.activeElement;
    closeMenu();
    $('#service-title').textContent = title;
    $('#service-eyebrow').textContent = eyebrow;
    dialogBody.replaceChildren();
    if (!dialog.open) dialog.showModal();
    updateScrollLock();
    $('#dialog-close').focus({ preventScroll: true });
  }
  function paragraph(text, className) {
    const p = make('p', className || '', text);
    dialogBody.append(p);
    return p;
  }
  function closeAction(label = 'Verder ontdekken') {
    const actions = make('div', 'dialog-actions');
    const close = make('button', 'button button-green', `${label} \u2192`);
    close.type = 'button';
    close.addEventListener('click', () => dialog.close());
    actions.append(close);
    if (validEmail) {
      const mail = make('a', 'text-link', 'Stel je vraag per e-mail');
      mail.href = `mailto:${encodeURIComponent(email)}`;
      actions.append(mail);
    }
    dialogBody.append(actions);
  }
  function iframeElement(src, title) {
    const frame = document.createElement('iframe');
    frame.title = title;
    frame.src = src;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-downloads');
    frame.setAttribute('allow', 'payment');
    return frame;
  }
  function fallbackLink(url, prefix) {
    const note = make('p', 'embed-fallback', `${prefix} `);
    const link = make('a', '', 'Open in een nieuw tabblad \u2197');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    note.append(link);
    dialogBody.append(note);
  }

  const serviceCopy = {
    login: { title: 'Welkom terug.', detail: 'Hier ga je straks rechtstreeks naar de beveiligde Virtuagym-ledenomgeving van Palm\u00e9 Club.', missing: 'De persoonlijke ledenlogin is nog niet aangesloten. In deze preview kun je niet inloggen.' },
    signup: { title: 'Jouw volgende hoofdstuk.', detail: 'Ontdek straks de lidmaatschappen en schrijf je in via de offici\u00eble Virtuagym-webshop van Palm\u00e9 Club.', missing: 'De inschrijfkoppeling en definitieve tarieven ontbreken nog. Er wordt in deze preview geen lidmaatschap afgesloten of betaling verwerkt.' },
    trial: { title: 'Voel je welkom.', detail: 'Ontdek de sfeer van Palm\u00e9 Club en neem een moment om te kijken wat bij jou past.', missing: 'De kennismakingskoppeling is nog niet aangesloten. Er wordt in deze preview geen afspraak gepland, aanvraag verstuurd of contactgegeven opgeslagen.' }
  };
  function openService(key) {
    if (!Object.hasOwn(serviceCopy, key)) return;
    const settings = serviceSettings(key);
    const copy = serviceCopy[key];
    if (settings.embedUrl) {
      openDialog(copy.title, 'Palm\u00e9 Club \u00d7 Virtuagym');
      paragraph('Je gebruikt hieronder de externe, offici\u00eble clubomgeving. Vul persoonlijke gegevens alleen in als je de getoonde club herkent.', 'dialog-note');
      dialogBody.append(iframeElement(settings.embedUrl, `${copy.title} Virtuagym`));
      fallbackLink(settings.url || settings.embedUrl, 'Wordt het venster niet goed geladen?');
      return;
    }
    if (settings.url) {
      // Same-tab navigation also works without popup permissions.
      window.location.assign(settings.url);
      return;
    }
    openDialog(copy.title, preview ? 'Websiteconcept \u00b7 nog niet live gekoppeld' : 'Binnenkort beschikbaar');
    paragraph(copy.detail);
    paragraph(preview ? copy.missing : 'Deze online functie is nog niet beschikbaar. Neem contact op met de club om de mogelijkheden te bespreken.', 'dialog-note');
    closeAction();
  }
  $$('[data-vg]').forEach(button => button.addEventListener('click', () => openService(button.dataset.vg)));

  // The demo data is deliberately separated from any live Virtuagym schedule.
  // It never contains availability, member identities or instructor names.
  const activities = {
    reformer: { name: 'Reformer Flow', detail: 'Reformer-studio \u00b7 Focus & controle', duration: '50 min' },
    hyrox: { name: 'HYROX Training', detail: 'Trainingsvloer \u00b7 Kracht & conditie', duration: '55 min' },
    strength: { name: 'Strength & Balance', detail: 'Trainingsvloer \u00b7 Sterker op jouw tempo', duration: '45 min' }
  };
  const exampleWeek = [
    [['07:30', 'reformer'], ['09:30', 'strength'], ['18:00', 'hyrox']],
    [['08:00', 'hyrox'], ['10:00', 'reformer'], ['19:00', 'strength']],
    [['07:30', 'strength'], ['09:00', 'reformer'], ['18:30', 'hyrox']],
    [['08:00', 'reformer'], ['12:00', 'strength'], ['19:00', 'hyrox']],
    [['07:30', 'hyrox'], ['10:00', 'reformer'], ['17:30', 'strength']],
    [['09:00', 'hyrox'], ['10:00', 'strength'], ['11:00', 'reformer']],
    [['09:30', 'reformer'], ['11:00', 'strength']]
  ];
  const dayNames = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
  let selectedDay = 0;
  let selectedFilter = 'all';
  function renderDemo() {
    const list = $('#class-list');
    list.replaceChildren();
    const classes = exampleWeek[selectedDay].filter(([, type]) => selectedFilter === 'all' || type === selectedFilter);
    if (!classes.length) {
      list.append(make('p', 'schedule-empty', 'Voor dit filter staan op deze voorbeelddag geen lessen. Kies een andere dag of toon alles.'));
      return;
    }
    for (const [time, type] of classes) {
      const activity = activities[type];
      const row = make('article', 'class-row');
      const timeElement = make('time', 'class-time', time);
      timeElement.dateTime = time;
      const info = make('div', 'class-info');
      info.append(make('h3', 'class-name', activity.name), make('p', 'class-detail', activity.detail));
      const book = make('button', 'class-book', 'Bekijk voorbeeld');
      book.type = 'button';
      book.setAttribute('aria-label', `Bekijk voorbeeld van ${activity.name} op ${dayNames[selectedDay]} om ${time}; geen echte boeking`);
      const arrow = make('span', '', '\u2197');
      arrow.setAttribute('aria-hidden', 'true');
      book.append(arrow);
      book.addEventListener('click', () => {
        openDialog(activity.name, 'Demonstratie \u00b7 geen echte reservering');
        paragraph(`${dayNames[selectedDay][0].toUpperCase() + dayNames[selectedDay].slice(1)} om ${time} \u00b7 ${activity.duration}`);
        paragraph('Deze les laat zien hoe het rooster eruit kan zien. Tijd, activiteit en locatie zijn voorbeeldgegevens. Je hebt geen les gereserveerd.', 'dialog-note');
        paragraph('Na het aansluiten van de club toont deze pagina het echte Virtuagym-rooster. De boekingsregels en beschikbaarheid komen dan uit jullie eigen omgeving.');
        closeAction('Terug naar het rooster');
      });
      row.append(timeElement, info, make('span', 'class-duration', activity.duration), book);
      list.append(row);
    }
  }
  $$('[data-day]').forEach(button => button.addEventListener('click', () => {
    selectedDay = Number(button.dataset.day);
    $$('[data-day]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    renderDemo();
  }));
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    selectedFilter = button.dataset.filter;
    $$('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    renderDemo();
  }));
  [$('.schedule-days'), $('.schedule-filters')].forEach(group => {
    group.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const buttons = $$('button', group);
      const current = buttons.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      let index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[index].focus();
      buttons[index].click();
    });
  });

  const schedule = serviceSettings('schedule');
  const hasSchedule = Boolean(schedule.url || schedule.embedUrl);
  if (hasSchedule) {
    $('#schedule-demo').hidden = true;
    $('#schedule-live').hidden = false;
    $('#load-schedule').textContent = schedule.embedUrl ? 'Laad het live lesrooster \u2193' : 'Open het live lesrooster \u2197';
    const fallback = $('#schedule-fallback-link');
    fallback.href = schedule.url || schedule.embedUrl;
    $('#load-schedule').addEventListener('click', () => {
      if (!schedule.embedUrl) { window.location.assign(schedule.url); return; }
      const holder = $('#schedule-frame-wrap');
      if (!holder.querySelector('iframe')) holder.prepend(iframeElement(schedule.embedUrl, 'Actueel PALME-lesrooster via Virtuagym'));
      holder.hidden = false;
      $('.live-placeholder').hidden = true;
    });
  } else if (preview) renderDemo();
  else {
    $('#schedule-demo').hidden = true;
    $('#schedule-live').hidden = false;
    $('.live-placeholder h3').textContent = 'Het lesrooster volgt binnenkort.';
    $('.live-placeholder > p:not(.eyebrow):not(.subtle-note)').textContent = 'Neem contact op met de club voor informatie over de lessen.';
    $('#load-schedule').hidden = true;
    $('.live-placeholder .subtle-note').hidden = true;
  }
  // Remove concept-specific FAQ wording when the corresponding real integration exists.
  const faqAnswers = $$('.faq-list details > p');
  if (hasSchedule) faqAnswers[1].textContent = 'Open het actuele lesrooster. Je bekijkt de lessen en boekt via onze Virtuagym-omgeving. Voor het reserveren kan een ledenlogin nodig zijn.';
  if (serviceSettings('signup').url || serviceSettings('signup').embedUrl) faqAnswers[2].textContent = 'De actuele lidmaatschappen, tarieven en voorwaarden vind je in onze Virtuagym-webshop. Kies \u2018Ontdek lidmaatschappen\u2019 om de mogelijkheden te bekijken.';
  if (serviceSettings('trial').url || serviceSettings('trial').embedUrl) faqAnswers[3].textContent = 'Kies \u2018Kom kennismaken\u2019 om de mogelijkheden te bekijken en via onze boekingsomgeving een kennismaking te plannen. De beschikbare momenten en eventuele voorwaarden vind je daar.';
  if (!preview) {
    if (!hasSchedule) faqAnswers[1].textContent = 'Het actuele rooster en online reserveren worden binnenkort beschikbaar. Neem tot die tijd contact op met de club.';
    if (!(serviceSettings('signup').url || serviceSettings('signup').embedUrl)) faqAnswers[2].textContent = 'Neem contact op met de club voor de actuele lidmaatschappen, tarieven en voorwaarden.';
    if (!(serviceSettings('trial').url || serviceSettings('trial').embedUrl)) faqAnswers[3].textContent = 'Neem contact op met de club om een kennismaking te bespreken.';
  }
  // The Reformer card opens the corresponding description on arrival.
  $$('a[href="#reformer"]').forEach(link => link.addEventListener('click', () => { $('#reformer').open = true; }));

  function credit(label, person, url) {
    const item = make('div', 'dialog-credit');
    const link = make('a', '', person);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    item.append(make('strong', '', label), link);
    dialogBody.append(item);
  }
  $$('[data-info]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.info === 'privacy') {
      const policy = publicUrl(config.legal?.privacyUrl);
      if (policy) { window.location.assign(policy); return; }
      openDialog('Over deze preview.', 'Privacy \u00b7 conceptinformatie');
      paragraph('Deze conceptwebsite slaat zelf geen contactaanvragen, boekingen of betalingen op. Er zijn geen analysetools of advertentiepixels ingebouwd.');
      paragraph('De sfeerfoto\u2019s worden via externe fotodiensten geladen. Bij het laden krijgt die externe dienst onder meer je IP-adres. Het logo en de websitecode staan lokaal; er worden geen externe lettertypen ingeladen.');
      paragraph('Een gekoppeld Virtuagym-venster wordt pas na jouw klik geladen. Voor gegevens die je daar invult gelden de privacy-informatie en voorwaarden van de betreffende club en dienst.');
      paragraph('Dit is geen definitieve privacyverklaring voor PALM\u00c9. Voeg v\u00f3\u00f3r publicatie de juiste contactgegevens en goedgekeurde privacy-informatie toe.', 'dialog-note');
      closeAction();
    } else {
      openDialog('Een sfeerimpressie.', 'Beeldverantwoording');
      paragraph('Het logo, de kleuren en de merkuitgangspunten zijn gebaseerd op de aangeleverde PALM\u00c9-voorbeelden. De extra fotografie is stockbeeld, geen weergave van de definitieve PALM\u00c9-club.');
      credit('Fitness', 'Unsplash \u00b7 foto 1534438327276-14e5300c3a48', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48');
      credit('Krachttraining', 'Unsplash \u00b7 foto 1517836357463-d25dfeac3438', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438');
      credit('Reformer Pilates', 'Paulina Vargas / Pexels', 'https://www.pexels.com/photo/modern-pilates-studio-with-reformers-36833354/');
      credit('Wellness', 'HUUM / Unsplash', 'https://unsplash.com/photos/a-wooden-room-with-benches-and-a-round-table-Cu0CbpD87-s');
      credit('Lounge', 'Dick Hoogerdijk / Unsplash', 'https://unsplash.com/photos/cozy-cafe-interior-with-lush-hanging-plants-and-seating-dytlQR4hi4g');
      paragraph('Gebruik voor de uiteindelijke publicatie bij voorkeur eigen clubfotografie. Controleer de rechten en eventuele aanvullende toestemmingen voor het gekozen gebruik.', 'dialog-note');
    }
  }));

  const motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px 35px 0px' });
    $$('.reveal').forEach(element => observer.observe(element));
    window.addEventListener('beforeprint', () => $$('.reveal').forEach(element => element.classList.add('in-view')));
  }
})();
