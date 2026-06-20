import { common, createLowlight } from 'lowlight'
import rehypeHighlight from 'rehype-highlight'
import type { Pluggable } from 'unified'

const lowlight = createLowlight(common)

export const rehypeHighlightConfigured: Pluggable = [rehypeHighlight, { lowlight }]
