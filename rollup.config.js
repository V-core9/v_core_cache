import path from 'path'
import fs from 'fs'

import terser from '@rollup/plugin-terser'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const isProd = process.env.NODE_ENV === 'production'

let pckg = {}
try {
  const packageJsonContent = fs.readFileSync('./package.json', 'utf8')
  pckg = JSON.parse(packageJsonContent)
} catch (error) {
  console.error(`Error reading or parsing './package.json' for Rollup bundle:`, error)
}

export default {
  input: path.resolve(__dirname, `./${pckg.srcDir}/${pckg.srcIndex}.js`),
  output: [
    ...pckg.formats.map((format) => ({
      file: `./${pckg.outDir}/${format}.js`,
      name: pckg.name.replace(/-/g, '_'),
      format,
      banner: pckg.banner.replace('{NAME}', pckg.name).replace('{AUTHOR}', pckg.author),
      footer: pckg.footer.replace('{VERSION}', pckg.version).replace('{TIME_OF_BUNDLE}', Date(Date.now()).toString()),
      sourcemap: isProd,
      minifyInternalExports: isProd,
      sanitizeFileName: isProd,
      noConflict: isProd,
      globals: {
        events: 'events'
      },
      generatedCode: {
        arrowFunctions: isProd,
        constBindings: isProd,
        conciseMethodProperty: isProd,
        objectShorthand: isProd,
        parameterDestructuring: isProd,
        reservedNamesAsProps: isProd,
        stickyRegExp: isProd,
        templateString: isProd
      }
    }))
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    nodePolyfills( /* options */ ),
    ...(isProd
      ? [
          terser({
            maxWorkers: 4,
            compress: {
              ecma: 2015
            }
          })
        ]
      : [])
  ]
}
