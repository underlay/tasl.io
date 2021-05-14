import React from "react"
import { Heading, majorScale, Pane, Text, ThemeProvider } from "evergreen-ui"
import { AppProps } from "next/app"

import "../styles.css"

import { theme } from "../utils/theme"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<ThemeProvider value={theme}>
			<Pane>
				<Pane display="flex" justifyContent="space-between">
					<Heading is="a" href="/">
						tasl
					</Heading>
					<Text fontStyle="italic">a tiny algebraic schema language</Text>
				</Pane>
				<hr />
				<Pane marginTop={majorScale(4)}>
					<Component {...pageProps} />
				</Pane>
			</Pane>
		</ThemeProvider>
	)
}

export default App
