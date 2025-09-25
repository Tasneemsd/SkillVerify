import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://skillverify.onrender.com/api";

const Recruiter = () => {
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skillsRequired: "",
  });

  const email = JSON.parse(localStorage.getItem("user") || "{}").email;

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile?email=${email}`);
      setRecruiter(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/jobs?email=${email}`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/create-job`, { email, ...newJob });
      setNewJob({ title: "", description: "", location: "", salary: "", skillsRequired: "" });
      fetchJobs();
      alert("Job posted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to post job");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {recruiter?.name}</h1>

      <h2>Your Jobs</h2>
      {jobs.length === 0 ? <p>No jobs posted</p> :
        jobs.map(job => (
          <div key={job._id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>{job.location}</p>
          </div>
        ))
      }

      <h2>Post New Job</h2>
      <form onSubmit={createJob}>
        <input
          type="text"
          placeholder="Title"
          value={newJob.title}
          onChange={e => setNewJob({ ...newJob, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newJob.description}
          onChange={e => setNewJob({ ...newJob, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={newJob.location}
          onChange={e => setNewJob({ ...newJob, location: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Salary"
          value={newJob.salary}
          onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={newJob.skillsRequired}
          onChange={e => setNewJob({ ...newJob, skillsRequired: e.target.value })}
        />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default Recruiter;
