import { SITE_CONFIG } from '@/config/site'

export function buildSkillShareUrl(username: string, skillId: string): string {
  return `${SITE_CONFIG.url}/${username}/${skillId}`
}

export interface ShareLinks {
  whatsapp: string
  linkedin: string
  teams: string
  x: string
  email: string
}

export function buildShareLinks({ url, title }: { url: string; title: string }): ShareLinks {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    teams: `https://teams.microsoft.com/share?href=${encodedUrl}&msgText=${encodedTitle}`,
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  }
}
