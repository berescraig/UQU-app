// server.js - Express backend for UQU Assistant
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load UQU data
const UQU_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'uqu_demo_data.json'), 'utf8'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'UQU Assistant API',
    version: '1.0.0',
    endpoints: [
      'GET /api/areas',
      'GET /api/areas/:areaId',
      'GET /api/clubs',
      'GET /api/clubs/:category',
      'GET /api/outlets',
      'GET /api/collectives',
      'GET /api/programs',
      'POST /api/search',
      'POST /api/chat'
    ]
  });
});

// Get all areas
app.get('/api/areas', (req, res) => {
  res.json(UQU_DATA.uqu_areas);
});

// Get specific area
app.get('/api/areas/:areaId', (req, res) => {
  const area = UQU_DATA.uqu_areas[req.params.areaId];
  if (area) {
    res.json(area);
  } else {
    res.status(404).json({ error: 'Area not found' });
  }
});

// Get all clubs
app.get('/api/clubs', (req, res) => {
  const clubsData = UQU_DATA.uqu_areas['3_clubs_societies'];
  res.json(clubsData);
});

// Get clubs by category
app.get('/api/clubs/:category', (req, res) => {
  const clubsData = UQU_DATA.uqu_areas['3_clubs_societies'];
  const category = clubsData.categories[req.params.category];
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// Get outlets
app.get('/api/outlets', (req, res) => {
  const outletsData = UQU_DATA.uqu_areas['4_outlets'];
  res.json(outletsData);
});

// Get collectives
app.get('/api/collectives', (req, res) => {
  const collectivesData = UQU_DATA.uqu_areas['5_collectives'];
  res.json(collectivesData);
});

// Get special programs
app.get('/api/programs', (req, res) => {
  res.json(UQU_DATA.special_programs);
});

// Search endpoint
app.post('/api/search', (req, res) => {
  const { query } = req.body;
  const results = [];
  const searchTerm = query.toLowerCase();

  // Search in clubs
  const clubsData = UQU_DATA.uqu_areas['3_clubs_societies'];
  Object.entries(clubsData.categories).forEach(([catKey, category]) => {
    category.clubs?.forEach(club => {
      if (club.name.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'club',
          category: category.name,
          name: club.name,
          id: club.id
        });
      }
    });
  });

  // Search in outlets
  const outletsData = UQU_DATA.uqu_areas['4_outlets'];
  outletsData.food_retail.forEach(outlet => {
    if (outlet.name.toLowerCase().includes(searchTerm)) {
      results.push({
        type: 'outlet',
        name: outlet.name,
        campus: outlet.campus,
        mates_rates: outlet.mates_rates
      });
    }
  });

  // Search in collectives
  const collectivesData = UQU_DATA.uqu_areas['5_collectives'];
  collectivesData.list.forEach(collective => {
    if (collective.name.toLowerCase().includes(searchTerm) || 
        collective.description.toLowerCase().includes(searchTerm)) {
      results.push({
        type: 'collective',
        name: collective.name,
        description: collective.description
      });
    }
  });

  res.json({ results, query });
});

// Chat endpoint for n8n integration
app.post('/api/chat', (req, res) => {
  const { message, context } = req.body;
  
  // This endpoint can be called by n8n after processing with DeepSeek
  // It provides structured data based on the user's query
  
  const response = {
    message: message,
    data: null,
    suggestions: []
  };

  const lowerMessage = message.toLowerCase();

  // Determine intent and provide relevant data
  if (lowerMessage.includes('club') || lowerMessage.includes('society')) {
    response.data = {
      type: 'clubs',
      content: UQU_DATA.uqu_areas['3_clubs_societies']
    };
    response.suggestions = ['Browse by category', 'Search for specific interests', 'View all clubs'];
  } else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('hungry')) {
    response.data = {
      type: 'food',
      content: {
        outlets: UQU_DATA.uqu_areas['4_outlets'],
        programs: {
          morning_marmalade: UQU_DATA.special_programs.morning_marmalade,
          campus_kitchen: UQU_DATA.special_programs.campus_kitchen
        }
      }
    };
    response.suggestions = ['View all outlets', 'Free meal times', 'Mates Rates locations'];
  } else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    response.data = {
      type: 'support',
      content: UQU_DATA.uqu_areas['2_sas']
    };
    response.suggestions = ['Book appointment', 'View services', 'Emergency contacts'];
  } else if (lowerMessage.includes('volunteer')) {
    response.data = {
      type: 'volunteer',
      content: UQU_DATA.uqu_areas['6_volunteers']
    };
    response.suggestions = ['Sign up', 'View opportunities', 'Benefits'];
  }

  res.json(response);
});

// Webhook endpoint for n8n
app.post('/webhook/n8n', (req, res) => {
  // This endpoint can receive data from n8n workflows
  console.log('Received webhook from n8n:', req.body);
  
  // Process the webhook data and return appropriate response
  const { action, data } = req.body;
  
  switch (action) {
    case 'get_clubs':
      res.json(UQU_DATA.uqu_areas['3_clubs_societies']);
      break;
    case 'get_support':
      res.json(UQU_DATA.uqu_areas['2_sas']);
      break;
    case 'get_food':
      res.json({
        outlets: UQU_DATA.uqu_areas['4_outlets'],
        free_meals: {
          breakfast: UQU_DATA.special_programs.morning_marmalade,
          dinner: UQU_DATA.special_programs.campus_kitchen
        }
      });
      break;
    default:
      res.json({ message: 'Unknown action', available_actions: ['get_clubs', 'get_support', 'get_food'] });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`UQU Assistant API running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});

// Export for testing
module.exports = app;