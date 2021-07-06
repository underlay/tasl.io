import { readFileSync } from "fs"
import { resolve } from "path"

import { SectionPage } from "./page"

export function getPages(): SectionPage[] {
	return JSON.parse(readFileSync(resolve("pages.json"), "utf-8"))
}

export function* getPaths(
	path: string[],
	sections: SectionPage[]
): Generator<{ params: { path: string[] } }, void> {
	for (const { slug, children } of sections) {
		yield { params: { path: [...path, slug] } }
		if (children !== undefined) {
			yield* getPaths([...path, slug], children)
		}
	}
}
