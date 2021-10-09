import React from "react"
import type { GetStaticPaths, GetStaticProps } from "next"

import {
	Code,
	Link,
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
} from "react-markdown/lib/ast-to-react"

import type { LRLanguage } from "@codemirror/language"
import { fromCodeMirror } from "hast-util-from-codemirror"
import { taslLanguage } from "codemirror-lang-tasl"
import {
	javascriptLanguage,
	jsxLanguage,
	tsxLanguage,
	typescriptLanguage,
} from "@codemirror/lang-javascript"
import { toH } from "hast-to-hyperscript"

import { readFileSync } from "fs"
import { resolve } from "path"

import ContentFrame from "components/ContentFrame"
import { getPages, getPaths } from "utils/getPages"
import { PageProps } from "utils/page"
import { theme } from "utils/theme"

type ContentPageParams = { path?: string[] }

interface ContentPageProps extends PageProps {
	content: string
}

export const config = {
	unstable_runtimeJS: false,
}

const languages: Record<string, LRLanguage> = {
	"language-tasl": taslLanguage,
	"language-typescript": typescriptLanguage,
	"language-ts": typescriptLanguage,
	"language-tsx": tsxLanguage,
	"language-javascript": javascriptLanguage,
	"language-js": javascriptLanguage,
	"language-jsx": jsxLanguage,
}

export const getStaticPaths: GetStaticPaths<ContentPageParams> = async ({}) => {
	const pages = getPages()
	const paths: { params: ContentPageParams }[] = [
		{ params: { path: [] } },
		...getPaths([], pages),
	]

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
	const name = path ? `${path.join("/")}.md` : "index.md"
	const file = resolve("content", name)
	const content = readFileSync(file, "utf-8")

	return {
		props: { content, pages: getPages(), path: path || [] },
	}
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
	a: ({ children, href }) => (
		<Link size={500} href={href as string}>
			{children}
		</Link>
	),
	p: ({ children }) => <Paragraph size={500}>{children}</Paragraph>,
	code: ({ inline, className, ...props }) => {
		if (inline) {
			return <Code>{props.children}</Code>
		} else if (className !== undefined && className in languages) {
			const source = String(props.children).replace(/\n+$/, "")
			const { parser } = languages[className]
			const tree = parser.parse(source)
			const root = fromCodeMirror(source, tree)
			const content = toH(React.createElement, root)
			return (
				<Pane border background="tint2" overflowX="auto">
					<Pane width="max-content" padding={majorScale(1)}>
						{content}
					</Pane>
				</Pane>
			)
		} else {
			return (
				<Pane border background="tint2" overflowX="auto">
					<Pane width="max-content" padding={majorScale(1)}>
						<code className={className}>{props.children}</code>
					</Pane>
				</Pane>
			)
		}
	},
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
		<ContentFrame pages={props.pages} path={props.path}>
			<Markdown components={components}>{props.content}</Markdown>
		</ContentFrame>
	)
}

export default ContentPage
