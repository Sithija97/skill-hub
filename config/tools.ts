import { TargetTool } from '@/types/skill'

// NOTE: Cursor and Windsurf brand colors are approximate community-recognized values,
// not officially trademarked hex codes. Update here if official brand guidelines are published.

export interface ToolConfig {
  label: string
  color: string
  exportPath: string | null
  brandBg: string
  brandBgDark: string
  brandText: string
  brandTextDark: string
}

export const TARGET_TOOLS: Record<TargetTool, ToolConfig> = {
  [TargetTool.CLAUDE]: {
    label: 'Claude',
    color: 'brand',
    exportPath: null,
    brandBg: '#fdf0ea',
    brandBgDark: 'rgba(217,119,87,0.15)',
    brandText: '#9a3f1f',
    brandTextDark: '#e89572',
  },
  [TargetTool.CURSOR]: {
    label: 'Cursor',
    color: 'teal',
    exportPath: '.cursor/rules/',
    brandBg: '#f0f0f0',
    brandBgDark: 'rgba(255,255,255,0.1)',
    brandText: '#1f2328',
    brandTextDark: '#e6edf3',
  },
  [TargetTool.COPILOT]: {
    label: 'Copilot',
    color: 'blue',
    exportPath: '.github/copilot-instructions.md',
    brandBg: '#f3eefc',
    brandBgDark: 'rgba(110,64,201,0.15)',
    brandText: '#553098',
    brandTextDark: '#b794f6',
  },
  [TargetTool.WINDSURF]: {
    label: 'Windsurf',
    color: 'amber',
    exportPath: '.windsurfrules',
    brandBg: '#e6f5f1',
    brandBgDark: 'rgba(11,107,83,0.15)',
    brandText: '#0b6b53',
    brandTextDark: '#4dd4ab',
  },
  [TargetTool.CONTINUE]: {
    label: 'Continue',
    color: 'green',
    exportPath: '.continue/config.json',
    brandBg: '#eef4fd',
    brandBgDark: 'rgba(77,141,246,0.15)',
    brandText: '#1d5bbf',
    brandTextDark: '#7eb0f9',
  },
  [TargetTool.OTHER]: {
    label: 'Other',
    color: 'gray',
    exportPath: null,
    brandBg: '#f6f8fa',
    brandBgDark: 'rgba(110,118,129,0.15)',
    brandText: '#59636e',
    brandTextDark: '#9198a1',
  },
}
