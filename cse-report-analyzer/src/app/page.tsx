import { ReportAnalyzer } from '@/components/analysis/report-analyzer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-12 px-4">
        <ReportAnalyzer />
      </main>
    </div>
  );
}
