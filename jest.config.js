module.exports = {
    preset: "ts-jest",
    rootDir: __dirname,
    moduleFileExtensions: ["js", "jsx", "json", "vue", "tsx", "ts"],
    transformIgnorePatterns: ["<rootDir>/node_modules/(?!@tarojs)"],
    setupFiles: ["<rootDir>/tests/setup.ts"],
    transform: {
        ".+\\.(css|styl|less|sass|scss|png|svg|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
        ".+\\.jsx?$": "babel-jest",
        ".+\\.ts?$": "ts-jest",
        ".+\\.vue$": "vue-jest"
    },
    moduleNameMapper: {
        "^@tarojs/components$":
      "<rootDir>/node_modules/@tarojs/components/dist-h5/vue3/index.js",
        "^@tarojs/taro$": "<rootDir>/node_modules/@tarojs/taro/h5.js",
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    snapshotSerializers: ["jest-serializer-vue"],
    testMatch: [
        "<rootDir>/src/components/**/__tests__/*.spec.ts",
        "<rootDir>/src/__tests__/*.spec.ts"
    ],
    coverageDirectory: "<rootDir>/tests/coverage",
    collectCoverage: true,
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "<rootDir>/src/**/*.vue",
        "!**/node_modules/**",
        "!**/*.config.ts"
    ],
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.json",
            // work around: https://github.com/kulshekhar/ts-jest/issues/748#issuecomment-423528659
            diagnostics: {
                ignoreCodes: [151001]
            }
        }
    },
    maxConcurrency: 10,
    roots: ["<rootDir>/src"]
};
