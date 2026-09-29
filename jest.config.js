module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        resolveJsonModule: true,
        strict: true,
        moduleResolution: 'node',
        target: 'ES2020',
        module: 'commonjs',
        baseUrl: '.',
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__mocks__/react-native.ts',
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/async-storage.ts',
    '^expo-audio$': '<rootDir>/__mocks__/expo-audio.ts',
    '^expo-file-system$': '<rootDir>/__mocks__/expo-file-system.ts',
    '^expo-keep-awake$': '<rootDir>/__mocks__/expo-keep-awake.ts',
    '^expo-store-review$': '<rootDir>/__mocks__/expo-store-review.ts',
    '^expo-linear-gradient$': '<rootDir>/__mocks__/expo-linear-gradient.ts',
    '^@expo/vector-icons$': '<rootDir>/__mocks__/expo-vector-icons.ts',
    '^react-native-purchases$': '<rootDir>/__mocks__/react-native-purchases.ts',
  },
};
