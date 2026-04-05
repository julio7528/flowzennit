import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bold,
  ChevronLeft,
  Eye,
  FilePlus2,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  LoaderCircle,
  Palette,
  Save,
  Send,
  Trash2,
  Type,
} from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import useAdminRole from '../../hooks/useAdminRole.js'
import { BLOG_MEDIA_BUCKET, buildExcerpt, formatBlogDate, slugify } from '../../lib/blog.js'

const INITIAL_FORM = {
  id: null,
  slug: '',
  title: '',
  excerpt: '',
  cover_image_url: '',
  content_html: '<p>Comece a escrever aqui...</p>',
  content_json: null,
  published: false,
  published_at: null,
}

const COLOR_OPTIONS = ['#ffffff', '#00F0FF', '#BD00FF', '#00FF88', '#FACC15']
const FONT_SIZE_OPTIONS = [
  { label: 'P', value: '3' },
  { label: 'S', value: '2' },
  { label: 'L', value: '5' },
  { label: 'XL', value: '6' },
]

function ToolbarButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-transparent text-gray-400 transition-all hover:border-[#00F0FF]/50 hover:bg-[#00F0FF]/5 hover:text-[#00F0FF]"
      title={label}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  )
}

function buildContentJson(html) {
  return {
    version: 1,
    type: 'html',
    html,
    plain_text: buildExcerpt(html, 5000),
  }
}

