import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Send, ChevronRight, MapPin, Calendar, Users, Coffee, Heart, HelpCircle, Newspaper, MessageCircle } from 'lucide-react';

// Import the demo data
const UQU_DATA = {
  "uqu_areas": {
    "1_student_executive": {
      "name": "Student Executive/OBs + Staff",
      "description": "Elected student representatives and UQU staff"
    },
    "2_sas": {
      "name": "Student Advocacy & Support (SAS)",
      "description": "Free, independent hub of support for students",
      "services": {
        "exam_support": {
          "url": "https://uqu.com.au/student-exam-support/",
          "title": "Don't stress with the SES!",
          "services": []
        },
        "advocacy_support": {
          "url": "https://uqu.com.au/student-advocacy-and-support/",
          "title": "University can be challenging: but you're not alone.",
          "services": []
        },
        "welfare_wellbeing": {
          "url": "https://uqu.com.au/welfare-wellbeing-resources/",
          "title": "Welfare & wellbeing resources",
          "services": []
        }
      },
      "bursaries": [
        "Financial hardship bursaries",
        "Placement bursaries",
        "Emergency support grants"
      ]
    },
    "3_clubs_societies": {
      "name": "Clubs & Societies",
      "total": "220+",
      "categories": {
        "faculty": {
          "name": "Faculty",
          "clubs": [
            { "name": "UQ Computing Society (UQCS)", "id": "uqcs" },
            { "name": "Engineering Undergraduate Society (EUS)", "id": "eus" },
            { "name": "UQ Business School Postgraduate Association", "id": "uqbspa" }
          ]
        },
        "hobby_special": {
          "name": "Hobby/Special Interest",
          "clubs": [
            { "name": "Cosy Gamers Club (UQCGC)", "id": "uqcgc" },
            { "name": "UQ Greens (UQG)", "id": "uqg" }
          ]
        },
        "international": {
          "name": "International",
          "clubs": [
            { "name": "Chinese Students and Scholars Association", "id": "cssa" },
            { "name": "UQ South Pacific Islander Association (UQSPIA)", "id": "uqspia" }
          ]
        },
        "performance": {
          "name": "Performance",
          "clubs": [
            { "name": "UQ K-pop Dance Club (UQKDC)", "id": "uqkdc" }
          ]
        },
        "religious": {
          "name": "Religious",
          "clubs": [
            { "name": "UQ Buddhist Society", "id": "buddhist" }
          ]
        }
      }
    },
    "4_outlets": {
      "name": "Outlets",
      "food_retail": [
        { "name": "Expresso", "campus": "St Lucia", "mates_rates": true },
        { "name": "On A Roll Bakery", "campus": "St Lucia", "mates_rates": true },
        { "name": "Pizza Caffe", "campus": "St Lucia", "mates_rates": true },
        { "name": "Main Course", "campus": "St Lucia", "mates_rates": true }
      ]
    },
    "5_collectives": {
      "name": "UQU Collectives",
      "list": [
        { "name": "UQU Queer Collective", "id": "queer", "description": "Safe space for LGBTQIA+ students" },
        { "name": "UQU Women's Collective", "id": "womens", "description": "Supporting and empowering women on campus" },
        { "name": "UQU Disability Collective", "id": "disability", "description": "Advocating for students with disabilities" }
      ]
    },
    "6_volunteers": {
      "name": "Volunteers",
      "info": {
        "description": "Great way to make friends with other student volunteers",
        "benefits": [
          "Opportunity to give back to your student community",
          "Help bring to life events and initiatives",
          "Make friends with other volunteers"
        ]
      }
    },
    "7_semper": {
      "name": "Semper Floreat",
      "description": "Student newspaper"
    }
  },
  "special_programs": {
    "mates_rates": {
      "name": "Mates Rates",
      "description": "Your student discount - 10% off at UQU outlets",
      "type": "Free membership"
    },
    "morning_marmalade": {
      "name": "Morning Marmalade",
      "description": "Free breakfast",
      "times": "Mon-Fri 10am-12pm"
    },
    "campus_kitchen": {
      "name": "Campus Kitchen",
      "description": "Free dinner",
      "times": "Mon-Fri 5pm-7pm"
    }
  }
};

// Icon mapping for areas
const areaIcons = {
  "1_student_executive": Users,
  "2_sas": Heart,
  "3_clubs_societies": Users,
  "4_outlets": Coffee,
  "5_collectives": MessageCircle,
  "6_volunteers": Heart,
  "7_semper": Newspaper
};

