// Updated handleSendMessage function for the React component
// This replaces the mock AI response with real n8n/DeepSeek integration

const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage = inputMessage;
  setInputMessage('');
  setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
  setIsLoading(true);

  try {
    // Use environment variable for the webhook URL
    const webhookUrl = process.env.REACT_APP_N8N_WEBHOOK || 'http://localhost:5678/webhook/chat';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        context: {
          selectedArea: selectedArea,
          selectedCategory: selectedCategory,
          searchQuery: searchQuery
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    
    setMessages(prev => [...prev, { 
      type: 'bot', 
      content: data.response,
      suggestions: data.suggestions || []
    }]);

    // If the response includes navigation hints, handle them
    if (data.context_type) {
      switch (data.context_type) {
        case 'clubs':
          setSelectedArea('3_clubs_societies');
          break;
        case 'food':
          setSelectedArea('4_outlets');
          break;
        case 'support':
          setSelectedArea('2_sas');
          break;
        case 'volunteer':
          setSelectedArea('6_volunteers');
          break;
      }
    }

  } catch (error) {
    console.error('Error sending message:', error);
    
    // Fallback to local processing if n8n is not available
    const fallbackResponse = await processUserMessage(userMessage);
    setMessages(prev => [...prev, { type: 'bot', content: fallbackResponse }]);
  } finally {
    setIsLoading(false);
  }
};

// Enhanced message component to show suggestions
const MessageComponent = ({ message }) => {
  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${message.type === 'user' ? '' : 'space-y-2'}`}>
        <div
          className={`rounded-lg p-3 ${
            message.type === 'user'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <p className="whitespace-pre-line">{message.content}</p>
        </div>
        
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(suggestion);
                  handleSendMessage();
                }}
                className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Environment variables to add to .env file:
/*
REACT_APP_N8N_WEBHOOK=http://localhost:5678/webhook/chat
REACT_APP_API_URL=http://localhost:3001

For production:
REACT_APP_N8N_WEBHOOK=https://your-n8n-instance.com/webhook/chat
REACT_APP_API_URL=https://your-api.com
*/

// Example of how to set up the n8n workflow webhook node:
const n8nWebhookConfig = {
  "parameters": {
    "httpMethod": "POST",
    "path": "chat",
    "responseMode": "responseNode",
    "options": {
      "cors": {
        "allowedOrigins": "*"  // In production, specify your domain
      }
    }
  }
};

// Function to test the n8n connection
const testN8nConnection = async () => {
  try {
    const response = await fetch(process.env.REACT_APP_N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'test', 
        context: {} 
      })
    });
    
    if (response.ok) {
      console.log('✅ n8n connection successful');
    } else {
      console.log('❌ n8n connection failed:', response.status);
    }
  } catch (error) {
    console.log('❌ n8n not reachable:', error.message);
  }
};

// Call this on component mount to verify connection
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    testN8nConnection();
  }
}, []);