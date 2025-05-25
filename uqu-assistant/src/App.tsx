import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Send, ChevronRight, MapPin, Calendar, Users, Coffee, Heart, HelpCircle, Newspaper, MessageCircle, Shield, Utensils, BookOpen, Briefcase, Globe, Music, Building, ShoppingBag, Phone, Mail, Facebook, Instagram, DollarSign, Clock, AlertCircle, ChevronLeft } from 'lucide-react';

// Icon mapping for main categories
const categoryIcons = {
  "support": Heart,
  "collectives": Users,
  "outlets": Coffee,
  "clubs": MessageCircle,
  "events": Calendar,
  "programs": Shield,
  "contact": Phone
};

// Icon mapping for specific services
const serviceIcons = {
  "sas": Shield,
  "food_co_op": Utensils,
  "ses": BookOpen,
  "welfare_resources": Heart,
  "academic": BookOpen,
  "legal": Shield,
  "visa": Globe,
  "job": Briefcase,
  "welfare": Heart
};

// Define types for the data structures
interface Message {
  type: 'user' | 'bot';
  content: string;
  suggestions?: string[];
}

interface Organization {
  name: string;
  abbreviation: string;
  tagline: string;
  mission: string;
  contact: {
    location: string;
    hours: string;
    website: string;
    social_media: {
      instagram: string;
      tiktok: string;
      facebook: string;
    };
  };
}

interface UQUData {
  organization: Organization;
  collectives: any[];
  outlets: {
    food_beverage: any[];
    services: any[];
    retail_markets: any[];
  };
  support_services: any;
  events: any;
  clubs: any[];
  programs: any;
  metadata: any;
}

