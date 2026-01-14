import { redirect } from 'next/navigation';

export default async function HomeRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // Preserve query params when redirecting
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => queryString.append(key, v));
      } else {
        queryString.append(key, value);
      }
    }
  });

  const redirectUrl = queryString.toString()
    ? `/companies?${queryString.toString()}`
    : '/companies';
  redirect(redirectUrl);
}
