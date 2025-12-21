// src/pages/sermons/SermonPlayerPage.jsx
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSermons } from '@hooks/sermon';

/**
 * Minimal player page showing only the video player.
 * If navigation state includes the sermon object, it uses that.
 * Otherwise it fetches the sermon by ID and uses its embed_url.[file:4]
 */
function SermonPlayerPage() {
  const { sermonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const passedSermon = location.state?.sermon || null;
  const { useSermonById, markSermonViewed } = useSermons();
  const {
    data: fetchedSermon,
    isLoading,
    error,
  } = useSermonById(sermonId, !passedSermon);

  const sermon = passedSermon || fetchedSermon;

  useEffect(() => {
    if (sermonId) {
      markSermonViewed(sermonId);
    }
  }, [sermonId, markSermonViewed]);

  if (isLoading && !sermon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white text-sm">Loading sermon...</p>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white space-y-4">
        <p className="text-sm">Unable to load sermon.</p>
        <button
          className="px-3 py-2 text-sm rounded-md bg-gray-700 hover:bg-gray-600"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-5xl aspect-video">
        <iframe
          src={sermon.embed_url}
          title={sermon.title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
}

export default SermonPlayerPage;
