import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import sql from 'highlight.js/lib/languages/sql'
import markdown from 'highlight.js/lib/languages/markdown'
import rehypeHighlight from 'rehype-highlight'
import type { Pluggable } from 'unified'

const lowlight = createLowlight()
lowlight.register({ javascript, typescript, python, bash, json, yaml, css, xml, sql, markdown })

export const rehypeHighlightConfigured: Pluggable = [rehypeHighlight, { lowlight }]
