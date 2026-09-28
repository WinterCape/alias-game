import { useCallback, useEffect, useRef } from 'react';
import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { File, Paths } from 'expo-file-system';

// Generate WAV buffer for a simple tone
function generateToneWav(
  frequency: number,
  durationMs: number,
  volume: number = 0.5,
  type: 'sine' | 'square' = 'sine'
): ArrayBuffer {
  const sampleRate = 44100;
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Generate samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample: number;
    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * frequency * t);
    } else {
      sample = Math.sin(2 * Math.PI * frequency * t) >= 0 ? 1 : -1;
    }

    // Apply envelope (fade in/out to avoid clicks)
    const fadeLength = Math.min(numSamples * 0.1, 500);
    let envelope = 1;
    if (i < fadeLength) {
      envelope = i / fadeLength;
    } else if (i > numSamples - fadeLength) {
      envelope = (numSamples - i) / fadeLength;
    }

    const value = Math.floor(sample * volume * envelope * 32767);
    view.setInt16(headerSize + i * 2, value, true);
  }

  return buffer;
}

type SoundType = 'correct' | 'skip' | 'tick' | 'timeUp' | 'gameOver' | 'start';

const SOUND_CONFIGS: Record<SoundType, { freq: number; duration: number; volume: number; type: 'sine' | 'square' }> = {
  correct: { freq: 880, duration: 150, volume: 0.4, type: 'sine' },
  skip: { freq: 280, duration: 200, volume: 0.3, type: 'square' },
  tick: { freq: 1000, duration: 50, volume: 0.15, type: 'sine' },
  timeUp: { freq: 440, duration: 600, volume: 0.5, type: 'square' },
  gameOver: { freq: 660, duration: 400, volume: 0.4, type: 'sine' },
  start: { freq: 520, duration: 200, volume: 0.35, type: 'sine' },
};

export const useSounds = () => {
  const playersRef = useRef<Partial<Record<SoundType, AudioPlayer>>>({});
  const audioReady = useRef(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: 'duckOthers',
        });
        audioReady.current = true;
      } catch {
        // Audio not available
      }
    };
    setup();

    return () => {
      Object.values(playersRef.current).forEach((player) => {
        try {
          player?.remove();
        } catch {}
      });
      playersRef.current = {};
    };
  }, []);

  const playSound = useCallback(async (type: SoundType) => {
    if (!audioReady.current) return;

    try {
      let player = playersRef.current[type];
      if (!player) {
        // Write the generated tone to a cache file once, then reuse the player
        const config = SOUND_CONFIGS[type];
        const wavBuffer = generateToneWav(config.freq, config.duration, config.volume, config.type);
        const file = new File(Paths.cache, `sound-${type}.wav`);
        if (!file.exists) {
          file.create();
          file.write(new Uint8Array(wavBuffer));
        }
        player = createAudioPlayer({ uri: file.uri });
        playersRef.current[type] = player;
      }
      await player.seekTo(0);
      player.play();
    } catch {
      // Silently fail - sounds are nice-to-have
    }
  }, []);

  return {
    playCorrect: useCallback(() => playSound('correct'), [playSound]),
    playSkip: useCallback(() => playSound('skip'), [playSound]),
    playTick: useCallback(() => playSound('tick'), [playSound]),
    playTimeUp: useCallback(() => playSound('timeUp'), [playSound]),
    playGameOver: useCallback(() => playSound('gameOver'), [playSound]),
    playStart: useCallback(() => playSound('start'), [playSound]),
  };
};
