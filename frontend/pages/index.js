import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function formatDate(dateString) {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatSalary(salary, currency) {
  if (!salary) return "Not specified";
  const formattedSalary = new Intl.NumberFormat('en-IN').format(salary);
  return currency === 'fa-rupee' ? `₹${formattedSalary}` : formattedSalary;
}

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "jobs",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        title: formData.title,
        location: formData.location,
        type: formData.type,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/search-jobs/?${queryParams}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch jobs");
      }

      // Convert the object of objects to an array
      const jobsArray = Object.values(data.data);
      setResults(jobsArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Head>
        <title>Job Search - Find Your Next Opportunity</title>
        <meta name="description" content="Search for jobs and internships" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>Job Search</h1>
            <p className={styles.subtitle}>
              Find your next opportunity - Browse through thousands of jobs and internships
            </p>
          </header>

          <form onSubmit={handleSubmit} className={styles.searchForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="title">Job Title</label>
              <input
                id="title"
                name="title"
                type="text"
                className={styles.input}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Software Engineer"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                className={styles.input}
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Delhi"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                className={styles.input}
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="jobs">Jobs</option>
                <option value="internships">Internships</option>
              </select>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Searching..." : "Search Jobs"}
            </button>
          </form>

          <div className={styles.resultsContainer}>
            {error && <div className={styles.error}>{error}</div>}
            
            {loading ? (
              <div className={styles.loading}>Loading results...</div>
            ) : results.length > 0 ? (
              <>
                <div className={styles.resultsHeader}>
                  <span className={styles.resultsCount}>
                    Found {results.length} opportunities
                  </span>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Position & Company</th>
                      <th>Package</th>
                      <th>Timeline</th>
                      <th>Statistics</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((job, index) => (
                      <tr key={index}>
                        <td>
                          <a href={job.job_url} target="_blank" rel="noopener noreferrer" className={styles.jobTitle}>
                            {job.title}
                          </a>
                          <div style={{ marginTop: '0.5rem' }}>
                            <a href={job.company_url} target="_blank" rel="noopener noreferrer" className={styles.companyName}>
                              {job.company}
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className={styles.salary}>
                            {formatSalary(job.max_salary, job.currecy)}
                          </div>
                        </td>
                        <td>
                          <div className={styles.dateInfo}>
                            <div>
                              <span className={styles.dateLabel}>Start: </span>
                              {formatDate(job.start_data)}
                            </div>
                            <div>
                              <span className={styles.dateLabel}>End: </span>
                              {formatDate(job.end_date)}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.statsGroup}>
                            <div className={styles.stat}>
                              <Image
                                src="/views.svg"
                                width={16}
                                height={16}
                                style={{ filter: "invert(1)" }}
                                alt="Views"
                              />
                              <span>{job.views}</span>
                            </div>
                            <div className={styles.stat}>
                              <Image
                                src="/registered.svg"
                                width={16}
                                height={16}
                                style={{ filter: "invert(1)" }}
                                alt="Registered"
                              />
                              <span>{job.registered}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.applyButton}
                          >
                            Apply Now →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
