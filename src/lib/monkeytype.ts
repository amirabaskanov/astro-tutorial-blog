import type { MonkeyTypeData } from '../types/monkeytype'

const mapResponse = (response: any) => {
  return Object.entries(response.data).flatMap(([time, records]) => {
    return (records as any[]).map((record: any) => ({
      ...record,
      time: Number(time)
    }))
  })
}

export const getMonkeytypeData = async (): Promise<MonkeyTypeData> => {
  const API_KEY = import.meta.env.MONKEYTYPE_API_KEY

  if (!API_KEY) {
    // Return mock data if no API key is provided
    return {
      acc: 98,
      consistency: 95,
      language: 'english',
      time: 60,
      wpm: 120
    }
  }

  try {
    const response = await fetch(
      'https://api.monkeytype.com/users/personalBests?mode=time',
      { headers: { Authorization: `ApeKey ${API_KEY}` } }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseJSON = await response.json()
    const data = mapResponse(responseJSON)

    const bestScore = data.reduce((max, item) => {
      return item.wpm > max.wpm ? item : max
    }, data[0])

    return {
      acc: Math.round(bestScore.acc),
      consistency: Math.round(bestScore.consistency),
      language: bestScore.language,
      time: bestScore.time,
      wpm: Math.round(bestScore.wpm)
    }
  } catch (error) {
    console.error('Error fetching MonkeyType data:', error)
    // Return mock data on error
    return {
      acc: 98,
      consistency: 95,
      language: 'english',
      time: 60,
      wpm: 120
    }
  }
} 