import React from "react"
import {
	Heading,
	majorScale,
	minorScale,
	Pane,
	Text,
	ThemeProvider,
} from "evergreen-ui"
import { AppProps } from "next/app"

import "../static/styles.css"

import { theme } from "../utils/theme"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<ThemeProvider value={theme}>
			<Pane padding={majorScale(2)}>
				<Pane
					display="flex"
					justifyContent="space-between"
					borderBottomWidth={1}
					borderBottomStyle="solid"
					borderBottomColor={theme.colors.muted}
					// backgroundColor={theme.colors.dark}
				>
					<Heading is="a" href="/" textDecoration="none">
						tasl
					</Heading>
					<Text fontStyle="italic">a tiny algebraic schema language</Text>
				</Pane>
				<Pane marginTop={majorScale(4)}>
					<Component {...pageProps} />
				</Pane>
			</Pane>
		</ThemeProvider>
	)
}

export default App
