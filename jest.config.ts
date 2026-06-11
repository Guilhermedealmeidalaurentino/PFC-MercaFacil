import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json'],

  projects: [
    // ─── Testes de serviços ────────────────────────────────────────────
    {
      displayName: 'services',
      testMatch: ['<rootDir>/tests/services/**/*.test.ts'],
      preset: 'ts-jest',
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
      },
      setupFiles: ['<rootDir>/tests/jest.setup.mock.ts'],
      moduleNameMapper: {
        '^knex$': '<rootDir>/tests/__mocks__/knex.ts',
        'resend': '<rootDir>/tests/__mocks__/resend.ts',
      },
    },

    // ─── Testes de usuarios ────────────────────────────────────────────
    {
      displayName: 'usuarios',
      testMatch: ['<rootDir>/tests/controller/usuarios/**/*.test.ts'],
      preset: 'ts-jest',
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
      },
      setupFiles: ['<rootDir>/tests/jest.env.ts'],
      moduleNameMapper: {
        '^knex$': '<rootDir>/tests/__mocks__/knex.ts',
        '^(.*)/database/knex$': '<rootDir>/tests/__mocks__/knex.ts',
        'resend': '<rootDir>/tests/__mocks__/resend.ts',
      },
    },

    // ─── Testes de produtos ────────────────────────────────────────────
    {
      displayName: 'produtos',
      testMatch: ['<rootDir>/tests/controller/produtos/**/*.test.ts'],
      preset: 'ts-jest',
      transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
      },
      setupFiles: ['<rootDir>/tests/jest.env.ts'],
      // jest.config.ts — projeto produtos
      moduleNameMapper: {
        '^knex$': '<rootDir>/tests/__mocks__/knexWithMercado.ts',
        '^(.*)/database/knex$': '<rootDir>/tests/__mocks__/knexWithMercado.ts',
        'resend': '<rootDir>/tests/__mocks__/resend.ts',
      },
    },
  ],
};

export default config;