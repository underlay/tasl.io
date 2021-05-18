export interface Page {
	title: string
	slug: string
	children?: Page[]
}

export interface PageProps {
	pages: Page[]
}
