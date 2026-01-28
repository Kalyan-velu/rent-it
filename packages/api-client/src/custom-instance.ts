import Axios, { AxiosError, AxiosRequestConfig } from 'axios'

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
})

export const customInstance = async <T>(url: string, config: any): Promise<T> => {
  const response = await AXIOS_INSTANCE({
    url,
    ...config,
  })
  return {
    data: response.data,
    status: response.status,
    headers: response.headers,
  } as T
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
