import type { APIRoute } from 'astro'
import { MAPTILER_API_KEY } from 'astro:env/server'

interface MapCoordinate {
  z: string
  x: string
  y: string
}

const generateMapUrl = ({ z, x, y }: MapCoordinate): string => {
  return `https://api.maptiler.com/maps/streets-v2-dark/${z}/${x}/${y}.png?key=${MAPTILER_API_KEY}`
//   return `https://api.maptiler.com/maps/e4158375-98c0-4345-a238-74bc07955527/?key=yEyrvOzGbcGcclRXkYL9#10.1/42.40809/-71.10681`
}

export const GET: APIRoute = async ({ params }) => {
  const { z, x, y } = params

  if (!z || !x || !y)
    return new Response(null, {
      status: 400,
      statusText: 'Bad request'
    })

  const response = await fetch(generateMapUrl({ z, x, y }))
  if (!response.ok) {
    return new Response('Error fetching tile', { status: response.status })
  }

  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'max-age=86400')

  return new Response(response.body, {
    status: response.status,
    headers
  })
}

export const prerender = false
