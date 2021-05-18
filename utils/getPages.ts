import { readFileSync } from "fs"
import { resolve } from "path"

import { Page } from "./page"

export function getPages(): Page[] {
	return JSON.parse(readFileSync(resolve("pages.json"), "utf-8"))
}

export function* getPaths(
	path: string[],
	pages: Page[]
): Generator<{ params: { path: string[] } }, void> {
	for (const { slug, children } of pages) {
		yield { params: { path: [...path, slug] } }
		if (children !== undefined) {
			yield* getPaths([...path, slug], children)
		}
	}
}
