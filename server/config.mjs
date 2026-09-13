const parseList = (value, fallback = []) => String(value || '')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean)
  .concat(fallback)
  .filter((item, index, items) => items.indexOf(item) === index)

export const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || process.env.API_PORT || 4000),
  corsOrigins: parseList(process.env.CORS_ORIGINS, ['*']),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'carbon-connect-development-secret-change-me',
})

export const isProduction = config.nodeEnv === 'production'

if (isProduction && config.jwtAccessSecret.includes('change-me')) {
  throw new Error('JWT_ACCESS_SECRET must be set to a strong value in production.')
}
