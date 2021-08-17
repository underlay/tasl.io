// import React, { useEffect, useRef } from "react"

// import dynamic from "next/dynamic"
// import { Pane } from "evergreen-ui"

// import { Schema } from "@underlay/apg"

// import styles from "./Editor.module.scss"

// export interface EditorProps {
// 	initialValue: string
// 	onChange?: (value: string, schema: Schema.Schema, errorCount: number) => void
// }

// export default dynamic(
// 	async () => {
// 		const [
// 			{ editableConfig, SchemaState },
// 			{ useCodeMirror },
// 			{ openLintPanel },
// 		] = await Promise.all([
// 			import("@underlay/tasl-codemirror"),
// 			import("utils/codemirror"),
// 			import("@codemirror/next/lint"),
// 		])

// 		return function Editor(props: EditorProps) {
// 			const [state, view, div] = useCodeMirror<HTMLDivElement>({
// 				doc: props.initialValue,
// 				extensions: editableConfig,
// 			})

// 			const valueRef = useRef<string>(props.initialValue)
// 			const schemaRef = useRef<Schema.Schema>({})

// 			useEffect(() => {
// 				if (view.current !== null) {
// 					openLintPanel(view.current)
// 					view.current.focus()
// 				}
// 			}, [])

// 			useEffect(() => {
// 				if (props.onChange !== undefined && state !== null) {
// 					const value = state.doc.toString()
// 					const { schema, errorCount } = state.field(SchemaState)
// 					if (value !== valueRef.current || schema !== schemaRef.current) {
// 						valueRef.current = value
// 						schemaRef.current = schema
// 						props.onChange(value, schema, errorCount)
// 					}
// 				}
// 			}, [state])

// 			return (
// 				<Pane border background="white" ref={div} className={styles.editor} />
// 			)
// 		}
// 	},
// 	{ ssr: false }
// )

export {}