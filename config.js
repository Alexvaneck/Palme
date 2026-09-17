/* PALME public site settings.
 * Never put API keys, client secrets, passwords or member data in this file.
 * Use ONLY public URLs copied from your own Virtuagym account.
 * Missing values intentionally keep the corresponding action in preview mode.
 */
window.PALME_CONFIG = {
  preview: true,
  contact: { location: "IJsselstein", email: "", phone: "" },
  virtuagym: {
    // The public address of your club's member login.
    login: { url: "" },
    // System settings > Webshop settings > Shop main link / Embed code.
    signup: { url: "", embedUrl: "" },
    // System settings > Schedule settings > selected schedule > Advanced.
    schedule: { url: "", embedUrl: "" },
    // Use a public booking URL or the iframe src from your official trial widget.
    // Requires the appropriate Virtuagym modules and configuration.
    trial: { url: "", embedUrl: "" }
  },
  // Public legal pages, once approved. Empty values show an honest concept notice.
  legal: { privacyUrl: "", termsUrl: "" },
  // Remote stock photography needs internet. Replace with your own local photos.
  // No images or code have been copied from Clubsportive.
  images: {
    fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2200&q=85",
    training: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=85",
    pilates: "https://images.pexels.com/photos/36833354/pexels-photo-36833354.jpeg?auto=compress&cs=tinysrgb&w=1600",
    wellness: "https://images.unsplash.com/photo-1712659604528-b179a3634560?auto=format&fit=crop&w=2200&q=85",
    lounge: "https://images.unsplash.com/photo-1756156250833-b625fffd724c?auto=format&fit=crop&w=1600&q=85"
  }
};
