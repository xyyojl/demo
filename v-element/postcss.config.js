import postcssEach from 'postcss-each';
import postcssEachVariables from 'postcss-each-variables';
import postcssNested from 'postcss-nested';
import postcssFor from 'postcss-for';
import postcssColorMix from 'postcss-color-mix';

export default {
  plugins: [
    postcssEachVariables(),
    postcssNested(),
    postcssEach({
      plugins: {
        beforeEach: [
          postcssFor(),
          postcssColorMix(),
        ],
      },
    }),
  ],
};
