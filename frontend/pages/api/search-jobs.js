import axios from 'axios';

// Get the API cookie from environment variable
// const UNSTOP_COOKIE = process.env.UNSTOP_COOKIE;

const headers = {
  "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiMjgxZThhOGNhYzk1M2Q5YTk1ZmVhNWZmZjAzYTIzMjBmZGJjNDY4MGExYWZlNjVjZWM2ODM4MTZjMmY5MmZjMGZkM2E5NmExNzlmODZjMmYiLCJpYXQiOjE3NDY5OTY4NTkuNzY2NTc2LCJuYmYiOjE3NDY5OTY4NTkuNzY2NTc5LCJleHAiOjE3NDk0MTYwNTkuNzUzOTE3LCJzdWIiOiI0NDUzOTA1Iiwic2NvcGVzIjpbXX0.ShKNHeS6sqJ2PkHpel8Y-Gicw5oZ5kNhhoZ2-p5nBAAcbOFzuXR9dgPHVnblh1tYaC96UkBKZnwLEf0uGWSTxmo1JM7XMZDfDTLX7GcHgnoe0RTsgFT5apFmMva_9JfjRXEo-jJsbGvijDf1ssxRbJnFZKLWMxDHZldeOVBdoY6s-LMToJ-92A7ReB69YfhJhNtfHHiyJJTTddbyiNrlIgtmQj08BsedNVk1CWEBFdZJv3WkGcfuOi-Z8Aosni52zTFvoF2Y5dgo0JXxchz3t_rPj3rL8-4FiBjym0dqh1IvshbGybItXtP21ZQVc6zJSNNfiEFk16KeIIpH_PbCW4Ckw1YR4L1zYpvYanpwOvjF2Mnru67Vsi_MOP_HZcwfg63_-3T8fDG_WGYIIR8F4yT3j6AQoeVBM_69kyWHGtx5rK2AONZkhRRfqUE5q2b0rna9H2C1EbtUo5YeXycsyfy9FempXKQYyDkBL9QU2RKYdS4Ujq22WBMuacZlsdyeqdAWQ44Hxb-wm4SOWUrNgwvAFZDvYjwlBxBK9wmXG3M5JUAzEas78BsbKi1c1Xf2iD0jy3xPcTPVJOreyzUQNc2KSbzmMNTZUiRo-dACcMRq8diY36Mx7muxjP4KM_yJzVy4opl9XMntDfHYSqfOFFkY2ktfGrKzrji-Oms2P8I",
  "cookie": 'unLang=en; g_state={"i_l":0}; allowedCookie=1; XSRF-TOKEN=vrFYMkJXiQhNtf495XOlOD7PRuSgn0u28JhU1VS1; laravel_session=rTXyRCYfYCGQgAzl3n0BH4vvWaPp5Tkey5NgscJy; country=IN; _gcl_au=1.1.414464913.1747124756; moe_uuid=089b1690-750b-45d8-b007-3416afaed8d0',
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }
  try {
    const { title, location, type = 'jobs', page: requestedPage = 1 } = req.query;
    const itemsPerPage = 50;

    if (!title || !location) {
      return res.status(400).json({ detail: 'Title and location are required' });
    }    if (!['jobs', 'internships'].includes(type.toLowerCase())) {
      return res.status(400).json({ detail: "Type must be either 'jobs' or 'internships'" });
    }

    // Make a single API request for the requested page
    const url = `https://unstop.com/api/public/opportunity/search-result?opportunity=${type}&page=${requestedPage}&per_page=${itemsPerPage}&searchTerm=${encodeURIComponent(title)}&oppstatus=recent&location=${encodeURIComponent(location)}&quickApply=true`;
    
    const response = await axios.get(url, { headers });
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch data from Unstop');
    }

    const jobs = response.data.data.data || [];
    const totalItems = response.data.data.total || 0;

    // Transform the jobs data
    const data = jobs.map(job => ({
      title: job.title,
      company: job.organisation.name,
      job_url: "https://unstop.com/" + job.public_url.replace(/\\/g, ''),
      company_url: "https://unstop.com/" + job.organisation.public_url.replace(/\\/g, ''),
      max_salary: job.jobDetail.max_salary,
      currecy: job.jobDetail.currency,
      start_data: job.start_date,
      end_date: job.end_date,
      views: job.viewsCount,
      registered: job.registerCount,
    })).filter(job => job); // Remove any null entries

    // Convert array to object with indices as keys
    const dataObject = data.reduce((acc, curr, index) => {
      acc[index] = curr;
      return acc;
    }, {});

    return res.status(200).json({      status: "success",
      data: dataObject,
      count: totalItems,
      currentPage: parseInt(requestedPage),
      totalPages: Math.ceil(totalItems / itemsPerPage),
      itemsPerPage
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      detail: `An error occurred: ${error.message}`
    });
  }
}
