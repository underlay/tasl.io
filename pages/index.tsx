import React from "react"
import { Link, ListItem, Pane, UnorderedList } from "evergreen-ui"

export default function Index({}) {
	return (
		<Pane>
			<UnorderedList>
				<ListItem>
					<Link href="docs/introduction">Introduction</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/namespaces">Namespaces</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/literals">Literals</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/uris">URIs</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/units">Units</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/products">Products</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/coproducts">Coproducts</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/references">References</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/style-guide">Style Guide</Link>
				</ListItem>
				<ListItem>
					<Link href="docs/examples">Examples</Link>
				</ListItem>
			</UnorderedList>
		</Pane>
	)
}
