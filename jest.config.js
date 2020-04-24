module.exports = {
  moduleFileExtensions: ["js"],
  testMatch: [
      "**/*.test.js"
    ],
  coveragePathIgnorePatterns: [
      "/node_modules/",
      "enzyme.js"
    ],
  setupFiles: [
     "./jest.setup.js"
   ],
  setupFilesAfterEnv: ["<rootDir>/enzyme.js"],
  coverageReporters: [
      "json",
      "lcov",
      "text",
      "text-summary"
    ],
    modulePaths: [
      "src"
    ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js",
    }
};
