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
const UQU_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'uqu_unified_backend.json'), 'utf8'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'UQU Assistant API',
    version: '2.0.0',
    endpoints: [
      'GET /api/organization',
      'GET /api/collectives',
      'GET /api/collectives/:id',
      'GET /api/outlets',
      'GET /api/outlets/:type',
      'GET /api/support-services',
      'GET /api/support-services/:id',
      'GET /api/events',
      'GET /api/clubs',
      'GET /api/programs',
      'GET /api/programs/:id',
      'POST /api/search',
      'POST /api/chat'
    ]
  });
});

// Get organization info
app.get('/api/organization', (req, res) => {
  res.json(UQU_DATA.organization);
});

// Get all collectives
app.get('/api/collectives', (req, res) => {
  res.json(UQU_DATA.collectives);
});

// Get specific collective
app.get('/api/collectives/:id', (req, res) => {
  const collective = UQU_DATA.collectives.find(c => c.id === req.params.id);
  if (collective) {
    res.json(collective);
  } else {
    res.status(404).json({ error: 'Collective not found' });
  }
});

// Get all outlets
app.get('/api/outlets', (req, res) => {
  res.json(UQU_DATA.outlets);
});

// Get outlets by type
app.get('/api/outlets/:type', (req, res) => {
  const outletType = UQU_DATA.outlets[req.params.type];
  if (outletType) {
    res.json(outletType);
  } else {
    res.status(404).json({ error: 'Outlet type not found' });
  }
});

// Get all support services
app.get('/api/support-services', (req, res) => {
  res.json(UQU_DATA.support_services);
});

// Get specific support service
app.get('/api/support-services/:id', (req, res) => {
  const service = UQU_DATA.support_services[req.params.id];
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ error: 'Support service not found' });
  }
});

// Get events
app.get('/api/events', (req, res) => {
  res.json(UQU_DATA.events);
});

// Get all clubs
app.get('/api/clubs', (req, res) => {
  res.json(UQU_DATA.clubs);
});

// Get all programs
app.get('/api/programs', (req, res) => {
  res.json(UQU_DATA.programs);
});

// Get specific program
app.get('/api/programs/:id', (req, res) => {
  const program = UQU_DATA.programs[req.params.id];
  if (program) {
    res.json(program);
  } else {
    res.status(404).json({ error: 'Program not found' });
  }
});

