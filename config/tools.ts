import { TargetTool } from '@/types/skill'

export const TARGET_TOOLS: Record<
  TargetTool,
  { label: string; color: string; exportPath: string | null }
> = {
  [TargetTool.CLAUDE]: { label: 'Claude', color: 'brand', exportPath: null },
  [TargetTool.CURSOR]: { label: 'Cursor', color: 'teal', exportPath: '.cursor/rules/' },
  [TargetTool.COPILOT]: { label: 'Copilot', color: 'blue', exportPath: '.github/copilot-instructions.md' },
  [TargetTool.WINDSURF]: { label: 'Windsurf', color: 'amber', exportPath: '.windsurfrules' },
  [TargetTool.CONTINUE]: { label: 'Continue', color: 'green', exportPath: '.continue/config.json' },
  [TargetTool.OTHER]: { label: 'Other', color: 'gray', exportPath: null },
}
