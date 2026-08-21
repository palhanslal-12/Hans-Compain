import React, { useState } from 'react';
import { 
  History, MessageSquare, Trash2, Pin, Edit2, Check, X, Search, 
  Sparkles, Calendar, Clock, ArrowRight, BookOpen, HelpCircle, Activity
} from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: any[];
  isPinned?: boolean;
}

interface ActivityLog {
  id: string;
  type: 'timer' | 'quiz' | 'note' | 'chat';
  title: string;
  subtitle: string;
  score?: string;
  timestamp: string;
}

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'hindi' | 'english';
  savedChats: ChatSession[];
  currentChatSessionId: string | null;
  onLoadChat: (chat: ChatSession) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onPinChat: (id: string) => void;
  onClearAllChats: () => void;
  activityLogs?: ActivityLog[];
  onClearActivityLog?: (id: string) => void;
  onStartNewChat?: () => void;
}

export const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  isOpen,
  onClose,
  language,
  savedChats = [],
  currentChatSessionId,
  onLoadChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  onClearAllChats,
  activityLogs = [],
  onClearActivityLog,
  onStartNewChat
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'activity'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  if (!isOpen) return null;

  const filteredChats = (Array.isArray(savedChats) ? savedChats : []).filter(chat => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = chat.title && chat.title.toLowerCase().includes(q);
    const matchesMsg = chat.messages && Array.isArray(chat.messages) && chat.messages.some((m: any) => 
      m && m.content && String(m.content).toLowerCase().includes(q)
    );
    return matchesTitle || matchesMsg;
  });

  const filteredActivity = (Array.isArray(activityLogs) ? activityLogs : []).filter(log => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (log.title && log.title.toLowerCase().includes(q)) || 
           (log.subtitle && log.subtitle.toLowerCase().includes(q));
  });

  // Group chats by date
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  const last7DaysStart = todayStart - 7 * 24 * 60 * 60 * 1000;

  const pinned: ChatSession[] = [];
  const today: ChatSession[] = [];
  const yesterday: ChatSession[] = [];
  const last7Days: ChatSession[] = [];
  const older: ChatSession[] = [];

  filteredChats.forEach(chat => {
    if (chat.isPinned) {
      pinned.push(chat);
      return;
    }
    const chatTime = chat.timestamp ? new Date(chat.timestamp).getTime() : 0;
    if (chatTime >= todayStart) {
      today.push(chat);
    } else if (chatTime >= yesterdayStart) {
      yesterday.push(chat);
    } else if (chatTime >= last7DaysStart) {
      last7Days.push(chat);
    } else {
      older.push(chat);
    }
  });

  const chatGroups = [
    { label: language === 'hindi' ? '📌 पिन की गई चैट्स (Pinned)' : '📌 Pinned Chats', list: pinned },
    { label: language === 'hindi' ? 'आज (Today)' : 'Today', list: today },
    { label: language === 'hindi' ? 'कल (Yesterday)' : 'Yesterday', list: yesterday },
    { label: language === 'hindi' ? 'पिछले 7 दिन (Previous 7 Days)' : 'Previous 7 Days', list: last7Days },
    { label: language === 'hindi' ? 'पुरानी चैट्स (Older)' : 'Older', list: older }
  ].filter(g => g.list.length > 0);

  const handleStartEditing = (chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditingTitle(chat.title || '');
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameChat(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div 
      className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#080D1A] border border-slate-700/80 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-[#0C1222] via-[#0E162B] to-[#0C1222] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-md">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{language === 'hindi' ? 'इतिहास व पिछली बातचीत' : 'Chat & Search History'}</span>
                <span className="text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                  {savedChats.length} {language === 'hindi' ? 'चैट्स' : 'sessions'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hindi' 
                  ? 'अपनी सभी पिछली AI चैट, सवाल व अध्ययन रिकॉर्ड्स यहाँ से देखें व तुरंत खोलें' 
                  : 'Review, search, pin, or resume your past AI conversations & study sessions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onStartNewChat && (
              <button
                onClick={() => {
                  onStartNewChat();
                  onClose();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer border-none"
              >
                <span>+ {language === 'hindi' ? 'नया चैट' : 'New Chat'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border-none"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS & SEARCH BAR */}
        <div className="p-3 sm:px-5 sm:py-3.5 border-b border-slate-800/80 bg-[#060A14] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('chats')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'chats'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{language === 'hindi' ? 'सहेजी गई चैट्स' : 'Saved Chats'} ({savedChats.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeTab === 'activity'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{language === 'hindi' ? 'अध्ययन एक्टिविटी' : 'Activity Logs'} ({activityLogs.length})</span>
            </button>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hindi' ? "इतिहास में खोजें (Search)..." : "Search past conversations..."}
              className="w-full text-xs py-2 pl-8 pr-7 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* MAIN BODY: SCROLLABLE LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'chats' ? (
            <div>
              {savedChats.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-3xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-2xl text-indigo-400 shadow-inner">
                    💬
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {language === 'hindi' ? 'कोई चैट इतिहास मौजूद नहीं है' : 'No Chat History Found'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {language === 'hindi'
                      ? 'जब आप AI से कोई प्रश्न पूछते हैं, तो वह चैट सत्र यहाँ स्वचालित रूप से सुरक्षित हो जाता है।'
                      : 'When you ask questions to HansAI, your conversation sessions will automatically be stored here for future revision.'}
                  </p>
                  {onStartNewChat && (
                    <button
                      onClick={() => {
                        onStartNewChat();
                        onClose();
                      }}
                      className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-none"
                    >
                      + {language === 'hindi' ? 'पहला चैट शुरू करें' : 'Start Your First Chat'}
                    </button>
                  )}
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  {language === 'hindi' ? `"${searchQuery}" से मेल खाती कोई चैट नहीं मिली।` : `No chats match "${searchQuery}".`}
                </div>
              ) : (
                <div className="space-y-4">
                  {chatGroups.map(group => (
                    <div key={group.label} className="space-y-2">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">
                        {group.label} ({group.list.length})
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {group.list.map(chat => {
                          const isActive = currentChatSessionId === chat.id;
                          const isEditing = editingId === chat.id;
                          const firstMsg = chat.messages && chat.messages[0]?.content;
                          const formattedTime = chat.timestamp 
                            ? new Date(chat.timestamp).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'Past Session';

                          return (
                            <div
                              key={chat.id}
                              onClick={() => {
                                if (!isEditing) {
                                  onLoadChat(chat);
                                  onClose();
                                }
                              }}
                              className={`group p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between relative ${
                                isActive
                                  ? 'bg-indigo-950/60 border-indigo-500/60 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-400/40'
                                  : 'bg-[#0B1020] hover:bg-[#121930] border-slate-800 hover:border-indigo-500/40'
                              }`}
                            >
                              <div className="space-y-1.5">
                                {/* Title and badges */}
                                <div className="flex items-start justify-between gap-2">
                                  {isEditing ? (
                                    <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="text"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSaveRename(chat.id, e);
                                          if (e.key === 'Escape') setEditingId(null);
                                        }}
                                        autoFocus
                                        className="w-full text-xs bg-slate-900 border border-indigo-500 rounded-lg px-2 py-1 text-white focus:outline-none"
                                      />
                                      <button
                                        onClick={(e) => handleSaveRename(chat.id, e)}
                                        className="p-1 bg-emerald-600 text-white rounded cursor-pointer"
                                        title="Save"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                                        className="p-1 bg-slate-700 text-slate-300 rounded cursor-pointer"
                                        title="Cancel"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-300' : 'text-indigo-400'}`} />
                                        <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                                          {chat.title || 'Chat Session'}
                                        </h5>
                                        {chat.isPinned && (
                                          <span className="text-[11px] text-amber-400 shrink-0" title="Pinned">📌</span>
                                        )}
                                        {isActive && (
                                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase shrink-0">
                                            Active
                                          </span>
                                        )}
                                      </div>

                                      {/* Controls */}
                                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                        <button
                                          onClick={() => onPinChat(chat.id)}
                                          className={`p-1 rounded hover:bg-slate-800 text-xs transition-colors cursor-pointer border-none ${
                                            chat.isPinned ? 'text-amber-400' : 'text-slate-500 hover:text-amber-300'
                                          }`}
                                          title={chat.isPinned ? "Unpin" : "Pin to Top"}
                                        >
                                          📌
                                        </button>
                                        <button
                                          onClick={(e) => handleStartEditing(chat, e)}
                                          className="p-1 text-slate-500 hover:text-indigo-300 rounded hover:bg-slate-800 text-xs transition-colors cursor-pointer border-none"
                                          title="Rename"
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          onClick={() => onDeleteChat(chat.id)}
                                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 text-xs transition-colors cursor-pointer border-none"
                                          title="Delete"
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>

                                {/* Preview content */}
                                {firstMsg && (
                                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                    {typeof firstMsg === 'string' ? firstMsg : 'Message preview'}
                                  </p>
                                )}
                              </div>

                              {/* Footer with meta info */}
                              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formattedTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                                    {chat.messages ? chat.messages.length : 0} msgs
                                  </span>
                                  <span className="text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                                    {language === 'hindi' ? 'खोलें' : 'Open'} <ArrowRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ACTIVITY LOG TAB */
            <div className="space-y-3">
              {activityLogs.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-950/60 flex items-center justify-center text-xl text-indigo-400">
                    📜
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'hindi' ? 'कोई अध्ययन एक्टिविटी दर्ज नहीं है' : 'No Study Activity Logs Yet'}
                  </h4>
                </div>
              ) : filteredActivity.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No activity matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredActivity.map(log => (
                    <div 
                      key={log.id}
                      className="p-3 rounded-xl bg-[#0B1020] border border-slate-800 flex items-center justify-between gap-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-sm shrink-0">
                          {log.type === 'quiz' ? '🎯' : log.type === 'timer' ? '⏱️' : log.type === 'note' ? '📝' : '💬'}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{log.title}</span>
                            {log.score && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                                {log.score}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-md">
                            {log.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {onClearActivityLog && (
                          <button
                            onClick={() => onClearActivityLog(log.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 bg-transparent border-none cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3.5 sm:px-5 sm:py-3.5 border-t border-slate-800 bg-[#060A14] flex items-center justify-between gap-2 shrink-0">
          <div>
            {savedChats.length > 0 && activeTab === 'chats' && (
              <button
                onClick={onClearAllChats}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'hindi' ? 'सभी चैट इतिहास मिटाएं' : 'Clear All History'}</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
          >
            {language === 'hindi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
