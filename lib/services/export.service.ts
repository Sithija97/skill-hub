import type { Skill } from '@/types/skill'
import { TargetTool } from '@/types/skill'

interface ExportResult {
  content: string
  filename: string
  mimeType: string
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatSkillForExport(skill: Skill): ExportResult {
  const slug = slugify(skill.title)

  switch (skill.targetTool) {
    case TargetTool.CURSOR:
      return {
        content: `---\ndescription: ${skill.description}\nglobs: \n---\n\n${skill.content}`,
        filename: `${slug}.mdc`,
        mimeType: 'text/markdown',
      }

    case TargetTool.COPILOT:
      return {
        content: skill.content,
        filename: 'copilot-instructions.md',
        mimeType: 'text/markdown',
      }

    case TargetTool.WINDSURF:
      return {
        content: skill.content,
        filename: '.windsurfrules',
        mimeType: 'text/plain',
      }

    case TargetTool.CLAUDE:
      return {
        content: skill.content,
        filename: `${slug}.md`,
        mimeType: 'text/markdown',
      }

    case TargetTool.CONTINUE:
    case TargetTool.OTHER:
    default:
      return {
        content: skill.content,
        filename: `${slug}.md`,
        mimeType: 'text/markdown',
      }
  }
}
