import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Send, Bot, User, Sparkles, Plus, Monitor, ChevronDown, History, Trash2, Clock } from 'lucide-react';
import { generateChatResponse } from '../services/geminiService';
import { chatStorageService } from '../services/chatStorageService';
import Loader from '../Components/Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
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
    const loadSessions = async () => {
      const data = await chatStorageService.getSessions();
      setSessions(data);
    };
    loadSessions();
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      if (sessionId && sessionId !== 'new') {
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
  }, [sessionId]);

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

    if (activeSessionId === 'new') {
      activeSessionId = await chatStorageService.createSession();
      isFirstMessage = true;
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
    await chatStorageService.saveMessage(activeSessionId, userMsg, title);

    if (isFirstMessage) {
      navigate(`/dashboard/chat/${activeSessionId}`, { replace: true });
      setCurrentSessionId(activeSessionId);
    }

    const aiResponseText = await generateChatResponse(messages, userMsg.content);

    const modelMsg = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: aiResponseText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, modelMsg]);
    setIsLoading(false);
    await chatStorageService.saveMessage(activeSessionId, modelMsg);
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
    <div className="flex h-full w-full bg-transparent relative overflow-hidden">

      {/* Mobile History Backdrop */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm md:hidden"
            onClick={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar History - Dreamy Glass Style */}
      <motion.div
        className={`
          w-80 bg-white/40 backdrop-blur-3xl border-r border-white/60 flex flex-col flex-shrink-0
          absolute inset-y-0 left-0 z-[70] transition-all duration-500 ease-in-out
          md:relative md:translate-x-0 overflow-hidden
          ${showHistory ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-32 h-32 bg-[#8b5cf6]/20 rounded-full blur-2xl animate-blob"></div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">History<span className="text-[#8b5cf6]">.</span></h2>
          <button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-95 uppercase text-xs tracking-widest"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> New Instance
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-2 no-scrollbar">
          {sessions.map((session) => (
            <div key={session.sessionId} className="group relative">
              <button
                onClick={() => navigate(`/dashboard/chat/${session.sessionId}`)}
                className={`w-full text-left px-5 py-4 rounded-[20px] transition-all duration-300 truncate border
                  ${currentSessionId === session.sessionId
                    ? 'bg-white/80 text-[#8b5cf6] border-[#8b5cf6]/20 shadow-sm font-black'
                    : 'text-gray-500 border-transparent hover:bg-white/40 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Clock size={14} className={currentSessionId === session.sessionId ? 'text-[#8b5cf6]' : 'text-gray-400'} />
                  <div className="flex-1 truncate text-xs font-bold uppercase tracking-tight">{session.title || 'Untitled Session'}</div>
                </div>
              </button>
              <button
                onClick={(e) => handleDeleteSession(e, session.sessionId)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all scale-75"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="px-6 py-10 text-center">
              <div className="w-12 h-12 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/60">
                <History className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Memory Empty</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative bg-transparent w-full min-w-0">

        {/* Header - Transparent & Refined */}
        <div className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white/20 backdrop-blur-md border-b border-white/40 z-[50] shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              className="md:hidden p-3 bg-white/40 rounded-xl text-gray-500 hover:text-gray-900 border border-white/60 transition-all shrink-0"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] flex items-center justify-center text-white shadow-lg ring-2 ring-white/50 shrink-0 animate-pulse-glow">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter leading-none flex items-center gap-1.5">
                  AISA <sup className="text-[8px] font-bold text-[#8b5cf6]">TM</sup>
                </h3>
                <span className="text-[10px] font-bold text-[#8b5cf6] uppercase tracking-widest opacity-80">Online & Ready</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/40 border border-white/60 rounded-full text-xs font-bold text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              Neural Link Stable
            </div>
          </div>
        </div>

        {/* Messages - Fluid & Glassy */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-10 no-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-[#8b5cf6]/20 blur-[60px] rounded-full animate-blob"></div>
                <div className="relative w-32 h-32 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-full flex items-center justify-center shadow-glass ring-8 ring-white/20">
                  <Sparkles className="w-12 h-12 text-[#8b5cf6] animate-pulse-glow" />
                </div>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Initialize Logic<span className="text-[#8b5cf6]">.</span></h2>
              <p className="text-gray-500 font-medium max-w-sm leading-relaxed">Your advanced AI agent is calibrated and ready for interaction. How can we optimize your workflow today?</p>
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
                      ? 'bg-white/80 text-gray-900 border-white/40 rounded-tr-none'
                      : 'bg-white/40 text-gray-800 border-white/80 rounded-tl-none'
                      }`}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2 px-2">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • SYNCED
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-white/60 flex items-center justify-center text-[#8b5cf6] shadow-sm animate-pulse">
                    <Sparkles size={18} />
                  </div>
                  <div className="px-6 py-4 rounded-[28px] rounded-tl-none bg-white/20 backdrop-blur-md border border-white/40 flex items-center gap-2">
                    <Loader />
                    <span className="text-xs font-black text-[#8b5cf6] uppercase tracking-[0.2em] ml-2 animate-pulse">Processing Reality</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Floaty Glass Design */}
        <div className="p-4 md:p-8 lg:p-12 shrink-0 bg-transparent relative z-[60]">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#d946ef]/10 to-[#8b5cf6]/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Synchronize your intent..."
                className="w-full bg-white/60 backdrop-blur-3xl border border-white rounded-[32px] py-6 pl-8 pr-20 text-[15px] text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-[24px] bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale shadow-[0_10px_20px_rgba(168,85,247,0.3)] flex items-center justify-center group/btn"
              >
                <Send className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
              </button>
            </form>
            <p className="text-center mt-6 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 opacity-60">Neural Agent calibrated to V2.1 Protocols • AI-MALL™ SYSTEM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
