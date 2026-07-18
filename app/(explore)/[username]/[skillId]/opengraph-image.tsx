import { ImageResponse } from 'next/og'
import { getSkillById } from '@/lib/services/skill.service'
import { TARGET_TOOLS } from '@/config/tools'
import { SITE_CONFIG } from '@/config/site'

export const alt = `${SITE_CONFIG.name} skill`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#0d1117'
const CARD_BG = '#161b22'
const BORDER = 'rgba(255,255,255,0.08)'
const TEXT = '#f0f6fc'
const MUTED = '#8b949e'

function Logo() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#24292f',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
        <path d="M21 8L12 19.5H17.5L15 28L24 16H18.5L21 8Z" fill="white" />
      </svg>
    </div>
  )
}

function Fallback() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: BG,
          gap: 24,
        }}
      >
        <Logo />
        <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, color: TEXT }}>
          {SITE_CONFIG.name}
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: MUTED }}>{SITE_CONFIG.description}</div>
      </div>
    ),
    { ...size }
  )
}

type Props = { params: Promise<{ username: string; skillId: string }> }

export default async function Image({ params }: Props) {
  const { skillId } = await params
  const skill = await getSkillById(skillId)

  if (!skill) return Fallback()

  const toolConfig = TARGET_TOOLS[skill.targetTool]
  const visibleTags = skill.tags.slice(0, 3)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: 56,
          backgroundColor: BG,
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(217,119,87,0.15), transparent 55%)',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo />
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: TEXT }}>
            {SITE_CONFIG.name}
          </div>
        </div>

        {/* Content card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            marginTop: 40,
            padding: 44,
            borderRadius: 24,
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`,
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Tool badge */}
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                padding: '6px 16px',
                borderRadius: 999,
                fontSize: 20,
                fontWeight: 600,
                color: toolConfig.brandText,
                backgroundColor: toolConfig.brandBg,
              }}
            >
              {toolConfig.label}
            </div>

            {/* Title */}
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                fontSize: 60,
                fontWeight: 700,
                lineHeight: 1.15,
                color: TEXT,
              }}
            >
              {skill.title}
            </div>

            {/* Description */}
            <div
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                fontSize: 26,
                lineHeight: 1.4,
                color: MUTED,
              }}
            >
              {skill.description}
            </div>
          </div>

          {/* Footer: author + tags */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {skill.author.avatarUrl ? (
                <img
                  src={skill.author.avatarUrl}
                  alt=""
                  width={48}
                  height={48}
                  style={{ borderRadius: 24 }}
                />
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#30363d',
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {skill.author.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', fontSize: 22, fontWeight: 600, color: TEXT }}>
                  {skill.author.displayName}
                </div>
                <div style={{ display: 'flex', fontSize: 18, color: MUTED }}>
                  @{skill.author.username}
                </div>
              </div>
            </div>

            {visibleTags.length > 0 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {visibleTags.map((tag) => (
                  <div
                    key={tag.id}
                    style={{
                      display: 'flex',
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontSize: 18,
                      color: MUTED,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
