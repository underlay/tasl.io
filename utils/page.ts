export interface ContentPage {
	title: string
	slug: string
}

export interface SectionPage extends ContentPage {
	children?: ContentPage[]
}

export interface PageProps {
	pages: SectionPage[]
}
