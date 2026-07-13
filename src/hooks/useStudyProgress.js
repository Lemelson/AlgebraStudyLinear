import { useCallback, useMemo, useState } from 'react';

const STORAGE_KEY = 'algebra_exam_progress_v1';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function useStudyProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const update = useCallback((topicId, sectionId) => {
    setProgress((current) => {
      const sections = new Set(current[topicId] || []);
      if (sections.has(sectionId)) sections.delete(sectionId);
      else sections.add(sectionId);
      const next = { ...current, [topicId]: [...sections] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const completedCount = useMemo(
    () => Object.values(progress).filter((sections) => sections.includes('complete')).length,
    [progress],
  );

  const topicPercent = useCallback((topicId, totalSections = 6) => {
    const sections = progress[topicId] || [];
    if (sections.includes('complete')) return 100;
    return Math.min(90, Math.round((sections.length / totalSections) * 100));
  }, [progress]);

  return { progress, update, completedCount, topicPercent };
}
