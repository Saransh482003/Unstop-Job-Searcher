# Unstop Job Search Portal 🚀

A modern, responsive web application that helps users search for jobs and internships from Unstop.com. Built with Next.js and FastAPI, this application provides a seamless experience for job seekers to find their next opportunity.

![Tech Stack](https://skillicons.dev/icons?i=next,react,python,fastapi)

## Features ✨

- **Real-time Job Search**: Search across thousands of job listings and internships
- **Smart Filtering**: Filter by job title, location, and type (jobs/internships)
- **Responsive Design**: Perfect experience across all devices - desktop, tablet, and mobile
- **Modern UI**: Clean and intuitive interface with dark mode support
- **Detailed Information**: 
  - Comprehensive job details including salary
  - Company information
  - Application deadlines
  - Real-time statistics (views and applications)
  - Quick apply links

## Tech Stack 💻

### Frontend
- **Framework**: Next.js 14
- **Styling**: CSS Modules
- **Font**: Geist Sans & Geist Mono
- **Icons**: Custom SVG icons
- **State Management**: React Hooks

### Backend
- **Framework**: FastAPI
- **Data Processing**: Pandas
- **HTTP Client**: Requests
- **Data Format**: JSON

## Getting Started 🌟

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Git

### Installation

1. Clone the repository
```powershell
git clone <your-repo-url>
cd automatic-job-searcher
```

2. Set up the backend
```powershell
cd backend
python -m venv env
.\env\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload
```

3. Set up the frontend
```powershell
cd frontend
npm install
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints 🔗

### GET /search-jobs/
Search for jobs and internships
- **Query Parameters**:
  - `title` (string): Job title to search for
  - `location` (string): Location of the job
  - `type` (string): Either "jobs" or "internships"
- **Response**: JSON object containing job listings and metadata

## Deployment 🚀

The application is structured to be easily deployed on Vercel:
- Frontend: Direct deployment through Vercel Platform
- Backend: Serverless deployment using Vercel Python Runtime

## Project Structure 📁

```
├── frontend/               # Next.js frontend application
│   ├── pages/             # Application pages
│   ├── public/            # Static assets
│   └── styles/            # CSS modules and global styles
│
└── backend/               # FastAPI backend server
    ├── app.py            # Main application file
    └── unstopjobsearcher.py  # Job search implementation
```

## Features in Detail 🔍

1. **Smart Search**
   - Intelligent job title parsing
   - Location-based filtering
   - Type-specific results (jobs/internships)

2. **Rich Job Information**
   - Salary information with proper formatting
   - Application timelines
   - Company details and links
   - Engagement metrics

3. **User Experience**
   - Loading states with animations
   - Error handling
   - Responsive design
   - Dark mode support

## About the Creator 👨‍💻

### Saransh Saini
Full Stack Developer & Data Scientist

Passionate about creating elegant solutions to complex problems. Specializing in web development and data science, I bring together the best of both worlds to create meaningful applications.

#### Connect with Me 🤝
- **Portfolio**: [thesaranshsaini.com](https://www.thesaranshsaini.com/)
- **LinkedIn**: [linkedin.com/in/saranshsaini48](https://www.linkedin.com/in/saranshsaini48/)
- **GitHub**: [github.com/Saransh482003](https://github.com/Saransh482003)

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](#).

## License 📝

This project is open source and available under the [MIT License](LICENSE).

---

Created with ❤️ by [Saransh Saini](https://www.thesaranshsaini.com)
