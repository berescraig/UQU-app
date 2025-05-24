import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Send, ChevronRight, MapPin, Calendar, Users, Coffee, Heart, HelpCircle, Newspaper, MessageCircle, Shield, Utensils, BookOpen, Briefcase, Globe, Music, Building, ShoppingBag, Phone, Mail, Facebook, Instagram, DollarSign, Clock, AlertCircle, ChevronLeft } from 'lucide-react';

// Import the comprehensive UQU data (still used for the upper panel for now)
const UQU_DATA = {
  "organization": {
    "name": "University of Queensland Union",
    "abbreviation": "UQU",
    "tagline": "Your student union representing you at UQ",
    "mission": "Representing the diverse interests of students and running services to enhance daily experience",
    "philosophy": "Every university student deserves access to support they need to thrive - academically, socially, and mentally",
    "organizational_structure": {
      "type": "Independent organisation",
      "governance": "Student executive elected by students",
      "decision_making": "Student feedback and new ideas drive priorities",
      "independence": "Independent of the University"
    },
    "core_values": [
      "Student representation and advocacy",
      "Comprehensive support services",
      "Vibrant campus culture",
      "Student voice in university matters",
      "Academic, social, and mental wellbeing"
    ],
    "contact": {
      "location": "Level 4, Building 21A, University of Queensland, St Lucia",
      "hours": "8am-4pm",
      "website": "https://uqu.com.au/",
      "social_media": {
        "instagram": "https://www.instagram.com/UQUnion/",
        "tiktok": "https://www.tiktok.com/@uqunion",
        "facebook": "https://www.facebook.com/UQUnion/"
      }
    }
  },
  "collectives": [
    {
      "id": "disability_collective",
      "name": "UQU Disability Collective",
      "category": "Identity & Support",
      "target_group": "Students who experience disability, chronic illness, mental illness, neurodiversity and/or are Deaf",
      "description": "Branch of UQU focused on advocacy, support and social connectedness for students with disabilities. Provides safe spaces, peer support, and works with university administration to advocate for student rights.",
      "facilities": {
        "location": "Room 21A (opposite Main Course), Student Union Building Level 1",
        "hours": "Monday-Friday, 6am-9pm"
      },
      "interests": ["disability advocacy", "peer support", "accessibility", "mental health", "social connection", "student rights"]
    },
    {
      "id": "environment_collective",
      "name": "UQU Environment Collective",
      "category": "Issue-Based Advocacy",
      "target_group": "Students, staff and general public interested in environmental issues",
      "description": "Inclusive platform for encouraging sustainable practices on campus, environmental advocacy, and promoting awareness of Queensland's native flora and fauna.",
      "facilities": {
        "location": "Room 21D",
        "hours": "Monday-Friday, 6am-8pm"
      },
      "interests": ["sustainability", "environmental advocacy", "networking", "conservation", "native wildlife"]
    },
    {
      "id": "goorie_berrimpa",
      "name": "UQU Goorie Berrimpa",
      "category": "Cultural & Identity",
      "target_group": "Aboriginal and Torres Strait Islander students",
      "description": "Aboriginal and Torres Strait Islander student collective serving as a 'second home for UQ's deadliest students.' Student-led organization fostering belonging, cultural pride, and connection for First Nations students.",
      "name_meaning": "Meeting Place in the language of the Turrbal people",
      "facilities": {
        "location": "Aboriginal and Torres Strait Islander Studies Unit (ATSISU), Level 2, Bookshop Building (Building 4)"
      },
      "contact": {
        "email": "goorie@uqu.com.au"
      }
    },
    {
      "id": "international_collective",
      "name": "UQU International Collective",
      "category": "Support & Advocacy",
      "target_group": "International students and those interested in cultural diversity",
      "description": "Student collective providing guidance and support for international students throughout their university experience, understanding the challenges of leaving home country behind.",
      "facilities": {
        "location": "Room 21D",
        "hours": "Monday-Friday, 6am-8pm"
      }
    },
    {
      "id": "queer_collective",
      "name": "UQU Queer Collective",
      "category": "Identity & Community",
      "target_group": "LGBTQIA+ and queer students",
      "description": "Community group for UQ LGBTQIA+ community facilitating social, charitable, educational, and political events. Proud inheritor of decades of LGBTQIA+ advocacy achievements at UQ.",
      "facilities": {
        "name": "Carden Queer Room",
        "location": "Room 21A",
        "hours": "Monday-Friday, 6am-9pm",
        "access": "LGBTQIA+ students only (allies welcome as guests)"
      },
      "contact": {
        "email": "queer@uqu.com.au"
      }
    },
    {
      "id": "student_rights_collective",
      "name": "UQU Student Rights Collective",
      "category": "Student Advocacy",
      "target_group": "All UQ students",
      "description": "Peak representative body committed to representing and fighting for UQ students' rights to the University, government, and other stakeholders. Run by elected Student Rights Vice Presidents.",
      "initiatives": [
        "Morning Marmalade (free breakfast program)",
        "Kampus Kitchen (free dinner program)",
        "Food Co-Op (discounted groceries)",
        "Placement Bursaries for students in poverty",
        "Student exam support services"
      ]
    },
    {
      "id": "womens_collective",
      "name": "UQU Women's Collective",
      "category": "Identity & Advocacy",
      "target_group": "Women and non-binary students",
      "description": "Autonomous feminist group representing and advocating for women on campus through events, campaigns, and consciousness-raising. Non-affiliated with political parties or external organizations.",
      "facilities": {
        "location": "Room 21D",
        "hours": "Monday-Friday, 6am-9pm"
      }
    }
  ],
  "outlets": {
    "food_beverage": [
      {
        "id": "expresso",
        "name": "Expresso",
        "category": "Coffee Shop",
        "description": "Coffee shop providing caffeine fix for uni students, serving all favorite hot and cold beverages from mochas to matchas.",
        "mates_rates": true,
        "location": "On campus",
        "logo": "https://uqu.com.au/wp-content/uploads/Expresso-Logo-Web-Tile-300x300.png"
      },
      {
        "id": "on_a_roll_bakery",
        "name": "On A Roll Bakery",
        "category": "Bakery & Café",
        "description": "Daily stop for coffee and breakfast bites, stocked with gourmet pies, pastries, toasties, fresh wraps, sweet treats, and desserts.",
        "mates_rates": true,
        "location": "On campus",
        "logo": "https://uqu.com.au/wp-content/uploads/On-A-Roll-Logo-Web-Tile-300x300.png"
      },
      {
        "id": "pizza_caffe",
        "name": "Pizza Caffe",
        "category": "Pizza Restaurant",
        "description": "UQ institution since 1992, famous for thin crispy bases and artisan pizzas. Perfect place to catch up with friends over hot pizza and cold beer.",
        "established": "1992",
        "mates_rates": true,
        "alcohol_service": true,
        "location": "On campus",
        "logo": "https://uqu.com.au/wp-content/uploads/Pizza-Caffe-Logo-Web-Tile-300x300.png"
      },
      {
        "id": "redroom",
        "name": "REDROOM",
        "category": "Student Bar",
        "description": "The student bar and social hub. Currently closed for maintenance (asbestos removal) and will reopen in 2025.",
        "operating_status": "Closed for maintenance",
        "reopening": "2025",
        "mates_rates": true,
        "alcohol_service": true,
        "location": "Union Complex (currently closed)",
        "logo": "https://uqu.com.au/wp-content/uploads/Redroom-Logo-Web-Tile-300x300.png"
      },
      {
        "id": "main_course",
        "name": "Main Course",
        "category": "Food Court",
        "description": "Long-standing go-to for fast, fresh, tasty, and healthy meals on campus at affordable prices.",
        "mates_rates": true,
        "location": "On campus",
        "logo": "https://uqu.com.au/wp-content/uploads/Main-Course-Logo-Web-Tile-300x300.png"
      },
      {
        "id": "darwins",
        "name": "Darwin's",
        "category": "Café",
        "description": "Perfect spot for grab-and-go lunch or relaxed coffee with study buddies or colleagues.",
        "mates_rates": true,
        "location": "On campus",
         "logo": "https://uqu.com.au/wp-content/uploads/Darwins-Logo-Web-Tile-300x300.png"
      },
      {
        "id": "lolly_shop",
        "name": "Lolly Shop",
        "category": "Confectionery & Snacks",
        "description": "Treating UQ students since 1981. Favorite for afternoon sugar fix with pick & mix lollies, exclusive gourmet products, and variety of snacks.",
        "established": "1981",
        "mates_rates": true,
        "location": "On campus",
        "logo": "https://uqu.com.au/wp-content/uploads/LollyShop-Logo-Web-Tile-300x300.png"
      },
      {
        "id": "lawes_club",
        "name": "Lawes Club",
        "category": "Student Bar",
        "description": "Student bar at Gatton campus for unwinding, catching up with friends and having fun. Features weekly themed dress-up parties.",
        "campus": "Gatton",
        "operating_schedule": {
          "day": "Wednesday",
          "hours": "8pm to midnight"
        },
        "alcohol_service": true,
        "location": "Gatton campus",
        "logo": "https://uqu.com.au/wp-content/uploads/UQU-Gatton-Logo-Web-Tile-300x300.png" 
      }
    ],
    "services": [
      {
        "id": "microwave_rooms",
        "name": "Microwave Rooms",
        "category": "Student Utility",
        "description": "Four microwave rooms provided by UQU for students to heat up lunch, make noodles, with hot water and sinks available.",
        "facilities": ["Microwaves", "Hot water", "Sinks"],
        "cost": "Free to use",
        "location": "Four locations across campus"
      }
    ],
    "retail_markets": [
      {
        "id": "op_shop",
        "name": "Op Shop",
        "category": "Thrift Store",
        "description": "Budget-friendly retail shopping with pre-loved clothing, accessories, books, and magazines.",
        "mates_rates": true,
        "location": "On campus",
        "logo": "https://uqu.com.au/wp-content/uploads/OpShop-Logo-Web-Tile-300x300.png"
      },
      {
        "id": "wednesday_markets",
        "name": "Wednesday Markets",
        "category": "Weekly Market",
        "description": "Weekly markets every Wednesday at Campbell Place featuring various stalls with flowers, fashion, handmade jewelry, succulents, and gifts.",
        "schedule": {
          "day": "Every Wednesday",
          "location": "Campbell Place"
        },
        "location": "Campbell Place",
        "logo": "https://uqu.com.au/wp-content/uploads/Market-Icon.png"
      },
      {
        "id": "uqu_etc",
        "name": "UQU ETC.",
        "category": "University Retail",
        "description": "One-stop shop for all uni needs selling UQU merchandise, stationery, phone accessories, lab coats, USBs, calculators, and graduation gifts.",
        "mates_rates": true,
        "location": "On campus",
        "logo": "https://uqu.com.au/wp-content/uploads/ETC-Logo-Web-Tile-300x300.png"
      }
    ]
  },
  "support_services": {
    "student_advocacy_support": {
      "id": "sas",
      "name": "Student Advocacy & Support (SAS)",
      "description": "Free, independent hub of support empowering every student to feel and do their best beyond academics",
      "characteristics": ["Free of charge", "Independent", "Judgement-free", "Confidential"],
      "booking_system": "https://supporting-u.uqu.com.au/students/login",
      "eligibility": "Currently enrolled UQ undergraduate and postgraduate students only",
      "appointment_types": {
        "welfare_wellbeing": {
          "description": "Support for difficulties at home or university",
          "services": [
            "Strategies for coping with stress",
            "Centrelink information",
            "Creating social connections and navigating university life",
            "Life hacks & tips for self care",
            "Financial assistance",
            "Sexual misconduct support",
            "General wellbeing"
          ]
        },
        "academic_support": {
          "description": "Get studies back on track and navigate workload",
          "services": [
            "Appeals",
            "Grievance/complaints resolution",
            "Student misconduct allegations",
            "Re-marks & assessment issues",
            "Removal of course",
            "Progression intervention notices"
          ]
        },
        "job_preparation": {
          "description": "Employment assistance and career preparation",
          "services": [
            "How to apply for part-time/casual jobs",
            "Resume & cover letter assistance",
            "Mock interview practice"
          ]
        },
        "legal_support": {
          "description": "Legal assistance with solicitor available",
          "services": [
            "Intellectual property issues",
            "Civil disputes",
            "Consumer complaints",
            "General legal advice/referrals",
            "Residential tenancy matters",
            "Motor vehicle accidents",
            "Family law matters"
          ]
        },
        "visa_support": {
          "description": "Confidential advice for international students on education and visa enquiries",
          "services": [
            "UQ Enrolment related Visa issues",
            "Student Visa emergency assistance",
            "Student Visa extensions",
            "General student Visa enquiries"
          ]
        }
      },
      "bursaries": {
        "emergency_financial_support": {
          "name": "SAS Emergency Financial Support",
          "description": "One-off payment to alleviate financial pressures and facilitate better study engagement",
          "application_process": "Book welfare appointment with SAS advocate",
          "availability": "Any time of year"
        },
        "placement_bursary": {
          "name": "UQU Placement Bursary",
          "status": "Closed for current applications",
          "description": "Financial support for students facing hardship from decreased work hours during compulsory placement",
          "next_application_period": {
            "opens": "Monday 17 February 2025 at 12am",
            "closes": "Monday 10 March 2025 at 9am"
          }
        }
      }
    },
    "welfare_wellbeing_resources": {
      "id": "welfare_resources",
      "name": "Welfare & Wellbeing Resources",
      "description": "Collection of resources, tips, tricks and life hacks for student life navigation"
    },
    "student_exam_support": {
      "id": "ses",
      "name": "Student Exam Support (SES)",
      "description": "Comprehensive support program during exam periods with food, activities, and wellbeing support",
      "emergency_contact": {
        "name": "SES Freak-Out Phone",
        "phone": "0404 106 173",
        "availability": "ONLY during UQ exam weeks 7:30am-6:30pm"
      }
    },
    "food_support": {
      "id": "food_co_op",
      "name": "Food Co-Op, Morning Marmalade & Kampus Kitchen",
      "description": "Welfare initiatives providing free meals and low-cost groceries across UQ campuses",
      "campus_services": {
        "st_lucia": {
          "location": "Ground Floor, Union Complex",
          "services": {
            "morning_marmalade": {
              "schedule": "Monday-Friday, 8am-9.30am",
              "location": "Next to Boost Juice"
            },
            "kampus_kitchen": {
              "schedule": "Monday-Friday, 5pm-6pm (or until stocks last)",
              "location": "Same outlet as Morning Marmalade"
            },
            "food_co_op": {
              "schedule": "Monday, Tuesday & Thursday, 10am-2pm",
              "location": "Opposite pharmacy",
              "eligibility": "Mates Rates members only (free membership)"
            }
          }
        }
      }
    }
  },
  "events": {
    "overview": {
      "description": "Campuses buzzing year-round with events crafted for every taste and interest",
      "tagline": "Bubble tea workshops, board game nights, beach trips…"
    },
    "recurring_events": [
      {
        "id": "wednesday_markets",
        "name": "Wednesday Markets",
        "type": "weekly_market",
        "schedule": {
          "frequency": "Weekly",
          "day": "Wednesday",
          "time": "8am-3pm"
        },
        "location": {
          "venue": "Campbell Place",
          "campus": "St Lucia"
        }
      }
    ]
  },
  "clubs": [
    {
      "id": "180_degrees_consulting",
      "name": "180 Degrees Consulting",
      "category": "Faculty",
      "description": "Student consulting organization providing pro-bono consulting services.",
      "interests": ["consulting", "business", "strategy", "professional development", "teamwork"]
    },
    {
      "id": "chess_club_uqcc",
      "name": "Chess Club (UQCC)",
      "category": "Hobby/Special Interest",
      "description": "UQ Chess Club welcomes players of all skill levels to regular meetings and chess activities.",
      "interests": ["chess", "strategy games", "board games", "competition"],
      "meeting_times": {
        "regular": "Wednesday afternoons 5pm-7pm"
      },
      "contact": {
        "email": "chess@uqu.com.au"
      }
    },
    {
      "id": "australia_china_youth_association",
      "name": "Australia-China Youth Association (ACYA)",
      "category": "International",
      "description": "Transnational cultural club with chapters across Australia and China, focusing on Chinese and Australian culture exchange.",
      "interests": ["Chinese culture", "Australian culture", "cultural exchange", "networking", "career development", "language learning"]
    },
    {
      "id": "queensland_university_musical_society",
      "name": "Queensland University Musical Society (QUMS)",
      "category": "Performance",
      "description": "Established in 1912, QUMS is a non-auditioned choir based at UQ, open to both students and the general public.",
      "interests": ["choral music", "singing", "classical music", "performance", "community music"],
      "meeting_times": {
        "rehearsals": "Wednesday nights 7:00pm-9:30pm"
      }
    },
    {
      "id": "effective_altruism_uq",
      "name": "Effective Altruism UQ (EAUQ)",
      "category": "Social Justice/Political",
      "description": "Community focused on using resources to help others as effectively as possible through evidence-based charitable decisions.",
      "interests": ["effective altruism", "charity", "rational thinking", "global compassion", "evidence-based giving", "social impact"]
    }
  ],
  "programs": {
    "mates_rates": {
      "id": "mates_rates",
      "name": "Mates Rates",
      "tagline": "YOUR STUDENT DISCOUNT!",
      "description": "FREE membership discount program for UQ students providing savings at UQU outlets",
      "program_details": {
        "eligibility": "All UQ students",
        "cost": "FREE membership",
        "primary_discount": "10% OFF full price purchases",
        "applies_to": ["UQU food outlets", "UQU drink outlets", "UQU retail outlets"]
      }
    },
    "volunteers": {
      "id": "volunteers",
      "name": "UQU Volunteers",
      "tagline": "Creating an empowered, connected, and supported student community through giving back",
      "mission": "Give back to student community and make meaningful impact"
    }
  },
  "metadata": {
    "total_collectives": 7,
    "total_outlets": 13,
    "total_support_services": 4,
    "campuses": ["St Lucia", "Gatton", "Herston", "Dutton Park"]
  }
};

