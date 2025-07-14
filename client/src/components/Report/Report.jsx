import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createReport, getReports, verifyImage } from "../../api/api";

export const Report = ({ selectedDisaster }) => {
  const [reports, setReports] = useState([]);

  return (
    <div className="py-2 m-5">
      <ReportForm disaster={selectedDisaster} setReports={setReports} />
      <ReportList
        disasterId={selectedDisaster?.id}
        reports={reports}
        setReports={setReports}
      />
    </div>
  );
};

export const ReportForm = ({ disaster, setReports }) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Verify the image if imageUrl exists

      setLoading(true);
      let res = null;
      if (imageUrl.trim() !== "") {
        res = await verifyImage(imageUrl, disaster);
      }

      // 2. Create the report
      if (res != null) {
        const newReport = await createReport(
          disaster.id,
          content,
          imageUrl,
          currentUser,
          res.verified === true ? "verified" : "manupilated"
        );

        setReports((report) => {
          return [newReport?.report, ...report];
        });
      }

      // 3. Reset form
      setContent("");
      setImageUrl("");
    } catch (err) {
      alert("Failed to submit report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!disaster) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-lg font-semibold mb-2">Submit Report</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Report content..."
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (optional)"
        className="w-full p-2 border rounded mb-2"
      />
      <button
        type="submit"
        className={`flex items-center justify-center gap-2 py-2 px-4 rounded text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={loading}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
};

export const ReportList = ({ disasterId, reports, setReports }) => {
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const data = await getReports(disasterId);
    setLoading(false);
    if (data) {
      setReports(data);
    }
  };

  useEffect(() => {
    if (disasterId) {
      fetchReports();
    }
  }, [disasterId]);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Submitted Reports</h3>
      {reports?.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        <ul>
          {reports?.map((report) => (
            <li key={report.id} className="mb-2 p-2 border rounded bg-white">
              <p>
                <strong>User:</strong> {report.user_id}
              </p>
              <p>{report.content}</p>
              {report.image_url && (
                <img
                  src={report.image_url}
                  alt="Disaster"
                  className="w-48 mt-2"
                />
              )}
              <p className={` text-sm text-gray-600`}>
                Status:{" "}
                <span
                  className={`${
                    report.verification_status === "verified"
                      ? "text-green-700"
                      : ""
                  }`}
                >
                  {report.verification_status || "pending"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
