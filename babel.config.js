const loose = true;

module.exports = api => {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          loose,
          ...(api.env("test") && { targets: { node: "current" } })
        }
      ],
      "@babel/react"
    ],
    plugins: [
      "dev-expression",
      ["@babel/plugin-proposal-class-properties", { loose }],
      "@babel/plugin-proposal-nullish-coalescing-operator",
      "@babel/plugin-proposal-optional-chaining"
    ],
    overrides: [
      {
        test: ["packages/react-router-native", "node_modules/react-native"],
        presets: ["module:metro-react-native-babel-preset"]
      }
    ]
  };
};
