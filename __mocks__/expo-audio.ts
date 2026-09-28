export const setAudioModeAsync = jest.fn();
export const createAudioPlayer = jest.fn(() => ({
  play: jest.fn(),
  seekTo: jest.fn(),
  remove: jest.fn(),
}));
