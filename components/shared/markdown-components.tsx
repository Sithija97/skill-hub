import type { Components } from 'react-markdown'
import type { Element } from 'hast'
import { MermaidDiagram } from './mermaid-diagram'

/**
 * ReactMarkdown component overrides shared by the skill detail view and the
 * editor preview. Mermaid fences are already rewritten to a
 * `<div data-mermaid-source>` placeholder by lib/rehype-mermaid.ts before
 * this ever runs, so the only job here is recognizing that one element
 * shape — no DOM-structure guessing, no className sniffing per renderer.
 */
export const markdownComponents: Components = {
  div({ node, children, ...props }: { node?: Element } & React.ComponentProps<'div'>) {
    const source = node?.properties?.['data-mermaid-source']
    if (typeof source === 'string') {
      return <MermaidDiagram code={source} />
    }
    return (
      <div {...props}>{children}</div>
    )
  },
}
