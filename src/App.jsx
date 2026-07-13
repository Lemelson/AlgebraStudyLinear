import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';

const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const TopicsPage = lazy(() => import('./pages/TopicsPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const LecturesPage = lazy(() => import('./pages/LecturesPage'));
const TopicPage = lazy(() => import('./pages/TopicPage'));
const LectureDetailPage = lazy(() => import('./pages/LectureDetailPage'));
const CorpusDetailPage = lazy(() => import('./pages/CorpusDetailPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const ExamFocusPage = lazy(() => import('./pages/ExamFocusPage'));
const ExamVariantProblemPage = lazy(() => import('./pages/ExamVariantProblemPage'));

export default function App() {
  return (
    <HashRouter>
      <SiteHeader />
      <Suspense fallback={<main className="page-shell route-loading" aria-live="polite">Загружаю раздел…</main>}>
        <Routes>
          <Route path="/" element={<RoadmapPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/topics/:slug" element={<TopicPage />} />
          <Route path="/definitions" element={<CollectionPage kind="definitions" />} />
          <Route path="/definitions/:groupId/:number" element={<CorpusDetailPage kind="definitions" />} />
          <Route path="/proofs" element={<CollectionPage kind="proofs" />} />
          <Route path="/proofs/:groupId/:number" element={<CorpusDetailPage kind="proofs" />} />
          <Route path="/problems" element={<CollectionPage kind="problems" />} />
          <Route path="/problems/:groupId/:number" element={<CorpusDetailPage kind="problems" />} />
          <Route path="/exam-2025" element={<ExamFocusPage />} />
          <Route path="/exam-2025/:number" element={<ExamVariantProblemPage />} />
          <Route path="/lectures" element={<LecturesPage />} />
          <Route path="/lectures/:slug" element={<LectureDetailPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
