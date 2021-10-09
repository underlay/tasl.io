import React from "react"
import { ThemeProvider } from "evergreen-ui"
import { AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"

import { theme } from "utils/theme"

import "../styles.css"

import "hast-util-from-codemirror/styles/default.css"

const App: React.FC<AppProps> = (props) => {
	const { Component, pageProps } = props
	const { asPath } = useRouter()
	const title =
		asPath === "/"
			? "tiny algebraic schema language"
			: `tasl:${asPath.slice(1)}`
	return (
		<ThemeProvider value={theme}>
			<Head>
				<title>{title}</title>
			</Head>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default App