export default function UQUAssistant() {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', content: "G'day! I'm your UQU Assistant. Ask me anything about clubs, services, food outlets, or events at UQ!" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPosition = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    
    if (newPosition >= 20 && newPosition <= 80) {
      setDividerPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isDragging]);

  const handleAreaClick = (areaKey) => {
    setSelectedArea(areaKey);
    setSelectedCategory(null);
  };

  const handleBackClick = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      setSelectedArea(null);
    }
  };

  const processUserMessage = async (message) => {
    const lowerMessage = message.toLowerCase();
    let response = "";

    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = "G'day! How can I help you today? I can tell you about clubs, food outlets, student support services, or upcoming events.";
    }
    // Check for food/eat related queries
    else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('hungry')) {
      const outlets = UQU_DATA.uqu_areas["4_outlets"].food_retail.slice(0, 4);
      response = "Here are some great food options on campus:\n\n";
      outlets.forEach(outlet => {
        response += `• ${outlet.name} at ${outlet.campus}`;
        if (outlet.mates_rates) response += " (Mates Rates discount!)";
        response += "\n";
      });
      response += "\nPlus, don't forget about free breakfast (10am-12pm) and free dinner (5pm-7pm) Monday to Friday!";
    }
    // Check for club related queries
    else if (lowerMessage.includes('club') || lowerMessage.includes('society') || lowerMessage.includes('join')) {
      response = "UQU has over 220 clubs and societies! Here are some categories:\n\n";
      Object.entries(UQU_DATA.uqu_areas["3_clubs_societies"].categories).forEach(([key, category]) => {
        if (category.clubs && category.clubs.length > 0) {
          response += `• ${category.name}: ${category.clubs.map(c => c.name).join(', ')}\n`;
        }
      });
      response += "\nWould you like to know more about any specific type of club?";
    }
    // Check for support/help queries
    else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('stress')) {
      response = "UQU Student Advocacy & Support offers free, confidential help with:\n\n";
      response += "• Academic issues (appeals, misconduct, grievances)\n";
      response += "• Welfare & wellbeing support\n";
      response += "• Financial assistance (bursaries available)\n";
      response += "• Visa and legal matters\n";
      response += "• Job preparation\n\n";
      response += "You can book an appointment online. Remember, you're not alone!";
    }
    // Check for discount/cheap queries
    else if (lowerMessage.includes('discount') || lowerMessage.includes('cheap') || lowerMessage.includes('free')) {
      response = "Great news! Here are ways to save money at UQ:\n\n";
      response += "🎯 Mates Rates: FREE membership gives you 10% off at UQU outlets\n";
      response += "🍳 Free breakfast: Mon-Fri 10am-12pm\n";
      response += "🍝 Free dinner: Mon-Fri 5pm-7pm\n";
      response += "🛒 Food Co-op: Low-cost groceries\n";
      response += "💰 Bursaries available for financial hardship\n";
    }
    else {
      response = "I can help you with:\n• Finding clubs and societies\n• Food outlets and free meals\n• Student support services\n• Events and activities\n• Volunteer opportunities\n\nWhat would you like to know more about?";
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(async () => {
      const response = await processUserMessage(userMessage);
      setMessages(prev => [...prev, { type: 'bot', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  const renderUpperPanel = () => {
    if (selectedArea) {
      const area = UQU_DATA.uqu_areas[selectedArea];
      
      if (selectedArea === "3_clubs_societies" && selectedCategory) {
        const category = area.categories[selectedCategory];
        return (
          <div className="p-6">
            <button 
              onClick={handleBackClick}
              className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
            >
              <ChevronRight className="w-4 h-4 transform rotate-180 mr-1" />
              Back to {area.name}
            </button>
            <h2 className="text-2xl font-bold mb-4">{category.name} Clubs</h2>
            <div className="space-y-3">
              {category.clubs.map((club, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                  <h3 className="font-semibold">{club.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div className="p-6">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ChevronRight className="w-4 h-4 transform rotate-180 mr-1" />
            Back to Home
          </button>
          <h2 className="text-2xl font-bold mb-4">{area.name}</h2>
          <p className="text-gray-600 mb-6">{area.description}</p>
          
          {selectedArea === "2_sas" && (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Services Available:</h3>
                {Object.entries(area.services).map(([key, service]) => (
                  <div key={key} className="mb-2">
                    <p className="font-medium">{service.title}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Bursaries:</h3>
                {area.bursaries.map((bursary, index) => (
                  <p key={index}>• {bursary}</p>
                ))}
              </div>
            </div>
          )}
          
          {selectedArea === "3_clubs_societies" && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(area.categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
                >
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-600">
                    {category.clubs ? `${category.clubs.length} clubs` : 'View clubs'}
                  </p>
                </button>
              ))}
            </div>
          )}
          
          {selectedArea === "4_outlets" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {area.food_retail.slice(0, 4).map((outlet, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-semibold">{outlet.name}</h3>
                  <p className="text-sm text-gray-600">{outlet.campus} Campus</p>
                  {outlet.mates_rates && (
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      Mates Rates
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {selectedArea === "5_collectives" && (
            <div className="space-y-3">
              {area.list.map((collective, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow">
                  <h3 className="font-semibold">{collective.name}</h3>
                  <p className="text-sm text-gray-600">{collective.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">UQU Services</h1>
          <p className="text-gray-600">Navigate through UQU's services and resources</p>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services, clubs, or events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(UQU_DATA.uqu_areas).map(([key, area]) => {
            const Icon = areaIcons[key] || HelpCircle;
            return (
              <button
                key={key}
                onClick={() => handleAreaClick(key)}
                className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
              >
                <Icon className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-sm">{area.name}</h3>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-pink-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Quick Access</h3>
          <div className="space-y-2 text-sm">
            <p>🍳 Free Breakfast: Mon-Fri 10am-12pm</p>
            <p>🍝 Free Dinner: Mon-Fri 5pm-7pm</p>
            <p>💳 Mates Rates: 10% off at UQU outlets</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-gray-50 relative overflow-hidden">
      {/* Upper Panel */}
      <div 
        style={{ height: `${dividerPosition}%` }} 
        className="bg-gray-50 overflow-y-auto"
      >
        {renderUpperPanel()}
      </div>

      {/* Draggable Divider */}
      <div 
        className="h-3 bg-gray-300 cursor-ns-resize hover:bg-gray-400 transition-colors relative flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="w-12 h-1 bg-gray-500 rounded-full" />
      </div>

      {/* Lower Panel - Chat Interface */}
      <div 
        style={{ height: `${100 - dividerPosition}%` }} 
        className="bg-white flex flex-col"
      >
        <div className="bg-purple-600 text-white p-4">
          <h2 className="text-lg font-semibold">UQU AI Assistant</h2>
          <p className="text-sm opacity-90">Ask me anything about UQU!</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}