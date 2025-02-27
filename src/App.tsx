import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, X, Info, CheckCircle2, Settings, Zap, Database, Filter } from 'lucide-react';
import { fetchCDPAnswer } from './services/cdpService';
import { Message, CDPPlatform } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I can help you with questions about Segment, mParticle, Lytics, and Zeotap. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<CDPPlatform[]>([
    'Segment', 'mParticle', 'Lytics', 'Zeotap'
  ]);
  const [showAllExamples, setShowAllExamples] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await fetchCDPAnswer(inputValue, selectedPlatforms);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlatform = (platform: CDPPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Hello! I can help you with questions about Segment, mParticle, Lytics, and Zeotap. How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  const basicExampleQuestions = [
    {
      text: "How do I set up a new source in Segment?",
      platform: "Segment",
      icon: <Database className="h-3 w-3" />
    },
    {
      text: "How can I create a user profile in mParticle?",
      platform: "mParticle",
      icon: <User className="h-3 w-3" />
    },
    {
      text: "How do I build an audience segment in Lytics?",
      platform: "Lytics",
      icon: <Filter className="h-3 w-3" />
    },
    {
      text: "How can I integrate my data with Zeotap?",
      platform: "Zeotap",
      icon: <Zap className="h-3 w-3" />
    }
  ];

  const advancedExampleQuestions = [
    {
      text: "How does Segment's audience creation compare to mParticle's?",
      platforms: ["Segment", "mParticle"],
      icon: <Filter className="h-3 w-3" />
    },
    {
      text: "What's the difference between identity resolution in Segment and Zeotap?",
      platforms: ["Segment", "Zeotap"],
      icon: <User className="h-3 w-3" />
    },
    {
      text: "How do I implement consent management in mParticle?",
      platform: "mParticle",
      icon: <CheckCircle2 className="h-3 w-3" />
    },
    {
      text: "How can I use behavioral scoring in Lytics?",
      platform: "Lytics",
      icon: <Zap className="h-3 w-3" />
    },
    {
      text: "How do I track events with Segment?",
      platform: "Segment",
      icon: <Zap className="h-3 w-3" />
    },
    {
      text: "How can I enrich customer data in Zeotap?",
      platform: "Zeotap",
      icon: <Database className="h-3 w-3" />
    },
    {
      text: "How do I set up data planning in mParticle?",
      platform: "mParticle",
      icon: <Settings className="h-3 w-3" />
    },
    {
      text: "How can I implement personalization with Lytics?",
      platform: "Lytics",
      icon: <User className="h-3 w-3" />
    }
  ];

  const getPlatformColor = (platform: CDPPlatform) => {
    switch(platform) {
      case 'Segment': return 'bg-purple-500';
      case 'mParticle': return 'bg-blue-500';
      case 'Lytics': return 'bg-green-500';
      case 'Zeotap': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlatformTextColor = (platform: CDPPlatform) => {
    switch(platform) {
      case 'Segment': return 'text-purple-700';
      case 'mParticle': return 'text-blue-700';
      case 'Lytics': return 'text-green-700';
      case 'Zeotap': return 'text-orange-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200`}>
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b py-4 shadow-sm sticky top-0 z-10`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">CDP Support Agent</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button 
              onClick={clearChat}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              aria-label="Clear chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4 flex flex-col">
          <div className={`flex-1 rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`flex max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-l-lg rounded-br-lg' 
                        : `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-r-lg rounded-bl-lg`
                    } p-4 shadow-sm`}
                  >
                    <div className={`mr-3 ${message.sender === 'user' ? 'text-blue-200' : darkMode ? 'text-blue-300' : 'text-blue-500'}`}>
                      {message.sender === 'user' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-200' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-r-lg rounded-bl-lg p-4 shadow-sm flex items-center`}>
                    <Bot className={`h-5 w-5 mr-3 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className={`border-t p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about CDP platforms..."
                  className={`flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  } border`}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-lg px-4 py-3 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors`}
                  disabled={isLoading || !inputValue.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="md:w-1/4">
          <div className={`rounded-lg shadow-md p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-bold mb-4">CDP Platforms</h2>
            <div className="space-y-3">
              {(['Segment', 'mParticle', 'Lytics', 'Zeotap'] as CDPPlatform[]).map((platform) => (
                <div key={platform} className="flex items-center">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={platform}
                      checked={selectedPlatforms.includes(platform)}
                      onChange={() => togglePlatform(platform)}
                      className="sr-only"
                    />
                    <div 
                      className={`w-5 h-5 rounded border ${
                        selectedPlatforms.includes(platform)
                          ? `${getPlatformColor(platform)} border-transparent`
                          : darkMode ? 'border-gray-600' : 'border-gray-300'
                      } cursor-pointer transition-colors`}
                      onClick={() => togglePlatform(platform)}
                    >
                      {selectedPlatforms.includes(platform) && (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label 
                    htmlFor={platform} 
                    className={`ml-2 cursor-pointer ${
                      selectedPlatforms.includes(platform) 
                        ? getPlatformTextColor(platform) 
                        : darkMode ? 'text-gray-300' : 'text-gray-700'
                    } font-medium`}
                  >
                    {platform}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-bold">Example Questions</h3>
                <button 
                  onClick={() => setShowAllExamples(!showAllExamples)}
                  className={`text-xs px-2 py-1 rounded ${
                    darkMode 
                      ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  } transition-colors`}
                >
                  {showAllExamples ? 'Show Less' : 'Show More'}
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} border-b pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    Basic Questions
                  </h4>
                  <ul className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2.5`}>
                    {basicExampleQuestions.map((q, idx) => (
                      <li 
                        key={idx} 
                        className={`cursor-pointer hover:${getPlatformTextColor(q.platform as CDPPlatform)} flex items-start transition-colors rounded-md -mx-2 px-2 py-1.5 ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setInputValue(q.text)}
                      >
                        <span className={`inline-block w-5 h-5 rounded-full ${getPlatformColor(q.platform as CDPPlatform)} flex items-center justify-center text-white mr-2 mt-0.5`}>
                          {q.icon}
                        </span>
                        <span>{q.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {showAllExamples && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} border-b pb-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      Advanced Questions
                    </h4>
                    <ul className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-2.5`}>
                      {advancedExampleQuestions.map((q, idx) => (
                        <li 
                          key={idx} 
                          className={`cursor-pointer flex items-start transition-colors rounded-md -mx-2 px-2 py-1.5 ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            setInputValue(q.text);
                            // If it's a comparison question, ensure both platforms are selected
                            if (q.platforms) {
                              setSelectedPlatforms(prev => {
                                const newSelection = [...prev];
                                q.platforms?.forEach(platform => {
                                  if (!newSelection.includes(platform as CDPPlatform)) {
                                    newSelection.push(platform as CDPPlatform);
                                  }
                                });
                                return newSelection;
                              });
                            }
                          }}
                        >
                          <span className={`inline-block w-5 h-5 rounded-full ${
                            q.platforms 
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                              : getPlatformColor(q.platform as CDPPlatform)
                          } flex items-center justify-center text-white mr-2 mt-0.5`}>
                            {q.icon}
                          </span>
                          <span>{q.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`mt-8 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
              <div className="flex items-center mb-3">
                <Info className={`h-4 w-4 ${darkMode ? 'text-blue-300' : 'text-blue-600'} mr-2`} />
                <h3 className={`text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>Pro Tips</h3>
              </div>
              <ul className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-700'} space-y-2`}>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 mt-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  </span>
                  Select multiple platforms for comparison questions
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 mt-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  </span>
                  Be specific about the task you want to accomplish
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 mt-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  </span>
                  Try asking "How do I..." questions for best results
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2 mt-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                  </span>
                  Click on example questions to try them out
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;