'use client';
import { LogProvider } from '@/components/providers/LogProvider';
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <LogProvider>{children}</LogProvider>;
}