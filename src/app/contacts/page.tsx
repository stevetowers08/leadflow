// (DELETE) - Moved to /(app)/leads/page.tsx
// This file can be removed after confirming the new route works
// The new Leads page is at src/app/(app)/leads/page.tsx

'use client';

import { redirect } from 'next/navigation';

export default function ContactsPage() {
  redirect('/leads');
}


