// (DELETE) - Moved to /(app)/inbox/page.tsx
// This file can be removed after confirming the new route works
// The new Inbox page is at src/app/(app)/inbox/page.tsx
// Note: ConversationsClient.tsx is still used by the new inbox page

'use client';

import { redirect } from 'next/navigation';

export default function ConversationsPageRoute() {
  redirect('/inbox');
}

