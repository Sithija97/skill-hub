import { create } from 'zustand'
import type { CreateSkillInput } from '@/lib/services/skill.service'

interface EditorState {
  draft: Partial<CreateSkillInput>
  setDraft: (draft: Partial<CreateSkillInput>) => void
  resetDraft: () => void
  isDirty: boolean
}

export const useEditorStore = create<EditorState>((set) => ({
  draft: {},
  isDirty: false,
  setDraft: (draft) =>
    set((state) => ({
      draft: { ...state.draft, ...draft },
      isDirty: true,
    })),
  resetDraft: () => set({ draft: {}, isDirty: false }),
}))
