// Runtime configuration - loaded from public folder
// This allows dynamic API URL without rebuilding
window.API_CONFIG = {
  getApiUrl: function() {
    // Check if running on production domain or localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
    // All other domains (production) use Render API
    return 'https://be-creativity-api.onrender.com/api';
  }
};
