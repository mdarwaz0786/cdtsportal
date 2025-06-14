module.exports = {
  root: true,
  extends: ["@react-native", "plugin:prettier/recommended"],
  rules: {
    quotes: ["error", "double"],
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        endOfLine: "auto",
      },
    ],
  },
};
