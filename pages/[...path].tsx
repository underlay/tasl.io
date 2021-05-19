import React from "react"
import type { GetStaticPaths, GetStaticProps } from "next"
import {
	Code,
	Heading,
	ListItem,
	majorScale,
	minorScale,
	OrderedList,
	Pane,
	Paragraph,
	UnorderedList,
} from "evergreen-ui"

import Markdown from "react-markdown"
import type {
	Components,
	HeadingComponent,
} from "react-markdown/src/ast-to-react"

import { readFileSync } from "fs"
import { resolve } from "path"

import ContentFrame from "components/ContentFrame"
import { getPages, getPaths } from "utils/getPages"
import { PageProps } from "utils/page"
import { theme } from "utils/theme"

type ContentPageParams = { path: string[] }

interface ContentPageProps extends PageProps {
	content: string
}

export const getStaticPaths: GetStaticPaths<ContentPageParams> = async ({}) => {
	const pages = getPages()
	const paths = [...getPaths([], pages)]
	return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<
	ContentPageProps,
	ContentPageParams
> = async (context) => {
	if (context.params === undefined) {
		return { notFound: true }
	}

	const { path } = context.params
	const file = resolve("content", `${path.join("/")}.md`)
	const content = readFileSync(file, "utf-8")
	const pages = getPages()
	return { props: { content, pages } }
}

const h1: HeadingComponent = ({ children }) => (
	<Heading is="h1" size={900}>
		{children}
	</Heading>
)

const h2: HeadingComponent = ({ children }) => (
	<Heading is="h2" size={800}>
		{children}
	</Heading>
)

const h3: HeadingComponent = ({ children }) => (
	<Heading is="h3" size={600}>
		{children}
	</Heading>
)

const components: Components = {
	blockquote: ({ children }) => (
		<Pane
			background="tint1"
			borderLeftWidth={2}
			borderLeftColor={theme.colors.muted}
			borderLeftStyle="solid"
			padding={minorScale(1)}
			marginBottom={majorScale(1)}
		>
			<blockquote>{children}</blockquote>
		</Pane>
	),
	p: ({ children }) => <Paragraph size={500}>{children}</Paragraph>,
	code: ({ inline, children }) =>
		inline ? (
			<Code>{children}</Code>
		) : (
			<Pane background="tint2" border padding={majorScale(1)}>
				{children}
			</Pane>
		),
	em: ({ children }) => <em>{children}</em>,
	strong: ({ children }) => <strong>{children}</strong>,
	ul: ({ children }) => <UnorderedList>{children}</UnorderedList>,
	ol: ({ children }) => <OrderedList>{children}</OrderedList>,
	li: ({ children }) => <ListItem size={500}>{children}</ListItem>,
	h1: h1,
	h2: h2,
	h3: h3,
	h4: h3,
	h5: h3,
	h6: h3,
}

const ContentPage: React.FC<ContentPageProps> = (props) => {
	return (
		<ContentFrame pages={props.pages}>
			<Markdown components={components}>{props.content}</Markdown>
		</ContentFrame>
	)
}

export default ContentPage
