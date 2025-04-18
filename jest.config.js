module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: 'src/.+(test|spec)\\.ts$',
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        isolatedModules: true
      }
    ]
  },
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [],
  coverageReporters: ['text-summary', 'text', 'html'],
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  },
  testEnvironment: 'node',
  testTimeout: 99999,
  setupFiles: ['<rootDir>/jestSetup.ts'],
  rootDir: '.',
  roots: ['./src'],
  moduleNameMapper: {
    '@utils': '<rootDir>/src/utils',
    '@modules': '<rootDir>/src/modules'
  }
};
