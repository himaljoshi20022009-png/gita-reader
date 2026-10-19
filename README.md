# Gita — one verse at a time

The reader starts where you last stopped, and moves through the verses in order with **Next verse** and **Previous** controls.

It is a Progressive Web App (PWA): when published at an HTTPS web address, it can be installed from a phone's browser and then works offline. The verse data is bundled in `gita-verses.js` and the English meaning data in `gita-meanings.js`.

## Put it on a phone

1. Upload all files in this folder to any HTTPS static host, such as GitHub Pages, Netlify, or Cloudflare Pages.
2. Open the published URL on the phone.
3. iPhone/iPad: tap **Share** → **Add to Home Screen**. Android: choose **Install app** or **Add to Home screen** in the browser menu.

After the first open, the full reader is available offline. A phone cannot install the local `index.html` file directly; it needs the HTTPS address in step 1.

## Sources and attribution

- Sanskrit, transliteration, and primary English rendition: [Gita Quotes](https://github.com/ChiragMirani/gita-quotes), which attributes the primary rendering to Shri Purohit Swami (1935, public domain), with Swami Sivananda as a fallback.
- English meaning and optional explanatory notes: [AdiyogiArts/gita-json](https://github.com/AdiyogiArts/gita-json).

The reader uses the source edition containing 701 entries; some editions number one portion of Chapter 13 differently, while the Gita is commonly described as having 700 verses.
