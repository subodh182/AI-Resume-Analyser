const axios = require('axios');

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

exports.fetchExternalJobs = async (query = '', location = '', page = 1) => {
  try {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      console.log('⚠️ Adzuna API keys not found');
      return { success: false, jobs: [], total: 0 };
    }

    const country = 'in';
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
    
    const params = {
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
      results_per_page: 20,
      what: query || '',
      where: location || ''
    };

    console.log('🔍 Fetching jobs from Adzuna...');
    const response = await axios.get(url, { params });
    
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
      url: job.redirect_url,
      postedDate: job.created,
      source: 'Adzuna',
      skills: []
    }));

    console.log(`✅ Fetched ${jobs.length} jobs`);
    return { success: true, jobs, total: response.data.count };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, jobs: [], total: 0 };
  }
};

exports.fetchAllJobs = async (query = '', location = '') => {
  const result = await this.fetchExternalJobs(query, location);
  return result.jobs;
};