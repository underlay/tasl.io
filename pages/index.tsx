import React from "react"

import { Heading, Link, Pane, Paragraph, Text } from "evergreen-ui"
import { PageProps } from "utils/page"
import { GetStaticProps } from "next"
import { getPages } from "utils/getPages"
import ContentFrame from "components/ContentFrame"

export const getStaticProps: GetStaticProps<IndexProps, IndexParams> =
	async ({}) => ({ props: { pages: getPages() } })

type IndexParams = {}
interface IndexProps extends PageProps {}

const Index: React.FC<IndexProps> = (props) => {
	return (
		<ContentFrame pages={props.pages}>
			<Pane>
				<Heading is="h1" size={900}>
					tiny algebraic schema language
				</Heading>
				<Paragraph>
					tasl is a{" "}
					<Text fontStyle="italic">tiny algebraic schema language</Text>{" "}
					designed for structuring datasets.
				</Paragraph>
				<Paragraph>
					It's built on patterns from RDF, the semantic web,{" "}
					<Link href="https://en.wikipedia.org/wiki/Algebraic_data_type">
						algebraic data types
					</Link>
					, and <Link href="https://arxiv.org/abs/1909.04881">this paper</Link>{" "}
					on algebraic property graphs from Shinavier and Wisnesky.
				</Paragraph>
			</Pane>
		</ContentFrame>
	)
}

export default Index
