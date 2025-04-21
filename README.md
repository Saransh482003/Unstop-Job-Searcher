# 🔍 UnstopJobSearcher

A lightweight Python tool to search for jobs and internships on [Unstop.com](https://unstop.com) using their public API.

---

## 📦 Features

- Search for **jobs** or **internships** by title and location.
- Automatically scrapes **multiple pages** of results.
- Returns structured data including job title, company, salary, dates, and URLs.
- Requires only headers (cookie + user-agent) for requests.

---

## 🧰 Requirements

- Python 3.6+
- `requests` library

Install dependencies (if not already installed):

```bash
pip install requests
```

---

## 🚀 Usage

```python
from unstop_job_searcher import UnstopJobSearcher

headers = {
    "cookie": "your_cookie_here",
    "user-agent": "your_user_agent_here"
}

searcher = UnstopJobSearcher(headers)

results = searcher.search_jobs(title="data analyst", location="Remote", type="jobs")

for job in results:
    print(job)
```

> Note: You must pass valid headers (`cookie` and `user-agent`) from your browser session to make the API work.

---

## 🔧 Parameters

### `UnstopJobSearcher(headers: dict)`
- `headers`: Dictionary containing request headers (must include `"cookie"` and `"user-agent"`).

### `search_jobs(title: str, location: str, type: str = "jobs")`
- `title`: Title or keyword to search (e.g., `"data science"`).
- `location`: Location to filter by (e.g., `"Remote"`, `"Delhi"`).
- `type`: Either `"jobs"` or `"internships"`.

Returns: `list[dict]` — a list of job/internship dictionaries.

---

## 📤 Sample Output

```python
{
    'title': 'Data Analyst Intern',
    'company': 'XYZ Corp',
    'job_url': 'https://unstop.com/job/xyz',
    'company_url': 'https://unstop.com/company/xyz',
    'max_salary': 30000,
    'currecy': 'INR',
    'start_data': '2025-04-01',
    'end_date': '2025-04-30',
    'views': 2456,
    'registered': 112
}
```

---

## 👨‍💻 Author

Created by **Saransh Saini**  
[LinkedIn](https://www.linkedin.com/in/saranshsaini48)

---

## 📜 License

MIT License. Feel free to use, modify, and share.
