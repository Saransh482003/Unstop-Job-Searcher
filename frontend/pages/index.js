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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 50,
    totalItems: 0
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedResults = () => {
    if (!sortConfig.key) return Object.values(results);
    
    return Object.values(results).sort((a, b) => {
      switch (sortConfig.key) {
        case 'title':
          return sortConfig.direction === 'ascending' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'salary':
          const salaryA = a.max_salary || 0;
          const salaryB = b.max_salary || 0;
          return sortConfig.direction === 'ascending' 
            ? salaryA - salaryB
            : salaryB - salaryA;
        case 'views':
          return sortConfig.direction === 'ascending' 
            ? a.views - b.views
            : b.views - a.views;
        case 'date':
          const dateA = new Date(a.start_data || 0);
          const dateB = new Date(b.start_data || 0);
          return sortConfig.direction === 'ascending' 
            ? dateA - dateB
            : dateB - dateA;
        default:
          return 0;
      }
    });
  };

  const handlePageChange = async (newPage) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        title: formData.title,
        location: formData.location,
        type: formData.type,
        page: newPage
      });

      const response = await fetch(`/api/search-jobs/?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch jobs");
      }

      setResults(data.data);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        itemsPerPage: data.itemsPerPage,
        totalItems: data.count
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        title: formData.title,
        location: formData.location,
        type: formData.type,
        page: 1
      });

      const response = await fetch(`/api/search-jobs/?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch jobs");
      }

      setResults(data.data);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        itemsPerPage: data.itemsPerPage,
        totalItems: data.count
      });
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

  const sortedResults = getSortedResults();

  return (
    <>
      <Head>
        <title>Unstop Job Search - Find Your Next Opportunity</title>
        <meta name="description" content="Search for jobs and internships" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/search-icon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>Unstop Job Search</h1>
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
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
                <div className={styles.loadingText}>Searching for opportunities...</div>
              </div>
            ) : sortedResults.length > 0 ? (
              <>
                <div className={styles.resultsHeader}>
                  <span className={styles.resultsCount}>
                    Found {sortedResults.length} opportunities
                  </span>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>                      <th onClick={() => handleSort('title')} className={styles.sortable}>
                        <div className={styles.headerContent}>
                          <span>Position & Company</span>                          <span className={styles.sortButtons}>
                            <span className={styles.sortIndicator}>
                              {sortConfig.key === 'title' && sortConfig.direction === 'descending' ? (
                                'Z↓A'
                              ) : (
                                'A↓Z'
                              )}
                            </span>
                          </span>
                        </div>
                      </th>
                      <th onClick={() => handleSort('salary')} className={styles.sortable}>
                        <div className={styles.headerContent}>
                          <span>Package</span>
                          <span className={styles.sortButtons}>
                            <span className={styles.sortIndicator}>
                              {sortConfig.key === 'salary' && sortConfig.direction === 'descending' ? (
                                '9↓1'
                              ) : (
                                '1↓9'
                              )}
                            </span>
                          </span>
                        </div>
                      </th>
                      <th onClick={() => handleSort('date')} className={styles.sortable}>
                        <div className={styles.headerContent}>
                          <span>Timeline</span>
                          <span className={styles.sortButtons}>
                            <span className={styles.sortIndicator}>
                              {sortConfig.key === 'date' && sortConfig.direction === 'descending' ? (
                                'New↓Old'
                              ) : (
                                'Old↓New'
                              )}
                            </span>
                          </span>
                        </div>
                      </th>
                      <th onClick={() => handleSort('views')} className={styles.sortable}>
                        <div className={styles.headerContent}>
                          <span>Statistics</span>
                          <span className={styles.sortButtons}>
                            <span className={styles.sortIndicator}>
                              {sortConfig.key === 'views' && sortConfig.direction === 'descending' ? (
                                '9↓1'
                              ) : (
                                '1↓9'
                              )}
                            </span>
                          </span>
                        </div>
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResults.map((job, index) => (
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
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loading}
                    className={styles.paginationButton}
                  >
                    Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages || loading}
                    className={styles.paginationButton}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : null}
          </div>

          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <div className={styles.creatorInfo}>
                <div className={styles.creatorName}>Saransh Saini</div>
                <div className={styles.creatorTitle}>Full Stack Developer & Data Scientist</div>
              </div>
              <div className={styles.socialLinks}>
                <a
                  href="https://www.thesaranshsaini.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <Image
                    src="/portfolio.svg"
                    width={20}
                    height={20}
                    style={{ filter: "invert(1)" }}
                    alt="Portfolio"
                  />
                  <span>Portfolio</span>
                </a>
                <a
                  href="tel:+918178703402"
                  className={styles.socialLink}
                >
                  <Image
                    src="/phone.svg"
                    width={20}
                    height={20}
                    style={{ filter: "invert(1)" }}
                    alt="Phone"
                  />
                  <span>Call Me</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/saranshsaini48/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <Image
                    src="/linkedin.svg"
                    width={20}
                    height={20}
                    style={{ filter: "invert(1)" }}
                    alt="LinkedIn"
                  />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/Saransh482003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  <Image
                    src="/github.svg"
                    width={20}
                    height={20}
                    style={{ filter: "invert(1)" }}
                    alt="GitHub"
                  />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
