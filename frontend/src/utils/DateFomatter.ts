export function dateFromMatter(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  // Less than 1 minute
  if (diffSec < 60) return `${diffSec || 1} sec ago`;
  // Less than 1 hour -> minutes
  if (diffMin < 60) return `${diffMin} min ago`;
  // Less than 1 day -> hours
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;
  // Less than 1 week -> days
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

  // Weeks (1-2 weeks show week(s) ago)
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek <= 2) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;

  // Otherwise show full date: e.g. 5 March 2024
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

