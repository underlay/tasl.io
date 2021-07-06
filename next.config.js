// next.config.js

// https://github.com/vercel/next.js/issues/706
const withTM = require("next-transpile-modules")([
	"hast-to-hyperscript",
	"web-namespaces",
	"lowlight",
	"fault",
])

module.exports = withTM({})
