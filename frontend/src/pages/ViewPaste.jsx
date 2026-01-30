import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ViewPaste = () => {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await fetch(`https://pastebin-lite-backend-ecvs.onrender.com/api/pastes/${id}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setError(data.message || 'Paste not found, expired, or view limit exceeded.');
          } else {
            throw new Error(data.message || 'Failed to fetch paste');
          }
        } else {
          setPaste(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPaste();
  }, [id]);

  if (loading) return <div style={{ padding: '20px' }}>Loading paste...</div>;
  
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  if (!paste) return <div style={{ padding: '20px' }}>Paste not found.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>View Paste</h1>
      <p><strong>Paste ID:</strong> {id}</p>
      <h2>Content:</h2>
      <pre style={{ border: '1px solid #ccc', padding: '10px', backgroundColor: '#f9f9f9' }}>{paste.content}</pre>
      {paste.expires_at && <p><strong>Expires At:</strong> {new Date(paste.expires_at).toLocaleString()}</p>}
      {paste.remaining_views !== null && <p><strong>Remaining Views:</strong> {paste.remaining_views}</p>}
    </div>
  );
};

export default ViewPaste;