export default function UQUAssistant() {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'bot', 
      content: "Hi! I'm your UQU Assistant. I can help you:\n• Find your next UQU affiliated event \n• Locate the right support services for you (SAS, bursaries, welfare) \n• Not miss out on food outlets, mates rates discounts and free meals\n• Research our clubs and societies\n• Find out more about UQU Collectives\n\nWhat would you like to know about?" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uquData, setUquData] = useState<UQUData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const dragStartPosition = useRef<number>(0);

  // Backend API configuration
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  // 👇 use your backend relay instead of hitting n8n directly
  const N8N_WEBHOOK = 'http://localhost:3001/api/chat-relay';



  // Fetch data from backend on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setDataLoading(true);
      setDataError(null);

      // Fetch organization data
      const orgResponse = await fetch(`${API_URL}/api/organization`);
      if (!orgResponse.ok) throw new Error('Failed to fetch organization data');
      const organization = await orgResponse.json();

      // Fetch all the data in parallel
      const [collectivesRes, outletsRes, supportRes, eventsRes, clubsRes, programsRes] = await Promise.all([
        fetch(`${API_URL}/api/collectives`),
        fetch(`${API_URL}/api/outlets`),
        fetch(`${API_URL}/api/support-services`),
        fetch(`${API_URL}/api/events`),
        fetch(`${API_URL}/api/clubs`),
        fetch(`${API_URL}/api/programs`)
      ]);

      if (!collectivesRes.ok || !outletsRes.ok || !supportRes.ok || !eventsRes.ok || !clubsRes.ok || !programsRes.ok) {
        throw new Error('Failed to fetch some data');
      }

      const [collectives, outlets, support_services, events, clubs, programs] = await Promise.all([
        collectivesRes.json(),
        outletsRes.json(),
        supportRes.json(),
        eventsRes.json(),
        clubsRes.json(),
        programsRes.json()
      ]);

      const metadata = {
        total_collectives: collectives.length,
        total_outlets: outlets.food_beverage?.length || 0,
        total_support_services: Object.keys(support_services).length,
        campuses: ["St Lucia", "Gatton", "Herston", "Dutton Park"]
      };

      setUquData({
        organization,
        collectives,
        outlets,
        support_services,
        events,
        clubs,
        programs,
        metadata
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setDataError('Failed to load data. Please check if the backend is running on port 3001.');
    } finally {
      setDataLoading(false);
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Touch event handlers for mobile dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartY.current = e.touches[0].clientY;
    dragStartPosition.current = dividerPosition;
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const touch = e.touches[0];
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPosition = ((touch.clientY - containerRect.top) / containerRect.height) * 100;
    
    if (newPosition >= 20 && newPosition <= 80) {
      setDividerPosition(newPosition);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse event handlers for desktop dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
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

  // Setup mouse event listeners
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

  // Category selection handlers
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSelectedItem(null);
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedCategory(null);
    }
  };

  // Search functionality
  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (response.ok) {
        const { results } = await response.json();
        // Handle search results - you can display them in a modal or filter the current view
        console.log('Search results:', results);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // n8n chat integration
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            selectedArea: selectedCategory,
            selectedItem: selectedItem?.name || null,
            searchQuery: searchQuery
          }
        })
      });

      if (!response.ok) {
        throw new Error(`n8n returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.response || "Sorry, I couldn't process that.",
        suggestions: data.suggestions || []
      }]);

      // Handle navigation based on context_type
      if (data.context_type) {
        switch (data.context_type.toLowerCase()) {
          case 'clubs':
            setSelectedCategory('Clubs & Societies');
            break;
          case 'food':
            setSelectedCategory('Food & Outlets');
            break;
          case 'support':
            setSelectedCategory('Support Services');
            break;
          case 'collectives':
            setSelectedCategory('UQU Collectives');
            break;
          case 'programs':
            setSelectedCategory('Programs');
            break;
          case 'events':
            setSelectedCategory('Events');
            break;
        }
      }

    } catch (error) {
      console.error('Error with n8n:', error);
      
      // Fallback message if n8n is not available
      const fallbackMessage = `I'm having trouble connecting to my AI service. Here's what I can tell you:

Make sure:
1. n8n is running: "n8n start" in terminal
2. The workflow is active (toggle in n8n interface)
3. The webhook path is set to "chat"

You can still browse all UQU services using the navigation above!`;

      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: fallbackMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Test n8n connection
  const testN8nConnection = async () => {
    try {
      const response = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'test connection', 
          context: {} 
        })
      });
      
      if (response.ok) {
        console.log('✅ n8n connection successful');
      } else {
        console.log('❌ n8n connection failed:', response.status);
      }
    } catch (error: any) {
      console.log('❌ n8n not reachable:', error.message);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      testN8nConnection();
    }
  }, []);

  // Render functions
  const renderUpperPanel = () => {
    if (dataLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading UQU services...</p>
          </div>
        </div>
      );
    }

    if (dataError || !uquData) {
      return (
        <div className="flex items-center justify-center h-full p-6">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{dataError || 'Failed to load data'}</p>
            <p className="text-sm text-gray-500 mb-4">Make sure the backend is running:</p>
            <pre className="bg-gray-100 p-3 rounded text-xs text-left">cd uqu-backend{'\n'}npm start</pre>
            <button 
              onClick={fetchInitialData}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    // Detail view for specific item
    if (selectedItem) {
      const itemName = selectedItem.name || "Details";
      
      return (
        <div className="p-6 bg-gray-50 h-full overflow-y-auto">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4 font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to {selectedCategory || "Categories"}
          </button>
          
          <h2 className="text-3xl font-bold mb-6 text-purple-700">{itemName}</h2>
          
          {/* Render details based on category */}
          {selectedCategory === 'Support Services' && selectedItem.description && (
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">{selectedItem.description}</p>
              
              {selectedItem.appointment_types && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-xl text-purple-600 mb-3">Services Available:</h3>
                  {Object.entries(selectedItem.appointment_types).map(([key, type]: [string, any]) => (
                    <div key={key} className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                      <h4 className="font-semibold capitalize text-lg text-purple-700 mb-2">{key.replace(/_/g, ' ')}</h4>
                      <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                      <ul className="text-sm space-y-2">
                        {type.services.map((service: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <ChevronRight className="w-4 h-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedItem.booking_system && (
                <div className="bg-purple-50 rounded-xl p-6 mt-6 border border-purple-200">
                  <p className="font-semibold text-purple-700 mb-2">Book an appointment:</p>
                  <a 
                    href={selectedItem.booking_system} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline hover:text-purple-800 break-all"
                  >
                    {selectedItem.booking_system}
                  </a>
                </div>
              )}
            </div>
          )}
          
          {selectedCategory === 'Food & Outlets' && selectedItem.description && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                {selectedItem.logo && <img src={selectedItem.logo} alt={selectedItem.name} className="w-20 h-20 rounded-md mb-4 object-contain mx-auto"/>}
                <p className="text-gray-700 mb-4 text-center">{selectedItem.description}</p>
                <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
                  <p><strong>Location:</strong> {selectedItem.location || 'N/A'}</p>
                  {selectedItem.established && <p><strong>Established:</strong> {selectedItem.established}</p>}
                  {selectedItem.mates_rates && (
                    <p className="text-purple-600 font-semibold">✅ Mates Rates discount available (10% off)</p>
                  )}
                  {selectedItem.operating_status === 'Closed for maintenance' && (
                    <p className="text-red-600 font-semibold">⚠️ Currently closed - reopening {selectedItem.reopening || 'soon'}</p>
                  )}
                  {selectedItem.operating_schedule && (
                    <p><strong>Hours:</strong> {selectedItem.operating_schedule.day} {selectedItem.operating_schedule.hours}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {selectedCategory === 'UQU Collectives' && selectedItem.description && (
            <div className="space-y-6">
              {selectedItem.logo && (
                <img src={selectedItem.logo} alt={selectedItem.name} className="w-32 h-32 object-contain mx-auto mb-4"/>
              )}
              <p className="text-gray-700 text-lg leading-relaxed">{selectedItem.description}</p>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="font-semibold mb-2 text-purple-700">Target Group:</h3>
                <p className="text-gray-600">{selectedItem.target_group}</p>
              </div>
              {selectedItem.facilities && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-700">Location & Hours:</h3>
                  <p className="text-gray-600"><strong>Location:</strong> {selectedItem.facilities.location}</p>
                  {selectedItem.facilities.hours && <p className="text-gray-600"><strong>Hours:</strong> {selectedItem.facilities.hours}</p>}
                </div>
              )}
              {selectedItem.contact && selectedItem.contact.email && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-semibold mb-2 text-green-700">Contact:</h3>
                  <p className="text-gray-600">Email: <a href={`mailto:${selectedItem.contact.email}`} className="text-green-600 hover:underline">{selectedItem.contact.email}</a></p>
                </div>
              )}
            </div>
          )}

          {selectedCategory === 'Clubs & Societies' && selectedItem.description && (
            <div className="space-y-6">
              {selectedItem.logo && (
                <img src={selectedItem.logo} alt={selectedItem.name} className="w-32 h-32 object-contain mx-auto mb-4"/>
              )}
              <p className="text-gray-700 text-lg leading-relaxed">{selectedItem.description}</p>
              {selectedItem.interests && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="font-semibold mb-2 text-purple-700">Interests:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.interests.map((interest: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedItem.meeting_times && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-700">Meeting Times:</h3>
                  {Object.entries(selectedItem.meeting_times).map(([key, time]: [string, any]) => (
                    <p key={key} className="text-gray-600">
                      <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {time}
                    </p>
                  ))}
                </div>
              )}
              {selectedItem.contact && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-semibold mb-2 text-green-700">Contact:</h3>
                  {selectedItem.contact.email && (
                    <p className="text-gray-600">
                      Email: <a href={`mailto:${selectedItem.contact.email}`} className="text-green-600 hover:underline">
                        {selectedItem.contact.email}
                      </a>
                    </p>
                  )}
                  {selectedItem.contact.facebook && (
                    <p className="text-gray-600">
                      Facebook: <a href={selectedItem.contact.facebook} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        Visit Page
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedCategory === 'Programs' && selectedItem.description && (
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">{selectedItem.description}</p>
              {selectedItem.tagline && (
                <p className="text-xl font-semibold text-purple-600 italic">{selectedItem.tagline}</p>
              )}
              {selectedItem.program_details && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="font-semibold mb-3 text-purple-700">Program Details:</h3>
                  <div className="space-y-2">
                    <p><strong>Eligibility:</strong> {selectedItem.program_details.eligibility}</p>
                    <p><strong>Cost:</strong> {selectedItem.program_details.cost}</p>
                    <p><strong>Discount:</strong> {selectedItem.program_details.primary_discount}</p>
                    {selectedItem.program_details.applies_to && (
                      <div>
                        <strong>Applies to:</strong>
                        <ul className="ml-4 mt-1">
                          {selectedItem.program_details.applies_to.map((item: string, idx: number) => (
                            <li key={idx} className="text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Category listing view
    if (selectedCategory) {
      let itemsToDisplay: any[] = [];
      let CategoryIconComponent = HelpCircle;
      
      switch (selectedCategory) {
        case 'Support Services':
          itemsToDisplay = Object.values(uquData.support_services);
          CategoryIconComponent = categoryIcons.support || HelpCircle;
          break;
        case 'Food & Outlets':
          itemsToDisplay = [...uquData.outlets.food_beverage, ...uquData.outlets.retail_markets];
          CategoryIconComponent = categoryIcons.outlets || HelpCircle;
          break;
        case 'UQU Collectives':
          itemsToDisplay = uquData.collectives;
          CategoryIconComponent = categoryIcons.collectives || HelpCircle;
          break;
        case 'Clubs & Societies':
          itemsToDisplay = uquData.clubs;
          CategoryIconComponent = categoryIcons.clubs || HelpCircle;
          break;
        case 'Programs':
          itemsToDisplay = Object.values(uquData.programs);
          CategoryIconComponent = categoryIcons.programs || HelpCircle;
          break;
        case 'Events':
          itemsToDisplay = uquData.events.recurring_events || [];
          CategoryIconComponent = categoryIcons.events || HelpCircle;
          break;
        default:
          itemsToDisplay = [];
      }

      return (
        <div className="p-6 bg-gray-50 h-full overflow-y-auto">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-6 font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Home
          </button>
          
          <div className="flex items-center mb-8">
            <CategoryIconComponent className="w-10 h-10 text-purple-600 mr-4 flex-shrink-0" />
            <h2 className="text-3xl font-bold text-purple-700">{selectedCategory}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {itemsToDisplay.map((item, index) => (
              <button
                key={item.id || index}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out text-left border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                <div className="flex items-start space-x-4">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="w-12 h-12 rounded-md object-contain flex-shrink-0 mt-1"/>
                  ) : (
                    <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center flex-shrink-0 mt-1">
                      <CategoryIconComponent className="w-6 h-6 text-purple-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-purple-800 mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.mates_rates && (
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                        Mates Rates
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Home view
    return (
      <div className="p-6 bg-gray-50 h-full overflow-y-auto">
        <div className="mb-8 text-center">
          <img 
            src="https://uqu.com.au/wp-content/uploads/UQUnion_Primary_LogoLockUp_RGB-01.png" 
            alt="UQU Logo" 
            className="w-48 mx-auto mb-4"
          />
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
            {uquData.organization.name}
          </h1>
          <p className="text-lg text-gray-600">{uquData.organization.tagline}</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search services, clubs, food, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && performSearch()}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
          />
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {[
            { name: 'Support Services', icon: Heart, desc: "SAS, welfare, exams" },
            { name: 'Food & Outlets', icon: Coffee, desc: `${uquData.outlets.food_beverage.length} outlets + free meals` },
            { name: 'UQU Collectives', icon: Users, desc: `${uquData.collectives.length} support groups` },
            { name: 'Clubs & Societies', icon: MessageCircle, desc: "220+ clubs" },
            { name: 'Events', icon: Calendar, desc: "Weekly markets & more" },
            { name: 'Programs', icon: Shield, desc: "Mates Rates & more" },
          ].map(cat => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out text-left border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                <IconComponent className="w-10 h-10 text-purple-600 mb-3" />
                <h3 className="font-semibold text-xl text-purple-800 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Quick Info Cards */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center">
              <Utensils className="w-6 h-6 mr-2"/>Daily Free Meals
            </h3>
            <p className="text-sm">
              Breakfast: Mon-Fri 8-9:30am | Dinner: Mon-Fri 5-6pm. Find them at the Union Complex!
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center">
              <DollarSign className="w-6 h-6 mr-2"/>Mates Rates
            </h3>
            <p className="text-sm">FREE membership = 10% off at UQU outlets! Sign up online.</p>
          </div>

          <div className="bg-gradient-to-r from-sky-400 to-cyan-400 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center">
              <HelpCircle className="w-6 h-6 mr-2"/>Need Help?
            </h3>
            <p className="text-sm">
              Book a FREE SAS appointment online. For exam stress, call the SES Freak-Out Phone: 0404 106 173.
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-10 pt-8 border-t border-gray-300">
          <div className="flex justify-center space-x-8 mb-3">
            <a 
              href={uquData.organization.contact.social_media.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-purple-600 transition-colors"
            >
              <Facebook className="w-7 h-7" />
            </a>
            <a 
              href={uquData.organization.contact.social_media.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-purple-600 transition-colors"
            >
              <Instagram className="w-7 h-7" />
            </a>
            <a 
              href={uquData.organization.contact.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-purple-600 transition-colors"
            >
              <Globe className="w-7 h-7" />
            </a>
          </div>
          <p className="text-center text-xs text-gray-500">
            {uquData.organization.contact.location} | {uquData.organization.contact.hours}
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            © {new Date().getFullYear()} University of Queensland Union
          </p>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="h-screen flex flex-col bg-gray-100 relative overflow-hidden font-sans">
      {/* Upper Panel */}
      <div 
        style={{ height: `${dividerPosition}%` }} 
        className="bg-gray-50 overflow-y-auto shadow-inner"
      >
        {renderUpperPanel()}
      </div>

      {/* Draggable Divider - Now with touch support */}
      <div 
        className="h-3 bg-gray-300 hover:bg-purple-400 transition-colors duration-200 ease-in-out cursor-ns-resize relative flex items-center justify-center group touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-10 h-1 bg-gray-500 rounded-full group-hover:bg-white transition-colors" />
      </div>

      {/* Lower Panel - Chat Interface */}
      <div 
        style={{ height: `calc(${100 - dividerPosition}% - 0.75rem)` }}
        className="bg-white flex flex-col border-t border-gray-300"
      >
        <div className="bg-purple-700 text-white p-4 shadow-md">
          <h2 className="text-xl font-semibold">UQU AI Assistant</h2>
          <p className="text-sm opacity-90">Ask me anything about UQU services!</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.type === 'user' ? '' : 'space-y-2'}`}>
                <div
                  className={`rounded-xl py-3 px-4 shadow-md ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                </div>
                
                {/* Render suggestions */}
                {message.type === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pl-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputMessage(suggestion);
                        }}
                        className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-xl p-3 shadow-md border border-gray-200">
                <div className="flex space-x-1.5 items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="text-xs text-gray-500 ml-1">Typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder="Ask about support, food, clubs..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}