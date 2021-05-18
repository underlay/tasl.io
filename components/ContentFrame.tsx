import {
	Heading,
	majorScale,
	minorScale,
	Pane,
	Tab,
	TabNavigation,
} from "evergreen-ui"
import { useRouter } from "next/router"
import React from "react"

import type { Page, PageProps } from "utils/page"
import { theme } from "utils/theme"

import styles from "./ContentFrame.module.scss"

export interface ContentFrameProps extends PageProps {}

const ContentFrame: React.FC<ContentFrameProps> = (props) => {
	const router = useRouter()
	const isRootSelected = router.asPath === "/"

	return (
		<Pane display="flex">
			<Pane margin={majorScale(1)}>
				<TabNavigation width={majorScale(18)}>
					<Tab is="a" href="/" direction="vertical" isSelected={isRootSelected}>
						<Heading size={400}>tasl</Heading>
					</Tab>
					{props.pages.map((page) => (
						<Section key={page.slug} path="" page={page} />
					))}
					<Section path="" page={{ title: "playground", slug: "playground" }} />
				</TabNavigation>
				{/* <nav role="navigation" className={styles.nav}>
				{props.pages.map((page) => (
					<Section key={page.slug} path="" page={page} />
				))}
			</nav> */}
			</Pane>
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
			marginY={minorScale(1)}
			paddingY={minorScale(1)}
			borderTopColor={theme.colors.muted}
			borderTopStyle="solid"
			borderTopWidth={1}
		>
			{/* <Heading is="a" href={url}>
				{props.page.title}
			</Heading> */}
			<Tab is="a" href={url} direction="vertical" isSelected={isSelected}>
				<Heading size={400}>{props.page.title}</Heading>
			</Tab>
			{children.map((page) => (
				<SubSection key={page.slug} path={url} page={page} />
			))}
		</Pane>
	)
}

const SubSection: React.FC<{ path: string; page: Page }> = (props) => {
	const children = props.page.children || []
	const url = `${props.path}/${props.page.slug}`
	const router = useRouter()
	const isSelected = router.asPath === url
	return (
		<>
			{/* <Heading is="a" href={url}>
				{props.page.title}
			</Heading> */}
			<Tab
				is="a"
				href={url}
				direction="vertical"
				isSelected={isSelected}
				size={400}
				fontWeight={400}
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
