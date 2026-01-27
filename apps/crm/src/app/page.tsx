'use client'
import Image, { type ImageProps } from "next/image";
import { Button } from "@rent-a-wheel/ui/button";
import styles from "./page.module.css";
import { useListCustomers, useGetCustomer } from '@rent-a-wheel/api-client';

export function CustomersList() {
  // List all customers
  const { data, isLoading, error } = useListCustomers();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data?.data.customers.map((customer) => (
        <li key={customer.id}>{customer.name}</li>
      ))}
    </ul>
  );
}

export function CustomerDetail({ customerId }: { customerId: string }) {
  // Get a specific customer
  const { data, isLoading, error } = useGetCustomer(customerId);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data?.data.name}</div>;
}

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  
  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  return (<div>
      <CustomersList />
      <CustomerDetail customerId="1" />
    </div>
  );
}