// Icon mapping for main categories (still used for upper panel)
const categoryIcons = {
  "support": Heart,
  "collectives": Users,
  "outlets": Coffee,
  "clubs": MessageCircle,
  "events": Calendar,
  "programs": Shield,
  "contact": Phone
};

// Icon mapping for specific services (still used for upper panel)
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

// Define a type for individual messages
interface Message {
  type: 'user' | 'bot';
  content: string;
  suggestions?: string[]; // Optional suggestions array
}

export default function UQUAssistant() {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Explicitly type
  const [selectedItem, setSelectedItem] = useState<any | null>(null); // Type appropriately later
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([ // Use the Message interface
    { 
      type: 'bot', 
      content: "G'day! I'm your UQU Assistant. I can help you find information about:\n• Support services (SAS, bursaries, welfare)\n• Food outlets and free meals\n• Clubs and societies\n• UQU Collectives\n• Events and activities\n• Mates Rates discounts\n\nWhat would you like to know about?" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null); // Type the ref
  const messagesEndRef = useRef<HTMLDivElement>(null); // Type the ref

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => { // Type the event
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => { // Type the event (global MouseEvent)
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
  }, [isDragging, handleMouseMove]); // Added handleMouseMove to dependency array as it's used in effect

  const handleCategoryClick = (category: string) => { // Type category
    setSelectedCategory(category);
    setSelectedItem(null);
  };

  const handleItemClick = (item: any) => { // Type item appropriately later
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedCategory(null);
    }
  };

  // New handleSendMessage function for n8n integration
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Use environment variable for the webhook URL
      // IMPORTANT: Create a .env file in your uqu-assistant project root
      // and add: REACT_APP_N8N_WEBHOOK=http://localhost:5678/webhook/chat
      const webhookUrl = process.env.REACT_APP_N8N_WEBHOOK || 'http://localhost:5678/webhook/chat';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            // Pass relevant context if needed by your n8n workflow
            selectedArea: selectedCategory, // Using selectedCategory as selectedArea
            searchQuery: searchQuery
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get response from n8n: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: data.response || "Sorry, I couldn't process that.", // Fallback for missing response
        suggestions: data.suggestions || []
      }]);

      // If the response includes navigation hints, handle them
      if (data.context_type) {
        // Map n8n context_type to your existing category names if they differ
        // For now, assuming they might align or you'll adjust n8n/frontend
        switch (data.context_type.toLowerCase()) {
          case 'clubs':
          case 'clubs & societies':
            setSelectedCategory('Clubs & Societies');
            setSelectedItem(null);
            break;
          case 'food':
          case 'food & outlets':
            setSelectedCategory('Food & Outlets');
            setSelectedItem(null);
            break;
          case 'support':
          case 'support services':
            setSelectedCategory('Support Services');
            setSelectedItem(null);
            break;
          case 'collectives':
          case 'uqu collectives':
            setSelectedCategory('UQU Collectives');
            setSelectedItem(null);
            break;
          case 'programs':
            setSelectedCategory('Programs');
            setSelectedItem(null);
            break;
          case 'events':
            setSelectedCategory('Events');
            setSelectedItem(null);
            break;
          // Add more cases as needed
          default:
            // Optionally clear selection or navigate to a default view
            // setSelectedCategory(null); 
            // setSelectedItem(null);
            break;
        }
      }

    } catch (error) {
      console.error('Error sending message to n8n:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: "Sorry, I'm having trouble connecting. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Optional: Function to test n8n connection on component mount (for development)
  const testN8nConnection = async () => {
    try {
      const webhookUrl = process.env.REACT_APP_N8N_WEBHOOK || 'http://localhost:5678/webhook/chat';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'test connection', 
          context: {} 
        })
      });
      
      if (response.ok) {
        console.log('✅ n8n connection test successful (check n8n execution logs)');
      } else {
        console.log('❌ n8n connection test failed:', response.status, response.statusText);
      }
    } catch (error: any) { // Type error
      console.log('❌ n8n not reachable for test:', error.message);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // testN8nConnection(); // You can uncomment this to test on load
    }
  }, []);


  const renderUpperPanel = () => {
    // Detail view for specific item
    if (selectedItem) {
      // Ensure selectedItem is not null and has a name property before rendering
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
           {/* Add similar detailed views for Clubs, Programs, Events if needed */}
        </div>
      );
    }

    // Category listing view
    if (selectedCategory) {
      let itemsToDisplay: any[] = []; // Type appropriately later
      let CategoryIconComponent = HelpCircle; // Default icon
      
      switch (selectedCategory) {
        case 'Support Services':
          itemsToDisplay = Object.values(UQU_DATA.support_services);
          CategoryIconComponent = categoryIcons.support || HelpCircle;
          break;
        case 'Food & Outlets':
          itemsToDisplay = [...UQU_DATA.outlets.food_beverage, ...UQU_DATA.outlets.retail_markets];
          CategoryIconComponent = categoryIcons.outlets || HelpCircle;
          break;
        case 'UQU Collectives':
          itemsToDisplay = UQU_DATA.collectives;
          CategoryIconComponent = categoryIcons.collectives || HelpCircle;
          break;
        case 'Clubs & Societies':
          itemsToDisplay = UQU_DATA.clubs;
          CategoryIconComponent = categoryIcons.clubs || HelpCircle;
          break;
        case 'Programs':
          itemsToDisplay = Object.values(UQU_DATA.programs);
          CategoryIconComponent = categoryIcons.programs || HelpCircle;
          break;
        case 'Events':
            itemsToDisplay = UQU_DATA.events.recurring_events; // Assuming we show recurring for now
            CategoryIconComponent = categoryIcons.events || HelpCircle;
            break;
        default:
            itemsToDisplay = []; // Handle unknown category
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
                  <div>
                    <h3 className="font-semibold text-lg text-purple-800 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description && item.description}
                    </p>
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

    // Home view (upper panel)
    return (
      <div className="p-6 bg-gray-50 h-full overflow-y-auto">
        <div className="mb-8 text-center">
          <img src="https://uqu.com.au/wp-content/uploads/UQUnion_Primary_LogoLockUp_RGB-01.png" alt="UQU Logo" className="w-48 mx-auto mb-4"/>
          <h1 className="text-4xl font-extrabold text-purple-800 mb-2">{UQU_DATA.organization.name}</h1>
          <p className="text-lg text-gray-600">{UQU_DATA.organization.tagline}</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search services, clubs, food, events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
          />
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {[
            { name: 'Support Services', icon: Heart, desc: "SAS, welfare, exams" },
            { name: 'Food & Outlets', icon: Coffee, desc: "13 outlets + free meals" },
            { name: 'UQU Collectives', icon: Users, desc: "7 support groups" },
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
            <h3 className="font-bold text-lg mb-2 flex items-center"><Utensils className="w-6 h-6 mr-2"/>Daily Free Meals</h3>
            <p className="text-sm">Breakfast: Mon-Fri 8-9:30am | Dinner: Mon-Fri 5-6pm. Find them at the Union Complex!</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center"><DollarSign className="w-6 h-6 mr-2"/>Mates Rates</h3>
            <p className="text-sm">FREE membership = 10% off at UQU outlets! Sign up online.</p>
          </div>

          <div className="bg-gradient-to-r from-sky-400 to-cyan-400 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2 flex items-center"><HelpCircle className="w-6 h-6 mr-2"/>Need Help?</h3>
            <p className="text-sm">Book a FREE SAS appointment online. For exam stress, call the SES Freak-Out Phone: 0404 106 173.</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-10 pt-8 border-t border-gray-300">
          <div className="flex justify-center space-x-8 mb-3">
            <a href={UQU_DATA.organization.contact.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors">
              <Facebook className="w-7 h-7" />
            </a>
            <a href={UQU_DATA.organization.contact.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors">
              <Instagram className="w-7 h-7" />
            </a>
            <a href={UQU_DATA.organization.contact.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors">
              <Globe className="w-7 h-7" />
            </a>
          </div>
          <p className="text-center text-xs text-gray-500">
            {UQU_DATA.organization.contact.location} | {UQU_DATA.organization.contact.hours}
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
        className="bg-gray-50 overflow-y-auto shadow-inner" // Added shadow-inner for depth
      >
        {renderUpperPanel()}
      </div>

      {/* Draggable Divider */}
      <div 
        className="h-3 bg-gray-300 hover:bg-purple-400 transition-colors duration-200 ease-in-out cursor-ns-resize relative flex items-center justify-center group"
        onMouseDown={handleMouseDown}
      >
        <div className="w-10 h-1 bg-gray-500 rounded-full group-hover:bg-white transition-colors" />
      </div>

      {/* Lower Panel - Chat Interface */}
      <div 
        style={{ height: `calc(${100 - dividerPosition}% - 0.75rem)` }} // Account for divider height
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
                  className={`rounded-xl py-3 px-4 shadow-md ${ // Changed to rounded-xl and added shadow
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200' // Bot messages with border
                  }`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                </div>
                
                {/* Render suggestions if they exist */}
                {message.type === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pl-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInputMessage(suggestion); 
                          // Optionally, auto-send the suggestion when clicked
                          // handleSendMessage(); // Or let user press send
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
