const lessonFiles = import.meta.glob('../content/lectures/*.md', {
  query: '?raw',
  import: 'default',
});

function normalizeMathDelimiters(markdown) {
  return markdown
    .replaceAll('\\[', '$$')
    .replaceAll('\\]', '$$')
    .replaceAll('\\(', '$')
    .replaceAll('\\)', '$');
}

export async function getLectureLesson(filename) {
  const key = Object.keys(lessonFiles).find((path) => path.endsWith(`/${filename}`));
  if (!key) return '';
  const rawLesson = await lessonFiles[key]();
  const markdown = rawLesson
    .replace(/^---\s*[\s\S]*?\s*---\s*/u, '')
    .trim();

  return normalizeMathDelimiters(markdown);
}
