export const BLOG_MEDIA_BUCKET = 'blog-media'
export const BLOG_VISITOR_TOKEN_KEY = 'flowzenit.blog.visitor_token'

export function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export function stripHtml(html) {
  return String(html ?? '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildExcerpt(html, maxLength = 180) {
  const text = stripHtml(html)
  if (text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, maxLength).trimEnd()}...`
}

export function formatBlogDate(value, locale = 'pt-BR') {
  if (!value) return ''
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatBlogMonth(value) {
  if (!value) return 'Sem data'
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function createArchiveGroups(posts) {
  const groups = new Map()

  posts.forEach((post) => {
    const key = formatBlogMonth(post.published_at ?? post.created_at)
    const current = groups.get(key) ?? []
    current.push(post)
    groups.set(key, current)
  })

  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items,
  }))
}

function randomToken() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

async function sha256Hex(value) {
  if (typeof crypto === 'undefined' || !crypto.subtle?.digest) {
    return value
  }

  const buffer = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function getVisitorFingerprint() {
  if (typeof window === 'undefined') {
    return null
  }

  let token = window.localStorage.getItem(BLOG_VISITOR_TOKEN_KEY)

  if (!token) {
    token = randomToken()
    window.localStorage.setItem(BLOG_VISITOR_TOKEN_KEY, token)
  }

  return sha256Hex(token)
}

export function getBlogLikeStorageKey(postId) {
  return `flowzenit.blog.like.${postId}`
}

export function getBlogCommentStorageKey(postId) {
  return `flowzenit.blog.comment.${postId}`
}

export function readBrowserFlag(key) {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(key) === '1'
}

export function writeBrowserFlag(key) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, '1')
}
