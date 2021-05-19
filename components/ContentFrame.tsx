import React from "react"
import {
	Heading,
	majorScale,
	minorScale,
	Pane,
	Tab,
	TabNavigation,
} from "evergreen-ui"
import { useRouter } from "next/router"

import type { Page, PageProps } from "utils/page"
import { theme } from "utils/theme"

export interface ContentFrameProps extends PageProps {}

const ContentFrame: React.FC<ContentFrameProps> = (props) => {
	const router = useRouter()
	const isRootSelected = router.asPath === "/"

	return (
		<Pane display="flex">
			<TabNavigation padding={minorScale(1)} width={majorScale(18)}>
				<Tab
					is="a"
					href="/"
					direction="vertical"
					isSelected={isRootSelected}
					marginY={minorScale(1)}
				>
					<Heading size={500}>tasl</Heading>
				</Tab>
				{props.pages.map((page) => (
					<Section key={page.slug} path="" page={page} />
				))}
				<Section path="" page={{ title: "playground", slug: "playground" }} />
			</TabNavigation>
			<Pane marginX={majorScale(4)} flex={1}>
				{props.children}
			</Pane>
		</Pane>
	)
}

const Section: React.FC<{ path: string; page: Page }> = (props) => {
	const children = props.page.children || []
	const url = `${props.path}/${props.page.slug}`
	const router = useRouter()
	const isSelected = router.asPath === url
	return (
		<Pane
			marginBottom={minorScale(1)}
			paddingTop={minorScale(1)}
			borderTopColor={theme.colors.muted}
			borderTopStyle="solid"
			borderTopWidth={1}
		>
			<Tab is="a" href={url} direction="vertical" isSelected={isSelected}>
				<Heading size={500}>{props.page.title}</Heading>
			</Tab>
			{children.map((page) => (
				<SectionPage key={page.slug} path={url} page={page} />
			))}
		</Pane>
	)
}

const SectionPage: React.FC<{ path: string; page: Page }> = (props) => {
	const children = props.page.children || []
	const url = `${props.path}/${props.page.slug}`
	const router = useRouter()
	const isSelected = router.asPath === url
	return (
		<>
			<Tab
				is="a"
				href={url}
				direction="vertical"
				isSelected={isSelected}
				size={500}
			>
				{props.page.title}
			</Tab>
			{children.map((page) => (
				<Heading key={page.slug} is="a" href={`${url}/${page.slug}`}>
					{page.title}
				</Heading>
			))}
		</>
	)
}

export default ContentFrame
