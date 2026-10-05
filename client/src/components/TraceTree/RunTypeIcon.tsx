import { Network, Sparkles, Wrench, Database, Box } from 'lucide-react';
export function RunTypeIcon({ type }: { type: string }) {
  const Icon = ({ chain: Network, llm: Sparkles, tool: Wrench, retriever: Database } as Record<string, typeof Box>)[type] || Box;
  return <span className={`type-icon type-${type}`}><Icon size={15}/></span>;
}
