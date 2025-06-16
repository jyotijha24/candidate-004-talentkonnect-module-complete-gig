import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CompleteGig() {
  const [gigs, setGigs] = useState([]);
  const [acceptedGig, setAcceptedGig] = useState(null);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);

  // Fetch gigs
  useEffect(() => {
    axios
      .get('/api/gigs?status=open')
      .then((res) => {
        const data = res.data;
        let gigsArray = [];

        // If it's an object (Firebase style), convert it to array
        if (!Array.isArray(data)) {
          gigsArray = Object.entries(data || {}).map(([id, val]) => ({
            id,
            ...val,
          }));
        } else {
          gigsArray = data;
        }

        setGigs(gigsArray);
      })
      .catch(() => toast.error('Failed to load gigs'));
  }, []);

  // Accept a gig
  const handleAccept = async (gig) => {
    try {
      await axios.post(`/api/gigs/${gig.id}/accept`);
      setAcceptedGig(gig);
      toast.success('Gig accepted!');
    } catch {
      toast.error('Failed to accept gig');
    }
  };

  // Submit completed gig
  const handleComplete = async (e) => {
    e.preventDefault();

    if (!file) return toast.error('Please upload a file');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('comment', comment);

      await axios.post(`/api/gigs/${acceptedGig.id}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await axios.post('/api/credits');
      toast.success('Gig completed! +1 Credit');

      setTimeout(() => {
        window.location.href = '/wallet'; // redirect
      }, 2000);
    } catch {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <ToastContainer position="top-right" autoClose={2000} />
      <h1 className="text-2xl font-bold text-[#1D3557] mb-4">
        Micro-Task Matching & Completion
      </h1>

      {!acceptedGig ? (
        gigs.length > 0 ? (
          <div className="space-y-4">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-white p-4 rounded shadow border border-gray-200"
              >
                <h2 className="font-semibold text-lg">{gig.title}</h2>
                <p className="text-sm text-gray-700 mb-2">
                  {gig.description?.slice(0, 100)}...
                </p>
                <p className="text-sm mb-2 text-[#1D3557] font-semibold">
                  Bounty: ${gig.bounty}
                </p>
                <button
                  className="px-4 py-2 rounded bg-[#E76F51] text-white hover:bg-[#d45b3e]"
                  onClick={() => handleAccept(gig)}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No open gigs available.</p>
        )
      ) : (
        <form
          onSubmit={handleComplete}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <h2 className="text-xl font-semibold mb-2 text-[#1D3557]">
            Completing: {acceptedGig.title}
          </h2>

          <div>
            <label className="block mb-1">Upload Proof (image/video/doc)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block mb-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-[#E76F51] text-white px-4 py-2 rounded hover:bg-[#d45b3e]"
          >
            Submit Gig
          </button>
        </form>
      )}
    </div>
  );
}

export default CompleteGig;
