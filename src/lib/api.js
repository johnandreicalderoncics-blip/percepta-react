// REST client for the Percepta backend (see ../server). The browser never
// talks to Supabase directly: every read and write goes through the API,
// which authenticates the caller with an HTTP-only session cookie. No
// credentials, tokens, or secrets are handled in this file.
const BASE = '/api';

// Errors thrown by this module. `status` carries the HTTP status code so
// callers can react precisely (401 session expired, 409 conflict, etc.).
export class ApiError extends Error {
  constructor(message, { status = null, details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Turn an API/transport error into something a user can act on.
// Never swallows the failure: this only re-labels it.
export const toFriendlyError = (err) => {
  if (err instanceof ApiError) return err.message;
  if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError')) {
    return 'Could not reach the Percepta API. Make sure the backend is running (cd server && npm run dev).';
  }
  return err?.message || 'Unexpected error.';
};

const request = async (path, { method = 'GET', body } = {}) => {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      credentials: 'include',
      ...(body !== undefined
        ? {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        : {}),
    });
  } catch {
    throw new ApiError(
      'Could not reach the Percepta API. Make sure the backend is running (cd server && npm run dev).'
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.error || `Request failed (${response.status}).`, {
      status: response.status,
      details: data.details ?? null,
    });
  }
  return data;
};

// --- Reference data (reads) -------------------------------------------------

export const fetchPlatforms = async () => {
  const data = await request('/platforms');
  return data.platforms;
};

export const fetchMetadataCategories = async () => {
  const data = await request('/categories');
  return data.categories;
};

// Ranked trends from the latest collection run, grouped by category
// ('audio' | 'hashtag' | 'keyword'), already shaped for the Trends page.
export const fetchLatestTrends = async () => {
  const data = await request('/trends');
  const groups = { audio: data.audio, hashtag: data.hashtag, keyword: data.keyword };
  // The API leaves presentation flags out; derive them like the old client did.
  for (const key of Object.keys(groups)) {
    groups[key] = groups[key].map((trend) => ({
      ...trend,
      status: trend.tgr > 0 ? 'Growing' : 'New',
    }));
  }
  return groups;
};

// --- Videos (read / create / delete) ---------------------------------------

export const fetchUserVideos = async () => {
  const data = await request('/videos');
  return data.videos;
};

export const fetchUserRecommendations = async () => {
  const data = await request('/recommendations');
  return data.recommendations;
};

// Dashboard payload: the user's videos plus evaluations/recommendations.
export const fetchDashboardData = async () => {
  const data = await request('/dashboard');
  return { videos: data.videos, recommendations: data.recommendations };
};

// Saves the video record and its creator metadata in one server-side
// transaction-ish call: the backend inserts the video row, splits the
// hashtag/keyword/audio text into video_element rows, and rolls the video
// row back if the elements fail.
export const saveVideo = async ({ filename, caption, hashtags, keywords, audioTitle }) => {
  const data = await request('/videos', {
    method: 'POST',
    body: { filename, caption, hashtags, keywords, audioTitle },
  });
  return data.video_id;
};

// A video's elements are removed server-side before the video row; further
// referenced rows (evaluations, matches) surface a 409 that callers display
// instead of silently dropping the video.
export const deleteVideo = async (videoId) => {
  await request(`/videos/${videoId}`, { method: 'DELETE' });
};

// "Clear All": the server deletes every video the user owns and reports
// partial failures honestly; we surface them instead of pretending success.
export const deleteUserVideos = async () => {
  const data = await request('/videos', { method: 'DELETE' });
  if (data.failed?.length > 0) {
    throw new ApiError(
      `Cleared ${data.deleted} video(s), but ${data.failed.length} could not be deleted: ${data.failed[0].error}`
    );
  }
  return data.deleted;
};
