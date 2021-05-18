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

import type { Page } from "utils/page"

import styles from "./PageNav.module.scss"

export interface PageNavProps {
	path: string
	pages: Page[]
}

const PageNav: React.FC<PageNavProps> = (props) => {
	const router = useRouter()
	return (
		<details>
			<summary>
				<Heading
					size={400}
					display="inline-block"
					cursor="pointer"
					userSelect="none"
				>
					Documentation
				</Heading>
			</summary>
			<TabNavigation className={styles.nav} marginY={majorScale(1)}>
				{props.pages.map((page) => {
					const path = page.slug ? `${props.path}/${page.slug}` : props.path
					return (
						<Tab
							key={path}
							is="a"
							href={path}
							className={styles.page}
							isSelected={router.asPath === path}
							direction="vertical"
						>
							{page.title}
						</Tab>
					)
				})}
			</TabNavigation>
		</details>
	)
}

export default PageNav
