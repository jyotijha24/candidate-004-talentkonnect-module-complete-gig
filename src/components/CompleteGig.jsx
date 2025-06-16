import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CompleteGig() {
  const [gigs, setGigs] = useState([]);
  const [acceptedGig, setAcceptedGig] = useState(null);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);

  // Simulate fetching gigs (replace backend call with demo data)
  useEffect(() => {
    const demoGigs = [
      {
        id: 'gig1',
        title: 'Design a logo',
        description: 'Create a simple logo for a local startup',
        bounty: '1',
      },
      {
        id: 'gig2',
        title: 'Write a blog post',
        description: 'Write a 150-word blog post on AI in education',
        bounty: '1',
      },
    ];
    setGigs(demoGigs);
  }, []);

  const handleAccept = (gig) => {
    setAcceptedGig(gig);
    toast.success('Gig accepted!');
  };

  const handleComplete = (e) => {
    e.preventDefault();

    if (!file) return toast.error('Please upload a file');

    toast.success('Gig completed! +1 Credit');

    setTimeout(() => {
      window.location.href = '/wallet';
    }, 2000);
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
          <p className="text-gray-600">No open gigs available.</p>
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
