const axios = require('axios');

// Adzuna API credentials (.env se aayenge)
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

// Fetch jobs from Adzuna API
exports.fetchExternalJobs = async (query = '', location = '', page = 1) => {
  try {
    // Check if API keys exist
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      console.log('⚠️ Adzuna API keys not found in .env file');
      return {
        success: false,
        jobs: [],
        total: 0
      };
    }

    const country = 'in'; // India
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
    
    const params = {
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
      results_per_page: 20,
      what: query || '', // Job title/keywords
      where: location || '' // Location
    };

    console.log('🔍 Fetching jobs from Adzuna...');
    const response = await axios.get(url, { params });
    
    // Transform data to match our format
    const jobs = response.data.results.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      salary: {
        min: job.salary_min || null,
        max: job.salary_max || null,
        currency: 'GBP'
      },
      type: job.contract_time || 'Full-time',
      url: job.redirect_url, // Apply URL
      postedDate: job.created,
      source: 'Adzuna',
      skills: [] // External jobs don't have skill tags
    }));

    console.log(`✅ Fetched ${jobs.length} jobs from Adzuna`);

    return {
      success: true,
      jobs,
      total: response.data.count
    };
  } catch (error) {
    console.error('❌ Error fetching external jobs:', error.message);
    return {
      success: false,
      jobs: [],
      total: 0
    };
  }
};

// Main function to fetch all jobs
exports.fetchAllJobs = async (query = '', location = '') => {
  const result = await this.fetchExternalJobs(query, location);
  return result.jobs;
};