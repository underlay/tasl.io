import React from "react"

import {
	Link,
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

import ReactMarkdown from "react-markdown"
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

import { theme } from "utils/theme"

const languages: Record<string, LRLanguage> = {
	"language-tasl": taslLanguage,
	"language-javascript": javascriptLanguage,
	"language-js": javascriptLanguage,
	"language-jsx": jsxLanguage,
	"language-typescript": typescriptLanguage,
	"language-ts": typescriptLanguage,
	"language-tsx": tsxLanguage,
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
						<code className={className}>{content}</code>
					</Pane>
				</Pane>
			)
		} else {
			return (
				<Pane border background="tint2" overflowX="auto">
					<Pane width="max-content" padding={majorScale(1)}>
						<code>{props.children}</code>
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

export interface MarkdownProps {
	source: string
}

const Markdown: React.FC<MarkdownProps> = (props) => (
	<ReactMarkdown components={components}>{props.source}</ReactMarkdown>
)

export default Markdown
