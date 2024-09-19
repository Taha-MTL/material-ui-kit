import type { Metadata } from 'next';

import { config } from '@/config';
import React from 'react';

export const metadata: Metadata = {
  title: `Customers | Dashboard | ${config.site.name}`,
};

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
