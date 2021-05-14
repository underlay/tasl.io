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
	Pre,
	Strong,
	Text,
	UnorderedList,
} from "evergreen-ui"

import Markdown from "react-markdown"
import type {
	Components,
	HeadingComponent,
} from "react-markdown/src/ast-to-react"

import { readFileSync, readdirSync, statSync } from "fs"
import { resolve } from "path"
import { theme } from "utils/theme"

type DocsParams = { path: string[] }

type DocsProps = { content: string }

function* traverse(
	root: string,
	path: string[]
): Generator<{ params: DocsParams }> {
	for (const name of readdirSync(resolve(root, ...path))) {
		const file = resolve(root, ...path, name)
		const stat = statSync(file)
		if (stat.isDirectory()) {
			yield* traverse(root, [...path, name])
		} else if (name.endsWith(".md")) {
			yield {
				params: { path: [...path, name.slice(0, name.lastIndexOf(".md"))] },
			}
		}
	}
}

export const getStaticPaths: GetStaticPaths<DocsParams> = async () => {
	return {
		paths: Array.from(traverse(resolve("docs"), [])),
		fallback: false,
	}
}

export const getStaticProps: GetStaticProps<DocsProps, DocsParams> = async (
	context
) => {
	const path = [...context.params!.path]
	const name = path.pop()
	const file = resolve("docs", ...path, `${name}.md`)
	const content = readFileSync(file, "utf-8")
	return { props: { content } }
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
	p: ({ children }) => <Paragraph>{children}</Paragraph>,
	code: ({ inline, children }) =>
		inline ? <Code>{children}</Code> : <Pre fontFamily="mono">{children}</Pre>,
	em: ({ children }) => <Text is="em">{children}</Text>,
	strong: ({ children }) => <Strong>{children}</Strong>,
	ul: ({ children }) => <UnorderedList>{children}</UnorderedList>,
	ol: ({ children }) => <OrderedList>{children}</OrderedList>,
	li: ({ children }) => <ListItem>{children}</ListItem>,
	h1: h1,
	h2: h2,
	h3: h3,
	h4: h3,
	h5: h3,
	h6: h3,
}

const Docs: React.FC<DocsProps> = ({ content }) => {
	return <Markdown components={components}>{content}</Markdown>
}

export default Docs
