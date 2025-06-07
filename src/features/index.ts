const context = require.context('.', true, /\.effect\.ts$/);

export const initialize = () => context.keys().map(context);
