Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
Object.defineProperty(navigator, 'productSub', { get: () => '20030107' });
Object.defineProperty(navigator, 'product', { get: () => 'Gecko' });
Object.defineProperty(navigator, 'appCodeName', { get: () => 'Mozilla' });
Object.defineProperty(navigator, 'appName', { get: () => 'Netscape' });
Object.defineProperty(navigator, 'appVersion', {
  get: () =>
    '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
});
Object.defineProperty(navigator, 'cookieEnabled', { get: () => true });
Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.' });
Object.defineProperty(navigator, 'vendorSub', { get: () => '' });
// Object.defineProperty(navigator, "webdriver", { get: () => false });
Object.defineProperty(navigator, 'oscpu', {
  get: () => 'Windows NT 10.0; Win64; x64',
});
Object.defineProperty(navigator, 'language', {
  get: function () {
    return 'en-US';
  },
});
Object.defineProperty(navigator, 'languages', {
  get: function () {
    return ['en-US', 'en'];
  },
});
