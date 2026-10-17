import '@testing-library/jest-dom';

// jsdom does not implement ResizeObserver (used by A4Scaler)
class ResizeObserverMock {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {
    // fire once asynchronously with a real-ish measurement
    Promise.resolve().then(() =>
      this.callback(
        [{ target: document.body } as unknown as ResizeObserverEntry],
        this as unknown as ResizeObserver,
      ),
    );
  }
  unobserve() {}
  disconnect() {}
}
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverMock;
}
if (typeof globalThis !== 'undefined' && !('ResizeObserver' in globalThis)) {
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverMock;
}
