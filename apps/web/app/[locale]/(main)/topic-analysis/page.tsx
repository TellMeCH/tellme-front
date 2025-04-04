import { ReactElement, Suspense } from 'react';
import { TopicAnalysis } from '@tellme/web/topic/features/analysis';

export default function TopicAnalysisPage(): ReactElement {
  return (
    <Suspense>
      <TopicAnalysis />
    </Suspense>
  );
}
