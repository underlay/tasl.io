import React from "react"
import {
	Heading,
	majorScale,
	minorScale,
	Pane,
	Tab,
	TabNavigation,
	CodeIcon,
} from "evergreen-ui"
import { useRouter } from "next/router"

import type { PageProps } from "utils/page"
import { theme } from "utils/theme"

export interface ContentFrameProps extends PageProps {}

const ContentFrame: React.FC<ContentFrameProps> = (props) => {
	const { asPath } = useRouter()

	const path = asPath.slice(1).split("/")

	return (
		<Pane display="flex">
			<TabNavigation padding={minorScale(1)} width={majorScale(18)}>
				<Tab
					is="a"
					href="/"
					direction="vertical"
					isSelected={asPath === "/"}
					marginY={minorScale(1)}
				>
					<Heading size={500}>tasl</Heading>
				</Tab>
				{props.pages.map((section) => {
					const children =
						section.slug === path[0] && section.children !== undefined
							? section.children.map((content) => (
									<PageTab
										key={content.slug}
										href={`/${section.slug}/${content.slug}`}
										title={content.title}
									/>
							  ))
							: null
					return (
						<SectionTab
							key={section.slug}
							href={`/${section.slug}`}
							title={section.title}
						>
							{children}
						</SectionTab>
					)
				})}
				<SectionTab title="playground" href="/playground" />
				<SectionTab
					title="GitHub"
					href="https://github.com/underlay/tasl"
					icon={<CodeIcon />}
				/>
			</TabNavigation>
			<Pane paddingX={majorScale(4)} flex={1} overflow="auto">
				{props.children}
			</Pane>
		</Pane>
	)
}

const SectionTab: React.FC<{
	href: string
	title: string
	icon?: React.ReactNode
}> = (props) => {
	const { asPath } = useRouter()
	return (
		<Pane
			marginBottom={minorScale(1)}
			paddingTop={minorScale(1)}
			borderTopColor={theme.colors.muted}
			borderTopStyle="solid"
			borderTopWidth={1}
		>
			<Tab
				is="a"
				href={props.href}
				direction="vertical"
				isSelected={asPath === props.href}
				display="flex"
			>
				<Heading flex={1} size={500}>
					{props.title}
				</Heading>
				{props.icon}
			</Tab>
			{props.children}
		</Pane>
	)
}

const PageTab: React.FC<{ href: string; title: string }> = (props) => {
	const { asPath } = useRouter()
	return (
		<Tab
			is="a"
			href={props.href}
			direction="vertical"
			isSelected={asPath === props.href}
			size={500}
		>
			{props.title}
		</Tab>
	)
}

export default ContentFrame
