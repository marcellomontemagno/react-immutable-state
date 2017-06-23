const path = require('path');
const CWD = process.cwd();
const ROOT = path.join(CWD, 'tests');
const JEST_BABEL_TRANSFORMER = path.join(__dirname, 'jestBabelTransformer.js');

module.exports = {
    verbose: true,
    rootDir: ROOT,
    transform: {".*": JEST_BABEL_TRANSFORMER},
    collectCoverageFrom: ["src/**/*.js", "!**/node_modules/**", "!**/vendor/**"],
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)(spec|test).js?(x)', '**/*+(_spec|_test).js?(x)']
}