async function uploadBlogAsset(file, folder, userId) {
  const safeName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'asset'
  const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : 'png'
  const path = `${userId}/${folder}/${Date.now()}-${safeName}.${extension}`

  const { error } = await supabase.storage.from(BLOG_MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from(BLOG_MEDIA_BUCKET).getPublicUrl(path)

  return publicUrl
}

export default function BlogAdmin() {
  const editorRef = useRef(null)
  const coverInputRef = useRef(null)
  const inlineImageInputRef = useRef(null)
  const { user } = useAdminRole()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState(INITIAL_FORM)
  const [coverUploading, setCoverUploading] = useState(false)
  const [inlineUploading, setInlineUploading] = useState(false)

  const isEditing = Boolean(form.id)

  const sortedPosts = useMemo(
    () =>
      [...posts].sort((a, b) => {
        const left = new Date(a.updated_at ?? a.created_at ?? 0).getTime()
        const right = new Date(b.updated_at ?? b.created_at ?? 0).getTime()
        return right - left
      }),
    [posts]
  )

  const loadPosts = async () => {
    if (!supabase) {
      setLoading(false)
      setError('Supabase nao configurado.')
      return
    }
    setLoading(true)
    setError('')
    const { data, error: queryError } = await supabase
      .from('blog_posts')
      .select(
        'id, slug, title, excerpt, cover_image_url, content_html, content_json, published, published_at, created_at, updated_at'
      )
      .order('updated_at', { ascending: false })

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
    if (!editorRef.current) return
    if (editorRef.current.innerHTML !== form.content_html) {
      editorRef.current.innerHTML = form.content_html || '<p></p>'
    }
  }, [form.content_html])

  const syncEditorState = () => {
    const html = editorRef.current?.innerHTML?.trim() || '<p></p>'
    setForm((current) => ({
      ...current,
      content_html: html,
      content_json: buildContentJson(html),
    }))
  }

  const runCommand = (command, value = null) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    syncEditorState()
  }

  const resetForm = () => {
    setForm(INITIAL_FORM)
    setError('')
    setSuccess('')
  }

  const startNewPost = () => resetForm()

  const startEditPost = (post) => {
    setForm({
      id: post.id,
      slug: post.slug ?? '',
      title: post.title ?? '',
      excerpt: post.excerpt ?? '',
      cover_image_url: post.cover_image_url ?? '',
      content_html: post.content_html ?? '<p></p>',
      content_json: post.content_json ?? buildContentJson(post.content_html ?? '<p></p>'),
      published: Boolean(post.published),
      published_at: post.published_at ?? null,
    })
    setError('')
    setSuccess('')
  }

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !user?.id) return
    try {
      setCoverUploading(true)
      setError('')
      const url = await uploadBlogAsset(file, 'covers', user.id)
      setForm((current) => ({ ...current, cover_image_url: url }))
    } catch (uploadError) {
      setError(uploadError.message ?? 'Falha ao enviar imagem de capa.')
    } finally {
      setCoverUploading(false)
      event.target.value = ''
    }
  }

  const handleInlineImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !user?.id) return
    try {
      setInlineUploading(true)
      setError('')
      const url = await uploadBlogAsset(file, 'body', user.id)
      runCommand('insertImage', url)
    } catch (uploadError) {
      setError(uploadError.message ?? 'Falha ao enviar imagem do conteudo.')
    } finally {
      setInlineUploading(false)
      event.target.value = ''
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('Deseja realmente excluir esta postagem?')) return
    const { error: deleteError } = await supabase.from('blog_posts').delete().eq('id', postId)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    if (form.id === postId) resetForm()
    setPosts((current) => current.filter((post) => post.id !== postId))
    setSuccess('Postagem excluida com sucesso.')
  }

  const savePost = async (publish) => {
    if (!user?.id) {
      setError('Sessao invalida.')
      return
    }
    const title = form.title.trim()
    const slug = slugify(form.slug || title)
    const contentHtml = editorRef.current?.innerHTML?.trim() || form.content_html
    const generatedExcerpt = buildExcerpt(contentHtml)
    const excerpt = form.excerpt.trim() || generatedExcerpt

    if (!title) { setError('Titulo obrigatorio.'); return }
    if (!form.cover_image_url) { setError('Imagem de capa obrigatoria.'); return }
    if (!buildExcerpt(contentHtml, 20)) { setError('Texto da postagem obrigatorio.'); return }
    if (excerpt.trim().length < 10) {
      setError('Resumo obrigatorio com pelo menos 10 caracteres. Se preferir, escreva mais conteudo no texto para gerar um resumo automatico valido.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      slug,
      title,
      excerpt,
      cover_image_url: form.cover_image_url,
      content_html: contentHtml,
      content_json: buildContentJson(contentHtml),
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
    }

    const query = isEditing
      ? supabase.from('blog_posts').update(payload).eq('id', form.id)
      : supabase.from('blog_posts').insert(payload)

    const { data, error: saveError } = await query.select('id').single()

    if (saveError) {
      setSaving(false)
      setError(saveError.message)
      return
    }

    setSuccess(publish ? 'Postagem publicada com sucesso.' : 'Rascunho salvo com sucesso.')
    await loadPosts()

    if (data?.id) {
      const savedPost = sortedPosts.find((item) => item.id === data.id)
      if (savedPost) {
        startEditPost(savedPost)
      } else {
        setForm((current) => ({
          ...current,
          id: data.id,
          slug,
          excerpt,
          content_html: contentHtml,
          content_json: buildContentJson(contentHtml),
          published: publish,
          published_at: publish ? new Date().toISOString() : null,
        }))
      }
    }
    setSaving(false)
  }

  return (
    <section className="min-h-full bg-[#050508] text-white">

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-[#07080D]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.36em] text-[#00F0FF]">Blog Admin</span>
            <span className="h-3 w-px bg-white/20" />
            <h1 className="text-sm font-semibold text-white/80">Painel editorial</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadPosts}
              className="inline-flex items-center gap-2 border border-white/10 bg-transparent px-4 py-2 text-xs font-medium text-gray-400 transition-all hover:border-white/30 hover:text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              Atualizar
            </button>
            <button
              type="button"
              onClick={startNewPost}
              className="inline-flex items-center gap-2 border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-4 py-2 text-xs font-bold text-[#00F0FF] transition-all hover:bg-[#00F0FF]/15"
            >
              <FilePlus2 className="h-3.5 w-3.5" />
              Nova postagem
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────────── */}
      <div className="mx-auto flex max-w-7xl gap-0 divide-x divide-white/10">

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="w-[300px] shrink-0 flex flex-col min-h-[calc(100vh-57px)]">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#BD00FF]">Postagens</p>
                <h2 className="mt-1 text-sm font-bold text-white">Todas as entradas</h2>
              </div>
              <span className="border border-white/10 px-2.5 py-0.5 font-mono text-xs text-gray-500">
                {sortedPosts.length}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-2 px-5 py-4 text-xs text-gray-500">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#00F0FF]" />
                Carregando...
              </div>
            ) : sortedPosts.length === 0 ? (
              <div className="px-5 py-6 text-xs text-gray-600">
                Nenhuma postagem encontrada ainda.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {sortedPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => startEditPost(post)}
                    className={`w-full px-5 py-4 text-left transition-colors ${
                      form.id === post.id
                        ? 'bg-[#00F0FF]/5 border-l-2 border-l-[#00F0FF]'
                        : 'border-l-2 border-l-transparent hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-[9px] uppercase tracking-[0.28em] ${
                          post.published ? 'text-[#00FF88]' : 'text-[#BD00FF]'
                        }`}
                      >
                        {post.published ? '● Publicado' : '○ Rascunho'}
                      </span>
                      <span className="font-mono text-[10px] text-gray-600">
                        {formatBlogDate(post.published_at ?? post.created_at)}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-xs font-semibold leading-5 text-white/90">{post.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-gray-600">{post.excerpt}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Editor Area ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-57px)]">

          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00FF88]">
                {isEditing ? 'Editando' : 'Nova entrada'}
              </p>
              <h2 className="mt-0.5 text-base font-bold text-white">
                {isEditing ? (form.title || 'Sem título') : 'Monte a proxima entrada do blog'}
              </h2>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={() => handleDelete(form.id)}
                className="inline-flex items-center gap-2 border border-red-500/20 bg-transparent px-3 py-2 text-xs text-red-400 transition-all hover:border-red-500/40 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </button>
            )}
          </div>

          <div className="grid flex-1 xl:grid-cols-[1fr_280px] divide-x divide-white/10">

            {/* ── Form + Editor ──────────────────────────────────────── */}
            <div className="flex flex-col gap-0 divide-y divide-white/[0.07]">

              {/* Campos título / slug / resumo */}
              <div className="grid gap-0 md:grid-cols-2 divide-x divide-white/[0.07]">
                <label className="flex flex-col gap-1.5 px-6 py-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-gray-500">Título</span>
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                        slug: current.id ? current.slug : slugify(event.target.value),
                      }))
                    }
                    className="border-0 border-b border-white/10 bg-transparent pb-1 text-sm text-white outline-none transition-colors focus:border-[#00F0FF]/50 placeholder:text-gray-700"
                    placeholder="Titulo da postagem"
                  />
                </label>
                <label className="flex flex-col gap-1.5 px-6 py-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-gray-500">Slug</span>
                  <input
                    value={form.slug}
                    onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
                    className="border-0 border-b border-white/10 bg-transparent pb-1 font-mono text-sm text-[#BD00FF] outline-none transition-colors focus:border-[#BD00FF]/50 placeholder:text-gray-700"
                    placeholder="slug-da-postagem"
                  />
                </label>
              </div>

              <div className="px-6 py-4">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-gray-500">Resumo</span>
                  <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
                    className="border-0 border-b border-white/10 bg-transparent pb-1 text-sm leading-6 text-white/80 outline-none transition-colors focus:border-[#00FF88]/50 resize-none placeholder:text-gray-700"
                    placeholder="Resumo curto para cards, SEO e destaque."
                  />
                </label>
              </div>

              {/* Toolbar */}
              <div className="px-6 py-3 bg-[#07080D]">
                <div className="flex flex-wrap items-center gap-1">
                  <ToolbarButton icon={Bold} label="Negrito" onClick={() => runCommand('bold')} />
                  <ToolbarButton icon={Italic} label="Italico" onClick={() => runCommand('italic')} />
                  <span className="mx-1 h-4 w-px bg-white/10" />
                  <ToolbarButton icon={Heading1} label="Heading 1" onClick={() => runCommand('formatBlock', '<h1>')} />
                  <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => runCommand('formatBlock', '<h2>')} />
                  <span className="mx-1 h-4 w-px bg-white/10" />
                  <ToolbarButton icon={List} label="Lista" onClick={() => runCommand('insertUnorderedList')} />
                  <ToolbarButton icon={ListOrdered} label="Lista numerada" onClick={() => runCommand('insertOrderedList')} />
                  <span className="mx-1 h-4 w-px bg-white/10" />
                  <button
                    type="button"
                    onClick={() => inlineImageInputRef.current?.click()}
                    className="inline-flex h-9 items-center gap-1.5 border border-white/10 bg-transparent px-3 text-xs text-gray-400 transition-all hover:border-[#00F0FF]/40 hover:text-[#00F0FF]"
                  >
                    {inlineUploading
                      ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      : <ImagePlus className="h-3.5 w-3.5" />}
                    Imagem
                  </button>
                  <div className="inline-flex h-9 items-center gap-1.5 border border-white/10 bg-transparent px-3">
                    <Palette className="h-3.5 w-3.5 text-gray-500" />
                    <select
                      onChange={(event) => { if (event.target.value) runCommand('foreColor', event.target.value) }}
                      className="bg-transparent text-xs text-gray-400 outline-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Cor</option>
                      {COLOR_OPTIONS.map((color) => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                  <div className="inline-flex h-9 items-center gap-1.5 border border-white/10 bg-transparent px-3">
                    <Type className="h-3.5 w-3.5 text-gray-500" />
                    <select
                      onChange={(event) => { if (event.target.value) runCommand('fontSize', event.target.value) }}
                      className="bg-transparent text-xs text-gray-400 outline-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Tamanho</option>
                      {FONT_SIZE_OPTIONS.map((size) => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ContentEditable Editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncEditorState}
                className="
                  flex-1 min-h-[420px] px-6 py-5
                  text-sm leading-8 text-gray-200 outline-none
                  bg-[#050508]
                  [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-white
                  [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white
                  [&_img]:my-6 [&_img]:border [&_img]:border-white/10 [&_img]:shadow-xl
                  [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:list-disc
                  [&_p]:text-gray-300
                "
              />
            </div>

            {/* ── Right Column: Capa / Preview / Ações ──────────────── */}
            <div className="flex flex-col divide-y divide-white/[0.07]">

              {/* Capa */}
              <div className="px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#00F0FF]">Capa</span>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition-all hover:border-[#00F0FF]/40 hover:text-[#00F0FF]"
                  >
                    {coverUploading
                      ? <LoaderCircle className="h-3 w-3 animate-spin" />
                      : <ImagePlus className="h-3 w-3" />}
                    Upload
                  </button>
                </div>
                {form.cover_image_url ? (
                  <img
                    src={form.cover_image_url}
                    alt={form.title || 'Capa'}
                    className="h-44 w-full border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center border border-dashed border-white/10 bg-white/[0.02] text-xs text-gray-700">
                    Envie uma imagem de capa
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="px-5 py-4">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[#BD00FF]">Preview</p>
                <div className="border-l-2 border-l-[#BD00FF]/40 bg-[#07080D] p-4">
                  <span
                    className={`font-mono text-[9px] uppercase tracking-[0.26em] ${
                      form.published ? 'text-[#00FF88]' : 'text-[#BD00FF]'
                    }`}
                  >
                    {form.published ? '● Publicado' : '○ Rascunho'}
                  </span>
                  <h4 className="mt-2 text-sm font-bold leading-5 text-white">
                    {form.title || 'Titulo da postagem'}
                  </h4>
                  <p className="mt-2 text-[11px] leading-5 text-gray-500">
                    {form.excerpt || buildExcerpt(form.content_html || '<p></p>')}
                  </p>
                </div>
              </div>

              {/* Ações */}
              <div className="px-5 py-4 flex flex-col gap-2">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.26em] text-gray-600">Publicação</p>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => savePost(false)}
                  className="inline-flex items-center justify-center gap-2 border border-white/10 bg-transparent px-4 py-2.5 text-xs font-medium text-gray-300 transition-all hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  Salvar rascunho
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => savePost(true)}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00F0FF] to-[#BD00FF] px-4 py-2.5 text-xs font-bold text-[#050508] transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Publicar postagem
                </button>
                {isEditing && (
                  <a
                    href={form.slug ? `/blog/${form.slug}` : '/blog'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-white/10 bg-transparent px-4 py-2.5 text-xs text-gray-400 transition-all hover:border-[#00FF88]/30 hover:text-[#00FF88]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Ver no blog
                  </a>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center gap-2 bg-transparent px-4 py-2.5 text-xs text-gray-600 transition-all hover:text-gray-400"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Limpar formulario
                </button>
              </div>

              {/* Feedback */}
              {(error || success) && (
                <div
                  className={`mx-5 mb-4 border-l-2 px-4 py-3 text-xs ${
                    error
                      ? 'border-l-red-500 bg-red-500/5 text-red-300'
                      : 'border-l-[#00FF88] bg-[#00FF88]/5 text-[#00FF88]/80'
                  }`}
                >
                  {error || success}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
      <input ref={inlineImageInputRef} type="file" accept="image/*" hidden onChange={handleInlineImageUpload} />
    </section>
  )
}
