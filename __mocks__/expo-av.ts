export const Audio = {
  setAudioModeAsync: jest.fn(),
  Sound: { createAsync: jest.fn().mockResolvedValue({ sound: { unloadAsync: jest.fn() } }) },
};
