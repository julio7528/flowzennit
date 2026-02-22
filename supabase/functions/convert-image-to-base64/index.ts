import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    try {
        const { url } = await req.json()
        if (typeof url !== 'string' || !url.trim()) {
            return new Response(JSON.stringify({ error: 'URL inválida' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)
        const response = await fetch(url.trim(), { signal: controller.signal })
        clearTimeout(timeout)

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Falha ao baixar a imagem' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const buffer = await response.arrayBuffer()
        const bytes = new Uint8Array(buffer)
        if (bytes.length > 5 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: 'Imagem muito grande' }), {
                status: 413,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        let binary = ''
        const chunkSize = 0x8000
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
        }
        const base64 = btoa(binary)
        const dataUrl = `data:${contentType};base64,${base64}`

        return new Response(JSON.stringify({ base64: dataUrl }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch {
        return new Response(JSON.stringify({ error: 'Erro ao processar a imagem' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
})
