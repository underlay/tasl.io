import React, { useCallback } from "react"

import { GetStaticProps } from "next"
import { majorScale, Pane } from "evergreen-ui"

import Editor from "components/Editor"
import ContentFrame from "components/ContentFrame"

import { initialValue } from "utils/initialValue"
import { PageProps } from "utils/page"
import { getPages } from "utils/getPages"
// import Example from "components/Example"

export const getStaticProps: GetStaticProps<PlaygroundProps, PlaygroundParams> =
	async ({}) => ({ props: { pages: getPages() } })

type PlaygroundParams = {}
interface PlaygroundProps extends PageProps {}

const Playground: React.FC<PlaygroundProps> = (props) => {
	const handleChange = useCallback((value: string) => {}, [])
	return (
		<ContentFrame pages={props.pages}>
			<Pane marginY={majorScale(1)}>
				{/* <Example input={initialValue} /> */}
				<Editor initialValue={initialValue} onChange={handleChange} />
			</Pane>
		</ContentFrame>
	)
}

export default Playground