// Search endpoint
app.post('/api/search', (req, res) => {
  const { query } = req.body;
  const results = [];
  const searchTerm = query.toLowerCase();

  // Search in collectives
  UQU_DATA.collectives.forEach(collective => {
    if (collective.name.toLowerCase().includes(searchTerm) || 
        collective.description.toLowerCase().includes(searchTerm) ||
        collective.target_group.toLowerCase().includes(searchTerm)) {
      results.push({
        type: 'collective',
        category: collective.category,
        name: collective.name,
        id: collective.id,
        description: collective.description
      });
    }
  });

  // Search in outlets (all types)
  Object.entries(UQU_DATA.outlets).forEach(([outletType, outlets]) => {
    if (Array.isArray(outlets)) {
      outlets.forEach(outlet => {
        if (outlet.name.toLowerCase().includes(searchTerm) || 
            outlet.description.toLowerCase().includes(searchTerm) ||
            outlet.category.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'outlet',
            category: outletType,
            name: outlet.name,
            id: outlet.id,
            description: outlet.description,
            mates_rates: outlet.mates_rates
          });
        }
      });
    }
  });

  // Search in support services
  Object.entries(UQU_DATA.support_services).forEach(([serviceId, service]) => {
    if (service.name.toLowerCase().includes(searchTerm) || 
        service.description.toLowerCase().includes(searchTerm)) {
      results.push({
        type: 'support_service',
        name: service.name,
        id: serviceId,
        description: service.description
      });
    }
  });

  // Search in clubs
  UQU_DATA.clubs.forEach(club => {
    if (club.name.toLowerCase().includes(searchTerm) || 
        club.description.toLowerCase().includes(searchTerm) ||
        club.interests.some(interest => interest.toLowerCase().includes(searchTerm))) {
      results.push({
        type: 'club',
        category: club.category,
        name: club.name,
        id: club.id,
        description: club.description
      });
    }
  });

  // Search in programs
  Object.entries(UQU_DATA.programs).forEach(([programId, program]) => {
    if (program.name.toLowerCase().includes(searchTerm) || 
        program.description.toLowerCase().includes(searchTerm) ||
        program.tagline?.toLowerCase().includes(searchTerm)) {
      results.push({
        type: 'program',
        name: program.name,
        id: programId,
        description: program.description
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
      content: UQU_DATA.clubs,
      total: '220+ clubs available'
    };
    response.suggestions = ['Browse by category', 'Search for specific interests', 'View meeting times'];
  } else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('hungry') || lowerMessage.includes('free meal')) {
    response.data = {
      type: 'food',
      content: {
        outlets: UQU_DATA.outlets,
        free_meals: {
          morning_marmalade: UQU_DATA.support_services.food_support.campus_services.st_lucia.services.morning_marmalade,
          kampus_kitchen: UQU_DATA.support_services.food_support.campus_services.st_lucia.services.kampus_kitchen,
          food_coop: UQU_DATA.support_services.food_support.campus_services.st_lucia.services.food_co_op
        }
      }
    };
    response.suggestions = ['View all outlets', 'Free meal times', 'Mates Rates locations'];
  } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('sas')) {
    response.data = {
      type: 'support',
      content: UQU_DATA.support_services.student_advocacy_support
    };
    response.suggestions = ['Book appointment', 'View services', 'Emergency contacts', 'Bursaries available'];
  } else if (lowerMessage.includes('collective') || lowerMessage.includes('lgbtq') || lowerMessage.includes('queer') || lowerMessage.includes('women') || lowerMessage.includes('disability')) {
    response.data = {
      type: 'collectives',
      content: UQU_DATA.collectives
    };
    response.suggestions = ['View all collectives', 'Find your community', 'Room locations'];
  } else if (lowerMessage.includes('volunteer')) {
    response.data = {
      type: 'volunteer',
      content: UQU_DATA.programs.volunteers
    };
    response.suggestions = ['Sign up', 'View opportunities', 'Rewards program'];
  } else if (lowerMessage.includes('discount') || lowerMessage.includes('mates rates')) {
    response.data = {
      type: 'mates_rates',
      content: UQU_DATA.programs.mates_rates
    };
    response.suggestions = ['Sign up for free', 'View participating outlets', '10% discount info'];
  } else if (lowerMessage.includes('exam') || lowerMessage.includes('stress')) {
    response.data = {
      type: 'exam_support',
      content: UQU_DATA.support_services.student_exam_support
    };
    response.suggestions = ['Exam support services', 'Freak-out phone', 'Free food during exams'];
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
      res.json({
        clubs: UQU_DATA.clubs,
        total: '220+ clubs and societies'
      });
      break;
    case 'get_support':
      res.json(UQU_DATA.support_services);
      break;
    case 'get_food':
      res.json({
        outlets: UQU_DATA.outlets,
        free_meals: {
          morning_marmalade: UQU_DATA.support_services.food_support.campus_services.st_lucia.services.morning_marmalade,
          kampus_kitchen: UQU_DATA.support_services.food_support.campus_services.st_lucia.services.kampus_kitchen,
          food_coop: UQU_DATA.support_services.food_support.campus_services.st_lucia.services.food_co_op
        }
      });
      break;
    case 'get_collectives':
      res.json(UQU_DATA.collectives);
      break;
    case 'get_programs':
      res.json(UQU_DATA.programs);
      break;
    case 'get_events':
      res.json(UQU_DATA.events);
      break;
    default:
      res.json({ 
        message: 'Unknown action', 
        available_actions: [
          'get_clubs', 
          'get_support', 
          'get_food', 
          'get_collectives', 
          'get_programs', 
          'get_events'
        ] 
      });
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