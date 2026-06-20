'use server'

import {
  getSkills as _getSkills,
  getSkillById as _getSkillById,
  createSkill as _createSkill,
  updateSkill as _updateSkill,
  deleteSkill as _deleteSkill,
  forkSkill as _forkSkill,
  likeSkill as _likeSkill,
  unlikeSkill as _unlikeSkill,
  saveSkill as _saveSkill,
  unsaveSkill as _unsaveSkill,
} from '@/lib/services/skill.service'
import type { SkillFilters, CreateSkillInput, UpdateSkillInput } from '@/lib/services/skill.service'
import type { SkillWithRelations } from '@/types/skill'
import type { PaginatedResponse } from '@/types/api'

export async function getSkillsAction(
  filters?: SkillFilters
): Promise<PaginatedResponse<SkillWithRelations>> {
  return _getSkills(filters)
}

export async function getSkillByIdAction(
  id: string
): Promise<SkillWithRelations | null> {
  return _getSkillById(id)
}

export async function createSkillAction(
  data: CreateSkillInput
): Promise<SkillWithRelations> {
  return _createSkill(data)
}

export async function updateSkillAction(
  id: string,
  data: UpdateSkillInput
): Promise<SkillWithRelations> {
  return _updateSkill(id, data)
}

export async function deleteSkillAction(id: string): Promise<void> {
  return _deleteSkill(id)
}

export async function forkSkillAction(
  id: string,
  userId: string
): Promise<SkillWithRelations> {
  return _forkSkill(id, userId)
}

export async function likeSkillAction(id: string, userId: string): Promise<void> {
  return _likeSkill(id, userId)
}

export async function unlikeSkillAction(id: string, userId: string): Promise<void> {
  return _unlikeSkill(id, userId)
}

export async function saveSkillAction(id: string, userId: string): Promise<void> {
  return _saveSkill(id, userId)
}

export async function unsaveSkillAction(id: string, userId: string): Promise<void> {
  return _unsaveSkill(id, userId)
}
