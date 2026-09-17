(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const original = JSON.parse(JSON.stringify(window.PALME_CONFIG || {}));
  const status = $('#settings-status');
  const fields = ['login', 'signup', 'schedule', 'trial'];
  function fill() {
    fields.forEach(key => {
      $(`#vg-${key}`).value = original.virtuagym?.[key]?.url || '';
      const embed = $(`#vg-${key}-embed`);
      if (embed) embed.value = original.virtuagym?.[key]?.embedUrl || '';
    });
    $('#contact-location').value = original.contact?.location || 'IJsselstein';
    $('#contact-email').value = original.contact?.email || '';
    $('#contact-phone').value = original.contact?.phone || '';
    $('#privacy-url').value = original.legal?.privacyUrl || '';
    $('#preview-mode').checked = original.preview !== false;
    status.hidden = true;
  }
  function https(value, label) {
    if (!value.trim()) return '';
    let url;
    try { url = new URL(value.trim()); } catch (_) { throw new Error(`${label}: vul een volledige https://-URL in.`); }
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`${label}: gebruik HTTPS zonder gebruikersnaam of wachtwoord in de URL.`);
    return url.href;
  }
  function embedUrl(value, label) {
    if (!value.trim()) return '';
    if (value.trim().startsWith('<')) {
      // DOMParser creates an inert document. No supplied code is inserted or executed.
      const doc = new DOMParser().parseFromString(value, 'text/html');
      if (doc.querySelector('script')) throw new Error(`${label}: deze code bevat een script. Laat de offici\u00eble widget door een ontwikkelaar aansluiten; deze pagina verwerkt alleen iframes.`);
      const frames = doc.querySelectorAll('iframe');
      if (frames.length !== 1) throw new Error(`${label}: plak precies \u00e9\u00e9n iframe of alleen de iframe-URL.`);
      return https(frames[0].getAttribute('src') || '', label);
    }
    return https(value, label);
  }
  $('#restore-settings').addEventListener('click', fill);
  $('#settings-form').addEventListener('submit', event => {
    event.preventDefault();
    status.hidden = false;
    try {
      const next = JSON.parse(JSON.stringify(original));
      next.virtuagym = {};
      fields.forEach(key => {
        next.virtuagym[key] = { url: https($(`#vg-${key}`).value, key) };
        const embed = $(`#vg-${key}-embed`);
        if (embed) next.virtuagym[key].embedUrl = embedUrl(embed.value, `${key} iframe`);
      });
      next.contact = {
        location: $('#contact-location').value.trim(),
        email: $('#contact-email').value.trim(),
        phone: $('#contact-phone').value.trim()
      };
      next.legal = { ...(original.legal || {}), privacyUrl: https($('#privacy-url').value, 'Privacyverklaring') };
      next.preview = $('#preview-mode').checked;
      const code = '/* Public PALME settings. Never put secrets in this file. */\nwindow.PALME_CONFIG = ' + JSON.stringify(next, null, 2) + ';\n';
      const blob = new Blob([code], { type: 'text/javascript;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'config.js';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      status.classList.remove('error');
      status.textContent = 'Het instellingenbestand is gemaakt. Vervang config.js in je websitepakket en heropen index.html. Deze download wijzigt de website niet automatisch.';
    } catch (error) {
      status.classList.add('error');
      status.textContent = error instanceof Error ? error.message : 'De instellingen konden niet worden gemaakt.';
    }
  });
  fill();
})();
