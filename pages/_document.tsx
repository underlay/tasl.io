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
