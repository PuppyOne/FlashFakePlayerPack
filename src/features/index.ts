const context = require.context('.', true, /\.ts$/);

export const initialize = () => context
    .keys()
    .map((key) => context(key));
