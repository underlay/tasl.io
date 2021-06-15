import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from "next/document"
import { extractStyles } from "evergreen-ui"

type DocumentProps = {
	css: string
	hydrationScript: JSX.Element
}

export default class extends Document<DocumentProps> {
	static async getInitialProps({ renderPage }: DocumentContext) {
		const page = renderPage()
		const { css, hydrationScript } = extractStyles()
		return { ...page, css, hydrationScript }
	}

	render() {
		const { css, hydrationScript } = this.props

		return (
			<Html>
				<Head>
					<style dangerouslySetInnerHTML={{ __html: css }} />
					<link rel="icon" href="/favicon.png" />
					<link
						rel="preload"
						href="/Fonts/Athelas/904523/9d98c43c-eb88-46b7-ab0b-143e29ce5828.woff2"
						as="font"
						type="font/woff2"
						crossOrigin="anonymous"
					/>
					<link
						rel="preload"
						href="/Fonts/Athelas/904526/079434e7-2c5f-49b2-b9c3-108e30c54b35.woff2"
						as="font"
						type="font/woff2"
						crossOrigin="anonymous"
					/>
					<link
						rel="preload"
						href="/Fonts/Athelas/904532/dff56a2b-9f6c-41c3-9b8d-49415b53abd8.woff2"
						as="font"
						type="font/woff2"
						crossOrigin="anonymous"
					/>
					{/* <link
						rel="preload"
						href="/Fonts/FiraCode/FiraCode-Regular.woff2"
						as="font"
						type="font/woff2"
						crossOrigin="anonymous"
					/> */}
					<link
						rel="preload"
						href="/Fonts/GoMono/GoMonoRegular.ttf"
						as="font"
						type="font/ttf"
						crossOrigin="anonymous"
					/>
				</Head>
				<body>
					<Main />
					{hydrationScript}
					<NextScript />
				</body>
			</Html>
		)
	}
}
