import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Send, Bot, User, Sparkles, Plus, Monitor, ChevronDown, History, Trash2, Clock, Video, Mic } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import { chatStorageService } from '../services/chatStorageService';
import Loader from '../Components/Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { themeState, chatHistoryState } from '../userStore/userData';
import { useLanguage } from '../context/LanguageContext';
import './Chat.css';

const Chat = () => {
  const theme = useRecoilValue(themeState);
  const chatHistoryStateValue = useRecoilValue(chatHistoryState);
  const isChatHistoryEnabled = chatHistoryStateValue === 'ON';
  const isDark = theme === 'Dark';
  const { t } = useLanguage();
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentSessionId, setCurrentSessionId] = useState(sessionId || 'new');

  useEffect(() => {
    if (!isChatHistoryEnabled) {
      setSessions([]);
      return;
    }
    const loadSessions = async () => {
      const data = await chatStorageService.getSessions();
      setSessions(data);
    };
    loadSessions();
  }, [messages, isChatHistoryEnabled]);

  useEffect(() => {
    const initChat = async () => {
      if (sessionId && sessionId !== 'new' && isChatHistoryEnabled) {
        setCurrentSessionId(sessionId);
        const history = await chatStorageService.getHistory(sessionId);
        setMessages(history);
      } else {
        setCurrentSessionId('new');
        setMessages([]);
      }
      setShowHistory(false);
    };
    initChat();
  }, [sessionId, isChatHistoryEnabled]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleNewChat = async () => {
    const newId = await chatStorageService.createSession();
    navigate(`/dashboard/chat/${newId}`);
    setShowHistory(false);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    let activeSessionId = currentSessionId;
    let isFirstMessage = false;

    if (activeSessionId === 'new' && isChatHistoryEnabled) {
      activeSessionId = await chatStorageService.createSession();
      isFirstMessage = true;
    } else if (activeSessionId === 'new') {
      activeSessionId = 'temp-' + Date.now();
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const title = isFirstMessage ? userMsg.content.slice(0, 30) + '...' : undefined;

    if (isFirstMessage && isChatHistoryEnabled) {
      navigate(`/dashboard/chat/${activeSessionId}`, { replace: true });
      setCurrentSessionId(activeSessionId);
    }

    // Pass the current messages PLUS the new user message to the AI
    const aiResponseText = await generateChatResponse(
      isChatHistoryEnabled ? [...messages, userMsg] : [],
      userMsg.content,
      isChatHistoryEnabled ? activeSessionId : 'ephemeral',
      isChatHistoryEnabled ? title : undefined
    );

    const modelMsg = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: aiResponseText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, modelMsg]);
    setIsLoading(false);
    // No need to call chatStorageService.saveMessage here anymore, 
    // as the backend handles it inside generateChatResponse (apis.chatAgent)
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat history?')) {
      await chatStorageService.deleteSession(id);
      const data = await chatStorageService.getSessions();
      setSessions(data);
      if (currentSessionId === id) {
        navigate('/dashboard/chat/new');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex h-full w-full bg-transparent relative overflow-hidden transition-colors duration-700 ${isDark ? 'text-white' : 'text-slate-900'}`}>

      {/* Mobile History Backdrop */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-[#0f172a]/40 backdrop-blur-sm md:hidden"
            onClick={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar History - Dreamy Glass Style */}
      <motion.div
        className={`
          w-80 ${isDark ? 'bg-[#0f172a] border-white/5 shadow-[20px_0_40px_rgba(0,0,0,0.2)]' : 'bg-white/40 border-white/60'} backdrop-blur-3xl border-r flex flex-col flex-shrink-0
          absolute inset-y-0 left-0 z-[70] transition-all duration-500 ease-in-out
          md:relative md:translate-x-0 overflow-hidden
          ${showHistory ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-[#8b5cf6]/20 rounded-full blur-2xl animate-blob"></div>
        </div>

        <div className="p-8">
          <h2 className={`text-2xl font-black tracking-tight mb-6 transition-colors ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'}`}>
            {t('history')}<span className="text-[#8B5CF6]">.</span>
          </h2>
          <button
            onClick={handleNewChat}
            className="w-full bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(139,92,246,0.3)] hover:shadow-[#8B5CF6]/20 hover:scale-[1.02] active:scale-95 uppercase text-xs tracking-widest"
          >
            {t('chatHistory')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 no-scrollbar">
          {sessions.map((session) => (
            <div key={session.sessionId} className="group relative">
              <button
                onClick={() => {
                  navigate(`/dashboard/chat/${session.sessionId}`);
                  setShowHistory(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-[20px] transition-all duration-300 truncate border
                  ${currentSessionId === session.sessionId
                    ? `${isDark ? 'bg-[#242f49] border-[#8B5CF6]/40 text-[#f1f5f9] shadow-[0_10px_30px_rgba(139,92,246,0.1)]' : 'bg-white/80 border-[#8b5cf6]/20 text-[#8b5cf6]'} shadow-sm font-black`
                    : `${isDark ? 'text-[#94a3b8] border-transparent hover:bg-white/5 hover:text-[#f1f5f9]' : 'text-gray-500 border-transparent hover:bg-white/40 hover:text-gray-900'}`
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Clock size={14} className={currentSessionId === session.sessionId ? 'text-[#8B5CF6]' : `${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`} />
                  <div className="flex-1 truncate text-xs font-bold uppercase tracking-tight">{(session.title?.toUpperCase() === 'NEW CHAT' || !session.title) ? t('untitledSession') : session.title}</div>
                </div>
              </button>
              <button
                onClick={(e) => handleDeleteSession(e, session.sessionId)}
                className={`absolute right-4 top-[55%] -translate-y-1/2 p-2 text-red-500 hover:text-red-600 transition-all scale-110 chat-delete-btn 
                  ${isDark ? 'opacity-0 group-hover:opacity-100' : 'opacity-60 hover:opacity-100'}
                `}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="px-6 py-10 text-center">
              <div className={`w-12 h-12 ${isDark ? 'bg-[#12182B] border-white/5' : 'bg-white/40 border-white/60'} rounded-2xl flex items-center justify-center mx-auto mb-4 border`}>
                <History className={`w-6 h-6 ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`} />
              </div>
              <p className={`text-[10px] uppercase font-black tracking-widest ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`}>{t('memoryEmpty')}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Area */}
      <div className={`flex-1 flex flex-col relative ${isDark ? 'bg-[#1a2235]' : 'bg-transparent'} w-full min-w-0`}>

        {/* Header - Transparent & Refined */}
        <div className={`h-20 flex items-center justify-between px-6 sm:px-10 ${isDark ? 'bg-[#1a2235]/80 border-white/5' : 'bg-white/20 border-white/40'} backdrop-blur-md border-b z-[50] shrink-0 transition-colors`}>
          <div className="flex items-center gap-4 min-w-0">
            <button
              className={`md:hidden p-3 ${isDark ? 'bg-[#242f49]' : 'bg-white/40'} rounded-xl text-gray-500 hover:text-gray-900 border ${isDark ? 'border-[#8B5CF6]/10' : 'border-white/60'} transition-all shrink-0`}
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className={`w-5 h-5 ${isDark ? 'text-[#f1f5f9]' : 'text-gray-500'}`} />
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <img src="/AISA (2).svg" alt="AISA Logo" className="w-10 h-10 object-contain" />
              <div className="flex flex-col">
                <h3 className={`text-xl font-black uppercase tracking-tighter leading-none transition-colors ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'}`}>
                  {t('aisa')}
                </h3>
                <span className={`text-[11px] font-bold ${isDark ? 'text-[#8B5CF6]' : 'text-[#8b5cf6]'} uppercase tracking-widest opacity-80`}>{t('onlineReady')}</span>
              </div>
            </div>
          </div>
        </div>

        {!isChatHistoryEnabled && (
          <div className={`px-10 py-3 ${isDark ? 'bg-[#ef4444]/10 border-b border-[#ef4444]/20' : 'bg-red-50 border-b border-red-100'} flex items-center justify-center gap-2 animate-in slide-in-from-top duration-500`}>
            <History size={14} className="text-[#ef4444]" />
            <span className={`text-[10px] uppercase font-black tracking-widest ${isDark ? 'text-[#ef4444]' : 'text-red-500'}`}>{t('ephemeralModeMsg')}</span>
          </div>
        )}

        {/* Messages - Fluid & Glassy */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-10 no-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="relative mb-2">
                <div className="absolute inset-0 bg-[#8B5CF6]/30 blur-[100px] rounded-full animate-blob"></div>
                <div className="relative flex items-center justify-center">
                  <img src="/AISA (2).svg" alt="AISA Logo" className="w-32 h-32 object-contain" />
                </div>
              </div>
              <h2 className={`text-4xl mb-4 tracking-tighter uppercase transition-colors ${isDark ? 'text-[#f1f5f9] font-black' : 'text-gray-900 font-black'}`}>
                {t('initializeLogic')}<span className="text-[#8B5CF6]">.</span>
              </h2>
              <p className={`${isDark ? 'text-[#C7CBEA]' : 'text-gray-500'} font-medium max-w-sm leading-relaxed transition-colors`}>{t('chatGreeting')}</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white'
                    : 'bg-white text-[#8b5cf6] border border-white/60'
                    }`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={22} />}
                  </div>

                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                    <div className={`px-6 py-4 rounded-[28px] text-[15px] font-medium leading-relaxed shadow-glass backdrop-blur-3xl border transition-all hover:shadow-xl ${msg.role === 'user'
                      ? `${isDark ? 'bg-[#12182B] border-[#8B5CF6]/20 text-white' : 'bg-white/80 text-gray-900 border-white/40'} rounded-tr-none shadow-[0_10px_30px_rgba(0,0,0,0.1)]`
                      : `${isDark ? 'bg-[#1e293b] border-white/5 text-white' : 'bg-white/40 text-gray-800 border-white/80'} rounded-tl-none`
                      }`}>
                      {msg.content}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'} mt-2 px-2`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {t('synced')}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-white/60 flex items-center justify-center text-[#8b5cf6]">
                    <Sparkles size={18} />
                  </div>
                  <div className={`px-6 py-4 rounded-[28px] rounded-tl-none ${isDark ? 'bg-[#242f49] border-white/5' : 'bg-white/20 border-white/40'} backdrop-blur-md border flex items-center gap-2 transition-colors`}>
                    <Loader />
                    <span className="text-xs font-black text-[#8b5cf6] uppercase tracking-[0.2em] ml-2 animate-pulse">{t('processingReality')}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Floaty Glass Design */}
        <div className={`p-4 md:p-8 lg:p-12 shrink-0 bg-transparent relative z-[60] ${isDark ? 'border-t border-white/5 bg-[#1a2235]/50 backdrop-blur-xl' : ''}`}>
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button
              className="w-[60px] h-[60px] shrink-0 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all shadow-blue-500/20"
              type="button"
            >
              <Plus className="w-6 h-6" />
            </button>

            <form onSubmit={handleSendMessage} className="relative flex-1 group">
              <div className="absolute inset-0 bg-blue-500/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('askPlaceholder')}
                className={`w-full h-[60px] ${isDark ? 'bg-[#1a2235] border-white/20 text-white placeholder-[#6F76A8]' : 'bg-white/60 border-white text-gray-900 placeholder-gray-400'} backdrop-blur-3xl border rounded-[32px] pl-6 pr-14 md:pr-48 py-4 text-[13px] md:text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all resize-none overflow-y-auto no-scrollbar`}
              />

              <div className="absolute right-6 top-0 h-full flex items-center gap-2">
                <button type="button" className={`p-2.5 ${isDark ? 'text-[#8B5CF6] hover:bg-white/5' : 'text-[#3b82f6] hover:bg-blue-50'} transition-colors rounded-full flex items-center justify-center`}>
                  <Video className="w-5 h-5" />
                </button>
                <button type="button" className={`p-2.5 ${isDark ? 'text-[#8B5CF6] hover:bg-white/5' : 'text-[#3b82f6] hover:bg-blue-50'} transition-colors rounded-full flex items-center justify-center`}>
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md flex items-center justify-center shadow-[#8B5CF6]/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;
