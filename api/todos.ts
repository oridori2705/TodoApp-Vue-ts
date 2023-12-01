import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

const { API_KEY, USER_NAME, API_END_POINT } = process.env

interface RequestBody {
  path: '' | 'deletions' | 'reorder'
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data: {
    [key: string]: unknown
  }
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const { path = '', method = 'GET', data } = req.body as Partial<RequestBody>

  const { data: responseValue } = await axios({
    url: `${API_END_POINT}${path}`,
    method,
    headers: {
      'Content-Type': 'application/json',
      apikey: API_KEY,
      username: USER_NAME
    },
    data
  })
  res.status(200).json(responseValue)
}
