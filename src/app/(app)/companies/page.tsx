import { redirect } from 'next/navigation';

export default function CompaniesRedirect({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Preserve query params when redirecting
  const queryString = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => queryString.append(key, v));
      } else {
        queryString.append(key, value);
      }
    }
  });

  const redirectUrl = queryString.toString()
    ? `/?${queryString.toString()}`
    : '/';
  redirect(redirectUrl);
}
