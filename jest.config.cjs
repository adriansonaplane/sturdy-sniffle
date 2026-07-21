/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/test/dungeon/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/test/dungeon/performance/'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.json', diagnostics: true }]
  },
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  collectCoverageFrom: [
    'src/dungeon/**/*.ts',
    '!src/dungeon/**/*.d.ts',
    '!src/dungeon/**/types.ts',
    '!src/dungeon/workbench/browserCryptoShim.ts'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
    '/test/',
    '/playwright-report/',
    '/test-results/'
  ],
  coverageProvider: 'v8',
  coverageReporters: ['text', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: { lines: 85, functions: 85, branches: 80, statements: 85 },
    './src/dungeon/generation/': { lines: 95, functions: 95, branches: 90, statements: 95 },
    './src/dungeon/routing/': { lines: 95, functions: 95, branches: 90, statements: 95 },
    './src/dungeon/workbench/': { lines: 85, functions: 85, branches: 80, statements: 85 },
    './src/dungeon/rendering/': { lines: 85, functions: 85, branches: 80, statements: 85 }
  }
};
