import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  Heart,
  LoaderCircle,
  MessageSquare,
  Send,
} from 'lucide-react'
import Header from './header.jsx'
import Footer from './footer.jsx'
import { supabase } from '../lib/supabase.js'
import {
  buildExcerpt,
  createArchiveGroups,
  formatBlogDate,
  getBlogCommentStorageKey,
  getBlogLikeStorageKey,
  getVisitorFingerprint,
  readBrowserFlag,
  writeBrowserFlag,
} from '../lib/blog.js'


export default function Blog() {
  const navigate = useNavigate()
  const { slug } = useParams()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [visitorFingerprint, setVisitorFingerprint] = useState(null)
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState([])
  const [commented, setCommented] = useState(false)
  const [commentState, setCommentState] = useState({ display_name: '', comment_text: '' })
  const [commentLoading, setCommentLoading] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const loadPosts = async () => {
    if (!supabase) {
      setError('Supabase nao configurado.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image_url, content_html, published_at, created_at')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }

    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    getVisitorFingerprint().then((value) => setVisitorFingerprint(value))
  }, [])

  const selectedPost = useMemo(() => {
    if (!posts.length) return null
    if (!slug) return posts[0]
    return posts.find((post) => post.slug === slug) ?? null
  }, [posts, slug])

  const featuredPost = posts[0] ?? null
  const recentPosts = posts.slice(1, 4)
  const olderPosts = posts.slice(4)
  const archiveGroups = useMemo(() => createArchiveGroups(posts), [posts])

  const loadEngagement = async (postId) => {
    const [commentsResult, likesResult] = await Promise.all([
      supabase
        .from('blog_comments')
        .select('id, display_name, comment_text, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true }),
      supabase.from('blog_likes').select('id', { count: 'exact', head: true }).eq('post_id', postId),
    ])

    if (!commentsResult.error) setComments(commentsResult.data ?? [])
    if (!likesResult.error) setLikeCount(likesResult.count ?? 0)
  }

  useEffect(() => {
    if (!selectedPost?.id) {
      setComments([])
      setLikeCount(0)
      return
    }

    loadEngagement(selectedPost.id)
    setLiked(readBrowserFlag(getBlogLikeStorageKey(selectedPost.id)))
    setCommented(readBrowserFlag(getBlogCommentStorageKey(selectedPost.id)))
    setFeedback('')
  }, [selectedPost?.id])

  const handleLike = async () => {
    if (!selectedPost?.id || !visitorFingerprint) return

    setLikeLoading(true)
    setFeedback('')

    const { error: insertError } = await supabase.from('blog_likes').insert({
      post_id: selectedPost.id,
      visitor_fingerprint: visitorFingerprint,
    })

    if (insertError) {
      if (insertError.message.toLowerCase().includes('duplicate')) {
        setLiked(true)
        writeBrowserFlag(getBlogLikeStorageKey(selectedPost.id))
        setFeedback('Este navegador ja registrou like para esta postagem.')
      } else {
        setFeedback(insertError.message)
      }
      setLikeLoading(false)
      return
    }

    writeBrowserFlag(getBlogLikeStorageKey(selectedPost.id))
    setLiked(true)
    setLikeCount((current) => current + 1)
    setLikeLoading(false)
  }

  const handleCommentSubmit = async (event) => {
    event.preventDefault()

    if (!selectedPost?.id || !visitorFingerprint) return

    const displayName = commentState.display_name.trim()
    const commentText = commentState.comment_text.trim()

    if (!displayName || !commentText) {
      setFeedback('Nome e comentario sao obrigatorios.')
      return
    }

    setCommentLoading(true)
    setFeedback('')

    const { error: insertError } = await supabase.from('blog_comments').insert({
      post_id: selectedPost.id,
      display_name: displayName,
      comment_text: commentText,
      visitor_fingerprint: visitorFingerprint,
    })

    if (insertError) {
      if (insertError.message.toLowerCase().includes('duplicate')) {
        setCommented(true)
        writeBrowserFlag(getBlogCommentStorageKey(selectedPost.id))
        setFeedback('Este navegador ja enviou um comentario para esta postagem.')
      } else {
        setFeedback(insertError.message)
      }
      setCommentLoading(false)
      return
    }

    writeBrowserFlag(getBlogCommentStorageKey(selectedPost.id))
    setCommented(true)
    setCommentState({ display_name: '', comment_text: '' })
    await loadEngagement(selectedPost.id)
    setCommentLoading(false)
  }

  const openPost = (postSlug) => {
    navigate(`/blog/${postSlug}`)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050508] font-[Public_Sans,sans-serif] text-white antialiased selection:bg-[#00F0FF] selection:text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@100..900&family=JetBrains+Mono:wght@100..800&display=swap');

        .blog-display { font-family: 'Public Sans', sans-serif; }
        .blog-mono { font-family: 'JetBrains Mono', monospace; }

        .blog-content h1 { font-size: 2.25rem; line-height: 1.1; font-weight: 900; margin: 2rem 0 1rem; }
        .blog-content h2 { font-size: 1.5rem; line-height: 1.2; font-weight: 800; margin: 1.75rem 0 0.75rem; }
        .blog-content p { color: #c9cdd6; margin-bottom: 1.25rem; line-height: 1.9; font-size: 1.0625rem; }
        .blog-content ul, .blog-content ol { margin: 1rem 0 1.25rem 1.5rem; color: #c9cdd6; }
        .blog-content ul { list-style: disc; }
        .blog-content ol { list-style: decimal; }
        .blog-content img { width: 100%; border: 1px solid rgba(255,255,255,0.06); margin: 2rem 0; }
        .blog-content a { color: #00F0FF; text-decoration: underline; }
        .blog-content blockquote { border-left: 3px solid #00F0FF; padding-left: 1.25rem; margin: 1.5rem 0; color: #9ba3b2; font-style: italic; }

        .post-card-hover { transition: border-color 0.2s ease, background-color 0.2s ease; }
        .post-card-hover:hover { border-color: rgba(0,240,255,0.18); background-color: rgba(255,255,255,0.015); }

        input::placeholder, textarea::placeholder { color: #4b5263; }
        input:focus, textarea:focus { outline: none; border-color: rgba(0,240,255,0.35); }
        input:disabled, textarea:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-0 px-4 sm:px-6 lg:px-8">

        {/* ── Masthead bar ── */}
        <div className="sticky top-20 z-20 bg-[#050508]/95 backdrop-blur-sm border-b border-[#1A1D26]">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="blog-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[#00F0FF]">
                Blog FlowZenit — Por Julio Gomes
              </span>
              <span className="h-3 w-px bg-white/10" />
              <span className="hidden text-[11px] text-gray-500 md:block">
                {posts.length} publicacoes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
              <span className="text-[11px] text-gray-500">ao vivo</span>
            </div>
          </div>
        </div>

        {/* ── States: loading / error / empty ── */}
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center border-b border-[#1A1D26]">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <LoaderCircle className="h-4 w-4 animate-spin text-[#00F0FF]" />
              Carregando postagens publicadas...
            </div>
          </div>
        ) : error ? (
          <div className="border-l-2 border-red-500 bg-red-500/5 px-6 py-5 text-sm text-red-300 my-10">{error}</div>
        ) : posts.length === 0 ? (
          <div className="border border-dashed border-white/10 p-20 text-center text-sm text-gray-500 my-10">
            Nenhuma postagem publicada no momento.
          </div>
        ) : (
          <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">

            {/* ── Sidebar ── */}
            <aside className="scrollbar-flowzenit border-r border-[#1A1D26] bg-[#050508] lg:sticky lg:top-[calc(3.5rem+5rem)] lg:max-h-[calc(100vh-8.5rem)] lg:overflow-y-auto">
              <div className="py-10 pr-7">
                <Link
                  to="/blog"
                  className="mb-8 inline-flex items-center gap-2 rounded-lg border border-[#1A1D26] bg-[#0E1016] px-3 py-2.5 text-xs text-gray-400 transition-colors hover:border-[#00F0FF]/30 hover:text-[#00F0FF]"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  Índice do Blog
                </Link>
                <p className="blog-mono mb-6 text-[10px] uppercase tracking-[0.32em] text-[#BD00FF]">Arquivo</p>
                <div className="flex flex-col gap-8">
                  {archiveGroups.map((group) => (
                    <div key={group.label}>
                      <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.26em] text-gray-600 border-b border-[#1A1D26] pb-2.5">
                        {group.label}
                      </h2>
                      <div className="flex flex-col gap-0">
                        {group.items.map((post) => (
                          <button
                            key={post.id}
                            type="button"
                            onClick={() => openPost(post.slug)}
                            className={`group border-l-2 py-3.5 pl-4 pr-2 text-left transition-colors ${
                              selectedPost?.id === post.id
                                ? 'border-[#00F0FF] bg-[#00F0FF]/5'
                                : 'border-transparent hover:border-[#BD00FF]/50 hover:bg-white/[0.02]'
                            }`}
                          >
                            <p className={`text-sm leading-snug ${selectedPost?.id === post.id ? 'font-semibold text-white' : 'text-gray-400 group-hover:text-white'}`}>
                              {post.title}
                            </p>
                            <p className="mt-2 text-[11px] text-gray-600">
                              {formatBlogDate(post.published_at ?? post.created_at)}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* ── Main content ── */}
            <div className="flex flex-col">

              {/* ── Index view ── */}
              {!slug && featuredPost && (
                <>
                  {/* Featured post */}
                  <section className="border-b border-[#1A1D26] mt-12 pb-14 pl-10 pr-6 lg:pl-12 lg:pr-8">
                    <p className="blog-mono mb-6 text-[10px] uppercase tracking-[0.32em] text-[#00F0FF]">Ultima postagem</p>
                    <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
                      <div className="flex flex-col gap-6">
                        <h2 className="blog-display text-4xl font-black leading-[1.05] tracking-tight text-white lg:text-5xl">
                          {featuredPost.title}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5 text-[#00FF88]" />
                          {formatBlogDate(featuredPost.published_at ?? featuredPost.created_at)}
                        </div>
                        <p className="max-w-xl text-[1.0625rem] leading-8 text-gray-300">
                          {featuredPost.excerpt || buildExcerpt(featuredPost.content_html)}
                        </p>
                        <button
                          type="button"
                          onClick={() => openPost(featuredPost.slug)}
                          className="inline-flex w-fit items-center gap-2 border border-[#00F0FF]/40 bg-[#00F0FF]/8 px-5 py-3 text-sm font-semibold text-[#00F0FF] transition-colors hover:bg-[#00F0FF]/15"
                        >
                          Ler postagem completa
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="overflow-hidden border border-white/8">
                        <img
                          src={featuredPost.cover_image_url}
                          alt={featuredPost.title}
                          className="h-full min-h-[300px] w-full object-cover"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Recent posts grid */}
                  {recentPosts.length > 0 && (
                    <section className="border-b border-[#1A1D26] mt-2 pl-10 lg:pl-12">
                      <div className="grid divide-x divide-[#1A1D26] xl:grid-cols-3">
                        {recentPosts.map((post) => (
                          <article
                            key={post.id}
                            className="post-card-hover border border-transparent border-b border-b-[#1A1D26] xl:border-b-0"
                          >
                            <button type="button" onClick={() => openPost(post.slug)} className="block h-full w-full text-left">
                              <div className="overflow-hidden border-b border-[#1A1D26]">
                                <img
                                  src={post.cover_image_url}
                                  alt={post.title}
                                  className="h-52 w-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                              </div>
                              <div className="p-7">
                                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-gray-600">
                                  {formatBlogDate(post.published_at ?? post.created_at)}
                                </p>
                                <h3 className="text-base font-bold leading-snug text-white">{post.title}</h3>
                                <p className="mt-3.5 text-sm leading-6 text-gray-500">
                                  {post.excerpt || buildExcerpt(post.content_html, 110)}
                                </p>
                              </div>
                            </button>
                          </article>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Older posts list */}
                  {olderPosts.length > 0 && (
                    <section className="pl-10 pt-10 pb-14 lg:pl-12">
                      <p className="blog-mono mb-2 text-[10px] uppercase tracking-[0.3em] text-[#00FF88]">Historico</p>
                      <h2 className="mb-7 text-xl font-black text-white">Demais postagens publicadas</h2>
                      <div className="flex flex-col border-t border-[#1A1D26]">
                        {olderPosts.map((post) => (
                          <button
                            key={post.id}
                            type="button"
                            onClick={() => openPost(post.slug)}
                            className="group flex items-center justify-between gap-6 border-b border-[#1A1D26] py-5 text-left transition-colors hover:bg-white/[0.02]"
                          >
                            <div className="flex items-baseline gap-6">
                              <span className="blog-mono hidden w-24 shrink-0 text-[10px] text-gray-600 lg:block">
                                {formatBlogDate(post.published_at ?? post.created_at)}
                              </span>
                              <p className="text-sm font-semibold text-gray-300 group-hover:text-white">{post.title}</p>
                            </div>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gray-600 group-hover:text-[#00F0FF]" />
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}

              {/* ── Single post view ── */}
              {slug && selectedPost && (
                <article className="pl-10 lg:pl-12">
                  {/* Post header nav */}
                  <div className="flex flex-wrap items-center gap-3 border-b border-[#1A1D26] py-6">
                    <Link
                      to="/blog"
                      className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Voltar ao indice
                    </Link>
                    <span className="h-3 w-px bg-white/10" />
                    <span className="blog-mono text-[10px] uppercase tracking-[0.24em] text-gray-600">
                      Publicado em {formatBlogDate(selectedPost.published_at ?? selectedPost.created_at)}
                    </span>
                  </div>

                  {/* Cover image */}
                  <div className="border-b border-[#1A1D26] mt-8 mr-6 lg:mr-10">
                    <img
                      src={selectedPost.cover_image_url}
                      alt={selectedPost.title}
                      className="h-[320px] w-full object-cover lg:h-[440px]"
                    />
                  </div>

                  {/* Post title & excerpt */}
                  <div className="border-b border-[#1A1D26] pt-12 pb-10 pr-6 lg:pr-14">
                    <h1 className="blog-display text-4xl font-black leading-[1.05] tracking-tight text-white lg:text-5xl">
                      {selectedPost.title}
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                      {selectedPost.excerpt || buildExcerpt(selectedPost.content_html, 220)}
                    </p>
                  </div>

                  {/* Post body */}
                  <div
                    className="blog-content border-b border-[#1A1D26] py-12 pr-6 lg:pr-20"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content_html }}
                  />

                  {/* Engagement — like */}
                  <div className="flex flex-col gap-5 border-b border-[#1A1D26] py-9 pr-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="blog-mono text-[10px] uppercase tracking-[0.3em] text-[#00FF88]">Engajamento</p>
                      <h2 className="mt-2 text-lg font-black text-white">Curtiu o conteudo?</h2>
                    </div>
                    <button
                      type="button"
                      disabled={liked || likeLoading}
                      onClick={handleLike}
                      className={`inline-flex items-center gap-3 border px-5 py-3 text-sm font-semibold transition-colors ${
                        liked
                          ? 'border-[#00FF88]/25 bg-[#00FF88]/8 text-[#7DFFBA]'
                          : 'border-white/10 text-gray-300 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {likeLoading
                        ? <LoaderCircle className="h-4 w-4 animate-spin" />
                        : <Heart className={`h-4 w-4 ${liked ? 'fill-[#00FF88] text-[#00FF88]' : ''}`} />
                      }
                      {liked ? 'Like registrado' : 'Curtir postagem'}
                      <span className="border border-white/10 bg-white/5 px-2 py-0.5 text-xs tabular-nums">
                        {likeCount}
                      </span>
                    </button>
                  </div>

                  {/* Comments section */}
                  <section className="py-10 pr-6 lg:pr-14">
                    <div className="mb-8 flex items-center gap-4">
                      <MessageSquare className="h-5 w-5 text-[#BD00FF]" />
                      <div>
                        <p className="blog-mono text-[10px] uppercase tracking-[0.3em] text-[#BD00FF]">Comentarios</p>
                        <h2 className="mt-1.5 text-lg font-black text-white">Participe da conversa</h2>
                      </div>
                    </div>

                    {/* Comment form */}
                    <form onSubmit={handleCommentSubmit} className="mb-10 border-b border-[#1A1D26] pb-10">
                      <div className="grid gap-3.5 md:grid-cols-[220px_minmax(0,1fr)]">
                        <input
                          value={commentState.display_name}
                          onChange={(event) =>
                            setCommentState((current) => ({ ...current, display_name: event.target.value }))
                          }
                          disabled={commented}
                          className="border border-white/10 bg-[#0A0B10] px-4 py-3.5 text-sm text-white transition-colors"
                          placeholder="Seu nome"
                        />
                        <textarea
                          value={commentState.comment_text}
                          onChange={(event) =>
                            setCommentState((current) => ({ ...current, comment_text: event.target.value }))
                          }
                          disabled={commented}
                          rows={4}
                          className="border border-white/10 bg-[#0A0B10] px-4 py-3.5 text-sm text-white transition-colors"
                          placeholder="Compartilhe seu comentario"
                        />
                      </div>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs leading-5 text-gray-600">
                          Cada navegador pode registrar um comentario e um like por postagem.
                        </p>
                        <button
                          type="submit"
                          disabled={commented || commentLoading}
                          className={`inline-flex items-center gap-2 border px-5 py-3 text-sm font-semibold transition-colors ${
                            commented
                              ? 'border-[#00FF88]/25 bg-[#00FF88]/8 text-[#7DFFBA]'
                              : 'border-[#BD00FF]/40 bg-[#BD00FF]/8 text-[#E580FF] hover:bg-[#BD00FF]/15'
                          }`}
                        >
                          {commentLoading
                            ? <LoaderCircle className="h-4 w-4 animate-spin" />
                            : <Send className="h-3.5 w-3.5" />
                          }
                          {commented ? 'Comentario registrado' : 'Enviar comentario'}
                        </button>
                      </div>
                    </form>

                    {/* Feedback message */}
                    {feedback && (
                      <div className="mb-7 border-l-2 border-yellow-500/40 bg-yellow-500/5 px-4 py-3.5 text-sm text-yellow-200/80">
                        {feedback}
                      </div>
                    )}

                    {/* Comments list */}
                    <div className="flex flex-col gap-0">
                      {comments.length === 0 ? (
                        <div className="border border-dashed border-white/10 p-10 text-center text-sm text-gray-600">
                          Ainda nao ha comentarios publicados nesta postagem.
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <article key={comment.id} className="border-b border-[#1A1D26] py-6">
                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                              <h3 className="text-sm font-bold text-white">{comment.display_name}</h3>
                              <span className="blog-mono text-[10px] text-gray-600">
                                {formatBlogDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-gray-400">{comment.comment_text}</p>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                </article>
              )}

              {/* ── 404 post ── */}
              {slug && !selectedPost && (
                <div className="border border-dashed border-white/10 m-12 p-20 text-center text-sm text-gray-500">
                  Postagem nao encontrada ou ainda nao publicada.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}