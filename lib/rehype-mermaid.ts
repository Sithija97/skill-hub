import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import type { Root, Element } from 'hast'
import type { Plugin } from 'unified'

/**
 * Replaces ```mermaid fenced code blocks with a `<div data-mermaid-source>`
 * placeholder, extracting the raw diagram source before any syntax
 * highlighter gets a chance to tokenize it into non-text nodes.
 *
 * Runs once in the rehype pipeline so every markdown renderer (published
 * skill view, editor live preview) gets identical mermaid handling — the
 * `components` map only has to recognize one element shape, instead of each
 * renderer needing its own DOM-shape-sniffing logic.
 */
export const rehypeMermaid: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node, index, parent) => {
    if (node.tagName !== 'pre' || !parent || index === undefined) return

    const codeChild = node.children.find(
      (child): child is Element => child.type === 'element' && child.tagName === 'code'
    )
    if (!codeChild) return

    const className = codeChild.properties?.className
    const classes = Array.isArray(className) ? className.map(String) : []
    if (!classes.includes('language-mermaid')) return

    const replacement: Element = {
      type: 'element',
      tagName: 'div',
      properties: { 'data-mermaid-source': toString(codeChild) },
      children: [],
    }
    parent.children[index] = replacement
  })
}
