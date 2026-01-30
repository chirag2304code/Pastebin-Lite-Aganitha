import React, { useState } from 'react';

const CreatePaste = () => {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [shareableUrl, setShareableUrl] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setShareableUrl('');

    try {
      const response = await fetch('http://https://pastebin-lite-backend-ecvs.onrender.com/api/pastes', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          ttl_seconds: ttlSeconds === '' ? undefined : parseInt(ttlSeconds, 10),
          max_views: maxViews === '' ? undefined : parseInt(maxViews, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create paste');
      }

      setShareableUrl(data.url);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create New Paste</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your paste content here"
          rows="10"
          cols="80"
          required
        ></textarea>
        <label>
          TTL (seconds, optional):
          <input
            type="number"
            value={ttlSeconds}
            onChange={(e) => setTtlSeconds(e.target.value)}
            min="1"
            style={{ marginLeft: '10px' }}
          />
        </label>
        <label>
          Max Views (optional):
          <input
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            min="1"
            style={{ marginLeft: '10px' }}
          />
        </label>
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Create Paste</button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {shareableUrl && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <p>Shareable URL:</p>
          <a href={shareableUrl} target="_blank" rel="noopener noreferrer">{shareableUrl}</a>
        </div>
      )}
    </div>
  );
 // return(<h1>IT WORKS</h1>);
};

export default CreatePaste;
