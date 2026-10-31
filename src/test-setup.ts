// Polyfills for Ionic unit tests running under jsdom.

// Support matchMedia.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// Give jsdom a valid base URL for loading Ionicons SVG files.
let baseElement = document.querySelector('base');

if (!baseElement) {
  baseElement = document.createElement('base');
  document.head.appendChild(baseElement);
}

baseElement.setAttribute('href', 'http://localhost/');

// Support scrollTo() used internally by Ionic components such as ion-segment.
if (!Element.prototype.scrollTo) {
  Object.defineProperty(Element.prototype, 'scrollTo', {
    configurable: true,
    writable: true,
    value: () => undefined,
  });
}