'use client'
import Image, { type ImageProps } from 'next/image'
import { useListCustomers, useGetCustomer } from '@rent-a-wheel/api-client/endpoints/customers.ts'

export function CustomersList() {
  // List all customers
  const { data, isLoading, error } = useListCustomers()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (data?.status !== 200) return <div>Error: {data?.status}</div>

  const customers = 'customers' in data.data ? data.data.customers : []

  return (
    <ul>
      {customers.map((customer: any) => (
        <li key={customer.id}>{customer.name}</li>
      ))}
    </ul>
  )
}

export function CustomerDetail({ customerId }: { customerId: string }) {
  // Get a specific customer
  const { data, isLoading, error } = useGetCustomer(customerId)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (data?.status !== 200) return <div>Error: {data?.status}</div>

  const customer = 'name' in data.data ? data.data : null

  return <div>{customer?.name}</div>
}

type Props = Omit<ImageProps, 'src'> & {
  srcLight: string
  srcDark: string
}

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  )
}

export default function Home() {
  return (
    <div>
      <CustomersList />
    </div>
  )
}
