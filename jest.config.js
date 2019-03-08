module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/snippet'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.html$': 'jest-raw-loader',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./setupJest.ts'],
};
