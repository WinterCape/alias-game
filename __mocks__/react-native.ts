export const Share = { share: jest.fn().mockResolvedValue({ action: 'sharedAction' }) };
export const Platform = { OS: 'ios' };
export const Alert = { alert: jest.fn() };
export const Vibration = { vibrate: jest.fn() };
export const Dimensions = { get: () => ({ width: 375, height: 812 }) };
export const Animated = {
  Value: jest.fn(() => ({ interpolate: jest.fn(), setValue: jest.fn() })),
  timing: jest.fn(() => ({ start: jest.fn() })),
  spring: jest.fn(() => ({ start: jest.fn() })),
  sequence: jest.fn(() => ({ start: jest.fn() })),
  parallel: jest.fn(() => ({ start: jest.fn() })),
};
export const StyleSheet = { create: (s: any) => s, absoluteFillObject: {} };
export const PanResponder = { create: jest.fn(() => ({ panHandlers: {} })) };
