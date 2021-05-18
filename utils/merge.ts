const isObject = (value: any) =>
	typeof value === "object" && value !== null && !Array.isArray(value)

export const merge = (target: any, source: any): any => ({
	...target,
	...Object.fromEntries(
		Object.entries(source).map(([key, value]) =>
			isObject(value) ? [key, merge(target[key], value)] : [key, value]
		)
	),
})
