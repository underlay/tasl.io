import { defaultTheme, majorScale, minorScale, Theme } from "evergreen-ui"

import { merge } from "./merge"

declare module "evergreen-ui" {
	type ComponentPropGetter = (theme: Theme, props: {}) => number | string
	type ComponentProp = number | string | ComponentPropGetter
	type ComponentProps = Record<
		string,
		ComponentProp | Record<string, ComponentProp>
	>

	interface Component {
		baseStyle: ComponentProps
		appearances: Record<string, ComponentProps>
		sizes: Record<string, ComponentProps>
	}

	interface Theme {
		components: Record<string, Component>
		colors: {
			muted: string
			default: string
			dark: string
			selected: string
			tint1: string
			tint2: string
			overlay: string
			yellowTint: string
			greenTint: string
			orangeTint: string
			redTint: string
			blueTint: string
			purpleTint: string
			tealTint: string
			border: {
				default: string
				muted: string
			}
			text: {
				success: string
				info: string
				danger: string
			}
			icon: {
				default: string
				muted: string
				disabled: string
				selected: string
			}
		}
		fontFamilies: {
			display: string
			mono: string
			ui: string
		}
		fontSizes: {
			body: string
			heading: string
			caption: string
		}
		fontWeights: {
			light: number
			normal: number
			semibold: number
			bold: number
		}
	}
}

export const theme: Theme = merge(defaultTheme, {
	components: {
		Tab: {
			appearances: {
				secondary: {
					borderRadius: 0,
					margin: 0,
					cursor: "pointer",
					size: 300,
					paddingX: majorScale(1),
				},
			},
		},
		Paragraph: {
			baseStyle: {
				marginBottom: majorScale(1),
			},
		},
		Heading: {
			sizes: {
				900: {
					marginBottom: majorScale(1),
				},
				800: {
					marginTop: majorScale(3),
					marginBottom: minorScale(1),
					borderBottomWidth: 1,
					borderBottomStyle: "solid",
					borderBottomColor: defaultTheme.colors.muted,
				},
				500: {
					marginTop: majorScale(2),
					// marginBottom: 0,
					// fontWeight: 500,
				},
			},
		},
	},
})

export const oldTheme: Theme = {
	...defaultTheme,
	components: {
		...defaultTheme.components,
		Heading: {
			...defaultTheme.components.Heading,
			sizes: {
				900: {
					...defaultTheme.components.Heading.sizes[900],
					marginTop: majorScale(4),
					marginBottom: majorScale(1),
				},
				800: {
					...defaultTheme.components.Heading.sizes[800],
					marginTop: majorScale(3),
					marginBottom: minorScale(1),
					borderBottomWidth: 1,
					borderBottomStyle: "solid",
					borderBottomColor: defaultTheme.colors.muted,
				},
				600: {
					...defaultTheme.components.Heading.sizes[600],
					marginTop: majorScale(2),
					marginBottom: 0,
				},
			},
		},
	},
}
