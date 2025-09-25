import React, { useState, useEffect } from "react";
import API, { getUserData } from "../api";

export default function Recruiter() {
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skillsRequired: ""
  });

  // Fetch recruiter & jobs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileRes = await API.get("/recruiter/profile");
        setRecruiter(profileRes.data);

        const jobsRes = await API.get("/recruiter/jobs");
        setJobs(jobsRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load recruiter data. Make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewJob = async (e) => {
    e.preventDefault();
    try {
      await API.post("/recruiter/create-job", newJob);
      alert("Job created!");
      setNewJob({ title: "", description: "", location: "", salary: "", skillsRequired: "" });

      const jobsRes = await API.get("/recruiter/jobs");
      setJobs(jobsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create job");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {recruiter?.name}</h1>

      <h2 className="mt-6 text-xl font-semibold">Post a new Job</h2>
      <form onSubmit={handleNewJob} className="space-y-4 max-w-md">
        {["title", "description", "location", "salary", "skillsRequired"].map((field) => (
          <div key={field}>
            <label className="block capitalize">{field}</label>
            <input
              type="text"
              value={newJob[field]}
              onChange={(e) => setNewJob({ ...newJob, [field]: e.target.value })}
              className="border p-2 w-full"
              required={field !== "salary" && field !== "skillsRequired"}
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post Job</button>
      </form>

      <h2 className="mt-8 text-xl font-semibold">Your Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job._id} className="border p-2 rounded">
              <h3 className="font-bold">{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
