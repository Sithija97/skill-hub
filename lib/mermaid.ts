type MermaidTheme = 'dark' | 'default'

let initializedTheme: MermaidTheme | null = null
let mermaidModulePromise: Promise<typeof import('mermaid')> | null = null

// Bounded cache so toggling the theme back and forth, or re-rendering
// unchanged content, doesn't re-run mermaid's parse+layout pass.
const CACHE_LIMIT = 20
const renderCache = new Map<string, string>()

function cacheGet(key: string): string | undefined {
  const hit = renderCache.get(key)
  if (hit !== undefined) {
    // refresh recency
    renderCache.delete(key)
    renderCache.set(key, hit)
  }
  return hit
}

function cacheSet(key: string, value: string): void {
  if (renderCache.size >= CACHE_LIMIT) {
    const oldest = renderCache.keys().next().value
    if (oldest !== undefined) renderCache.delete(oldest)
  }
  renderCache.set(key, value)
}

let renderId = 0

/**
 * Renders mermaid source to an SVG string. Owns mermaid's global
 * initialize() as a true singleton (re-initializing only when the theme
 * actually changes, regardless of how many diagrams are on the page or how
 * many times a single diagram's source is edited) and caches identical
 * (theme, code) renders.
 */
export async function renderMermaid(code: string, theme: MermaidTheme): Promise<string> {
  const cacheKey = `${theme}:${code}`
  const cached = cacheGet(cacheKey)
  if (cached !== undefined) return cached

  if (!mermaidModulePromise) mermaidModulePromise = import('mermaid')
  const { default: mermaid } = await mermaidModulePromise

  if (initializedTheme !== theme) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme,
    })
    initializedTheme = theme
  }

  const { svg } = await mermaid.render(`mermaid-${++renderId}`, code)
  cacheSet(cacheKey, svg)
  return svg
}
