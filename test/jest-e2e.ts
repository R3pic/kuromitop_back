import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from '../tsconfig.json';
import * as path from 'path';

const rootDir = path.resolve();

const config: JestConfigWithTsJest = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { 
    prefix: `${rootDir}/`, 
  }),
  testEnvironment: 'node',
};
  
export default config;