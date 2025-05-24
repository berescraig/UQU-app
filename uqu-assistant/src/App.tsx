import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Send, ChevronRight, MapPin, Calendar, Users, Coffee, Heart, HelpCircle, Newspaper, MessageCircle, Shield, Utensils, BookOpen, Briefcase, Globe, Music, Building, ShoppingBag, Phone, Mail, Facebook, Instagram, DollarSign, Clock, AlertCircle, ChevronLeft } from 'lucide-react';

// Import the comprehensive UQU data
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
        "location": "On campus"
      },
      {
        "id": "on_a_roll_bakery",
        "name": "On A Roll Bakery",
        "category": "Bakery & Café",
        "description": "Daily stop for coffee and breakfast bites, stocked with gourmet pies, pastries, toasties, fresh wraps, sweet treats, and desserts.",
        "mates_rates": true,
        "location": "On campus"
      },
      {
        "id": "pizza_caffe",
        "name": "Pizza Caffe",
        "category": "Pizza Restaurant",
        "description": "UQ institution since 1992, famous for thin crispy bases and artisan pizzas. Perfect place to catch up with friends over hot pizza and cold beer.",
        "established": "1992",
        "mates_rates": true,
        "alcohol_service": true,
        "location": "On campus"
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
        "location": "Union Complex (currently closed)"
      },
      {
        "id": "main_course",
        "name": "Main Course",
        "category": "Food Court",
        "description": "Long-standing go-to for fast, fresh, tasty, and healthy meals on campus at affordable prices.",
        "mates_rates": true,
        "location": "On campus"
      },
      {
        "id": "darwins",
        "name": "Darwin's",
        "category": "Café",
        "description": "Perfect spot for grab-and-go lunch or relaxed coffee with study buddies or colleagues.",
        "mates_rates": true,
        "location": "On campus"
      },
      {
        "id": "lolly_shop",
        "name": "Lolly Shop",
        "category": "Confectionery & Snacks",
        "description": "Treating UQ students since 1981. Favorite for afternoon sugar fix with pick & mix lollies, exclusive gourmet products, and variety of snacks.",
        "established": "1981",
        "mates_rates": true,
        "location": "On campus"
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
        "location": "Gatton campus"
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
        "location": "On campus"
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
        "location": "Campbell Place"
      },
      {
        "id": "uqu_etc",
        "name": "UQU ETC.",
        "category": "University Retail",
        "description": "One-stop shop for all uni needs selling UQU merchandise, stationery, phone accessories, lab coats, USBs, calculators, and graduation gifts.",
        "mates_rates": true,
        "location": "On campus"
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

export default function UQUAssistant() {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: "G'day! I'm your UQU Assistant. I can help you find information about:\n• Support services (SAS, bursaries, welfare)\n• Food outlets and free meals\n• Clubs and societies\n• UQU Collectives\n• Events and activities\n• Mates Rates discounts\n\nWhat would you like to know about?" 
    }
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

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedItem(null);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedCategory(null);
    }
  };

  const processUserMessage = async (message) => {
    const lowerMessage = message.toLowerCase();
    let response = "";

    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = "G'day! How can I help you today? I know all about UQU's services, food outlets, clubs, support services, and more!";
    }
    // Check for food/free meals
    else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('hungry') || lowerMessage.includes('free')) {
      response = "🍳 **Free Food Options:**\n• Morning Marmalade: Mon-Fri 8-9:30am (free breakfast)\n• Kampus Kitchen: Mon-Fri 5-6pm (free dinner)\n• Food Co-Op: Mon/Tue/Thu 10am-2pm (low-cost groceries - Mates Rates members only)\n\n";
      response += "☕ **Food Outlets with Mates Rates (10% off):**\n";
      const foodOutlets = UQU_DATA.outlets.food_beverage.filter(o => o.mates_rates && o.operating_status !== 'Closed for maintenance');
      foodOutlets.slice(0, 5).forEach(outlet => {
        response += `• ${outlet.name}: ${outlet.category}\n`;
      });
      response += "\nWould you like to know more about any specific outlet or free meal program?";
    }
    // Check for support/help
    else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('stress') || lowerMessage.includes('struggling')) {
      response = "UQU Student Advocacy & Support (SAS) offers FREE, confidential help:\n\n";
      response += "📚 **Academic Support**: Appeals, misconduct allegations, grievances\n";
      response += "💰 **Welfare & Wellbeing**: Financial assistance, stress management, social connections\n";
      response += "⚖️ **Legal Support**: Free legal advice with solicitor\n";
      response += "💼 **Job Preparation**: Resume help, interview practice\n";
      response += "🌏 **Visa Support**: For international students\n\n";
      response += "Book online at: supporting-u.uqu.com.au/students/login\n\n";
      response += "💸 **Emergency Financial Support** available for students in hardship!\n";
      response += "📞 During exams: SES Freak-Out Phone: 0404 106 173";
    }
    // Check for clubs
    else if (lowerMessage.includes('club') || lowerMessage.includes('society') || lowerMessage.includes('join')) {
      response = "UQU has 220+ clubs and societies! Here are some examples:\n\n";
      UQU_DATA.clubs.forEach(club => {
        response += `• **${club.name}** (${club.category}): ${club.description.substring(0, 60)}...\n`;
      });
      response += "\nPlus many more! Visit the clubs section to explore all options.";
    }
    // Check for collectives
    else if (lowerMessage.includes('collective') || lowerMessage.includes('lgbtq') || lowerMessage.includes('queer') || lowerMessage.includes('women') || lowerMessage.includes('disability')) {
      response = "**UQU Collectives** provide safe spaces and advocacy:\n\n";
      UQU_DATA.collectives.forEach(collective => {
        response += `• **${collective.name}**: ${collective.target_group}\n`;
        if (collective.facilities) {
          response += `  📍 ${collective.facilities.location}\n`;
        }
      });
      response += "\nAll collectives offer free membership and supportive communities!";
    }
    // Check for discount/mates rates
    else if (lowerMessage.includes('discount') || lowerMessage.includes('mates') || lowerMessage.includes('cheap')) {
      response = "💳 **Mates Rates - Your FREE Student Discount!**\n\n";
      response += "✅ FREE membership for all UQ students\n";
      response += "✅ 10% OFF at most UQU outlets\n";
      response += "✅ Includes food, drinks, and retail\n";
      response += "✅ Digital wallet card for easy use\n\n";
      response += "Sign up at: uqu.com.au/mates-rates\n\n";
      response += "Plus don't forget:\n";
      response += "• Free breakfast & dinner daily\n";
      response += "• Food Co-Op for cheap groceries\n";
      response += "• Op Shop for budget shopping";
    }
    else {
      response = "I can help you with:\n\n";
      response += "🛡️ **Support Services**: Academic help, welfare, legal advice, visa support\n";
      response += "🍔 **Food & Dining**: Free meals, food outlets, Mates Rates discounts\n";
      response += "👥 **Clubs & Societies**: 220+ options across all interests\n";
      response += "🏳️‍🌈 **UQU Collectives**: Safe spaces for diverse communities\n";
      response += "📅 **Events**: Markets, workshops, social activities\n";
      response += "💰 **Financial Help**: Emergency bursaries, placement support\n\n";
      response += "What would you like to explore?";
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
    // Detail view for specific item
    if (selectedItem) {
      return (
        <div className="p-6">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to {selectedCategory}
          </button>
          
          <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
          
          {/* Render details based on category */}
          {selectedCategory === 'Support Services' && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedItem.description}</p>
              
              {selectedItem.appointment_types && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Services Available:</h3>
                  {Object.entries(selectedItem.appointment_types).map(([key, type]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold capitalize">{key.replace('_', ' ')}</h4>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <ul className="text-sm space-y-1">
                        {type.services.map((service, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedItem.booking_system && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="font-semibold">Book an appointment:</p>
                  <a href={selectedItem.booking_system} className="text-purple-600 hover:underline">
                    {selectedItem.booking_system}
                  </a>
                </div>
              )}
            </div>
          )}
          
          {selectedCategory === 'Food & Outlets' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-gray-600 mb-3">{selectedItem.description}</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Location:</strong> {selectedItem.location}</p>
                  {selectedItem.established && <p><strong>Established:</strong> {selectedItem.established}</p>}
                  {selectedItem.mates_rates && (
                    <p className="text-purple-600 font-semibold">✅ Mates Rates discount available (10% off)</p>
                  )}
                  {selectedItem.operating_status === 'Closed for maintenance' && (
                    <p className="text-red-600 font-semibold">⚠️ Currently closed - reopening {selectedItem.reopening}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {selectedCategory === 'UQU Collectives' && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedItem.description}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Target Group:</h3>
                <p>{selectedItem.target_group}</p>
              </div>
              {selectedItem.facilities && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Location & Hours:</h3>
                  <p><strong>Location:</strong> {selectedItem.facilities.location}</p>
                  <p><strong>Hours:</strong> {selectedItem.facilities.hours}</p>
                </div>
              )}
              {selectedItem.contact && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Contact:</h3>
                  {selectedItem.contact.email && <p>Email: {selectedItem.contact.email}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // Category listing view
    if (selectedCategory) {
      let items = [];
      let categoryIcon = HelpCircle;
      
      switch (selectedCategory) {
        case 'Support Services':
          items = Object.values(UQU_DATA.support_services);
          categoryIcon = Heart;
          break;
        case 'Food & Outlets':
          items = [...UQU_DATA.outlets.food_beverage, ...UQU_DATA.outlets.retail_markets];
          categoryIcon = Coffee;
          break;
        case 'UQU Collectives':
          items = UQU_DATA.collectives;
          categoryIcon = Users;
          break;
        case 'Clubs & Societies':
          items = UQU_DATA.clubs;
          categoryIcon = MessageCircle;
          break;
        case 'Programs':
          items = Object.values(UQU_DATA.programs);
          categoryIcon = Shield;
          break;
      }

      const Icon = categoryIcon;

      return (
        <div className="p-6">
          <button 
            onClick={handleBackClick}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </button>
          
          <div className="flex items-center mb-6">
            <Icon className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold">{selectedCategory}</h2>
          </div>

          <div className="grid gap-4">
            {items.map((item, index) => (
              <button
                key={item.id || index}
                onClick={() => handleItemClick(item)}
                className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
              >
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item.description && item.description.substring(0, 100)}...
                </p>
                {item.mates_rates && (
                  <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                    Mates Rates
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Home view
    return (
      <div className="p-6">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">{UQU_DATA.organization.name}</h1>
          <p className="text-gray-600">{UQU_DATA.organization.tagline}</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services, clubs, outlets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Main Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleCategoryClick('Support Services')}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
          >
            <Heart className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Support Services</h3>
            <p className="text-sm text-gray-600">SAS, welfare, exams</p>
          </button>

          <button
            onClick={() => handleCategoryClick('Food & Outlets')}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
          >
            <Coffee className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Food & Outlets</h3>
            <p className="text-sm text-gray-600">13 outlets + free meals</p>
          </button>

          <button
            onClick={() => handleCategoryClick('UQU Collectives')}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
          >
            <Users className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">UQU Collectives</h3>
            <p className="text-sm text-gray-600">7 support groups</p>
          </button>

          <button
            onClick={() => handleCategoryClick('Clubs & Societies')}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
          >
            <MessageCircle className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Clubs & Societies</h3>
            <p className="text-sm text-gray-600">220+ clubs</p>
          </button>

          <button
            onClick={() => handleCategoryClick('Events')}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
          >
            <Calendar className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Events</h3>
            <p className="text-sm text-gray-600">Weekly markets & more</p>
          </button>

          <button
            onClick={() => handleCategoryClick('Programs')}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow text-left"
          >
            <Shield className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Programs</h3>
            <p className="text-sm text-gray-600">Mates Rates & more</p>
          </button>
        </div>

        {/* Quick Info Cards */}
        <div className="space-y-3">
          <div className="bg-pink-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🍳 Daily Free Meals</h3>
            <p className="text-sm">Breakfast: Mon-Fri 8-9:30am | Dinner: Mon-Fri 5-6pm</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">💳 Mates Rates</h3>
            <p className="text-sm">FREE membership = 10% off at UQU outlets!</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📞 Need Help?</h3>
            <p className="text-sm">Book SAS appointment online or call during exam week: 0404 106 173</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-center space-x-6">
            <a href={UQU_DATA.organization.contact.social_media.facebook} className="text-gray-400 hover:text-purple-600">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={UQU_DATA.organization.contact.social_media.instagram} className="text-gray-400 hover:text-purple-600">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={UQU_DATA.organization.contact.website} className="text-gray-400 hover:text-purple-600">
              <Globe className="w-5 h-5" />
            </a>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            {UQU_DATA.organization.contact.location} | {UQU_DATA.organization.contact.hours}
          </p>
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
          <p className="text-sm opacity-90">Ask me anything about UQU services!</p>
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
              placeholder="Ask about support, food, clubs, events..."
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