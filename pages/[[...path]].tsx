import React from "react"
import type { GetStaticPaths, GetStaticProps } from "next"

import { readFileSync } from "fs"
import { resolve } from "path"

import ContentFrame from "components/ContentFrame"
import { getPages, getPaths } from "utils/getPages"
import { PageProps } from "utils/page"
import Markdown from "components/Markdown"

type ContentPageParams = { path?: string[] }

interface ContentPageProps extends PageProps {
	content: string
}

export const config = {
	unstable_runtimeJS: false,
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

const ContentPage: React.FC<ContentPageProps> = (props) => {
	return (
		<ContentFrame pages={props.pages} path={props.path}>
			<Markdown source={props.content} />
		</ContentFrame>
	)
}

export default ContentPage
