const PRODUCTION_URL = 'https://skill-hub-v1.vercel.app'

// On Vercel preview/branch deployments, report the deployment's own URL
// instead of the hardcoded production domain so share links and OG
// metadata point at the environment that actually generated them.
const siteUrl =
  process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : PRODUCTION_URL

export const SITE_CONFIG = {
  name: 'SkillHub',
  description: 'GitHub for skills — create, version, and share AI skills',
  url: siteUrl,
  defaultPageSize: 20,
}
