import React from "react"
import { ThemeProvider } from "evergreen-ui"
import { AppProps } from "next/app"

import { theme } from "utils/theme"

import "../styles.css"

const App: React.FC<AppProps> = (props) => {
	const { Component, pageProps } = props

	return (
		<ThemeProvider value={theme}>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default App
