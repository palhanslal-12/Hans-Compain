import React, { useState, useEffect, useRef } from 'react';
import { 
  BookmarkPlus, 
  Check, 
  FolderPlus, 
  X, 
  Sparkles, 
  ChevronRight, 
  Tag, 
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';

export interface FolderItem {
  id: string;
  name: string;
  emoji: string;
  color?: string;
}

export interface QuickSaveNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  folders: FolderItem[];
  onCreateFolder: (name: string, emoji?: string) => string; // returns created folder ID
  onSaveNote: (note: {
    folderId: string;
    title: string;
    content: string;
    tags: string[];
  }) => void;
  onOpenNotesView?: () => void;
  language?: 'english' | 'hindi';
}

export const QuickSaveNotesModal: React.FC<QuickSaveNotesModalProps> = ({
  isOpen,
  onClose,
  selectedText,
  folders,
  onCreateFolder,
  onSaveNote,
  onOpenNotesView,
  language = 'hindi'
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folders[0]?.id || 'general');
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteTags, setNoteTags] = useState<string>('GK, Revision');
  const [isCreatingNewFolder, setIsCreatingNewFolder] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [newFolderEmoji, setNewFolderEmoji] = useState<string>('📁');
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsSavedSuccessfully(false);
      setNoteContent(selectedText || '');
      
      // Generate clean default title from the first line or first few words
      const cleanSnippet = (selectedText || '').trim().replace(/^([•\-\*#0-9\.\s]+)/, '');
      const firstLine = cleanSnippet.split('\n')[0]?.trim() || '';
      const autoTitle = firstLine.length > 50 
        ? `${firstLine.substring(0, 48)}...` 
        : (firstLine || (language === 'hindi' ? 'अध्ययन नोट्स' : 'Study Note'));
      
      setNoteTitle(autoTitle);
      
      // Auto assign tags based on text content
      const lower = selectedText.toLowerCase();
      const tagsList: string[] = [];
      if (lower.includes('steno') || lower.includes('shorthand') || lower.includes('आशुलिपि')) tagsList.push('Steno');
      if (lower.includes('ssc') || lower.includes('cgl') || lower.includes('chsl')) tagsList.push('SSC');
      if (lower.includes('history') || lower.includes('इतिहास')) tagsList.push('History');
      if (lower.includes('geography') || lower.includes('भूगोल')) tagsList.push('Geography');
      if (lower.includes('polity') || lower.includes('संविधान') || lower.includes('article')) tagsList.push('Polity');
      if (lower.includes('science') || lower.includes('विज्ञान') || lower.includes('physics')) tagsList.push('Science');
      if (tagsList.length === 0) tagsList.push('Important', 'Notes');
      
      setNoteTags(tagsList.join(', '));
      
      if (folders.length > 0 && !folders.some(f => f.id === selectedFolderId)) {
        setSelectedFolderId(folders[0].id);
      }
    }
  }, [isOpen, selectedText, folders]);

  if (!isOpen) return null;

  const handleCreateAndSelectFolder = () => {
    if (!newFolderName.trim()) return;
    const newId = onCreateFolder(newFolderName.trim(), newFolderEmoji);
    setSelectedFolderId(newId);
    setNewFolderName('');
    setIsCreatingNewFolder(false);
  };

  const handleSave = () => {
    if (!noteContent.trim()) return;
    
    const parsedTags = noteTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onSaveNote({
      folderId: selectedFolderId,
      title: noteTitle.trim() || (language === 'hindi' ? 'त्वरित नोट्स' : 'Quick Note'),
      content: noteContent.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['Study']
    });

    setIsSavedSuccessfully(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const emojiOptions = ['📁', '📚', '⚡', '✍️', '🏛️', '🚩', '🔬', '💡', '🎯', '🔥'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-left">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0F1424] to-[#080B14] border-2 border-pink-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto custom-scrollbar space-y-4">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-600/30 shrink-0">
            <BookmarkPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{language === 'hindi' ? 'त्वरित नोट्स में सेव करें' : 'Quick Save to Notes'}</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-mono">
                Smart Folders 📂
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hindi' 
                ? 'चयनित उत्तर को सीधे अपने स्मार्ट फ़ोल्डर में सुरक्षित रखें' 
                : 'Instantly organize selected response text into your study notebook'}
            </p>
          </div>
        </div>

        {isSavedSuccessfully ? (
          <div className="py-8 text-center space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              {language === 'hindi' ? '✅ नोट्स सफलतापूर्वक सेव हो गए!' : '✅ Saved to Notes Successfully!'}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {language === 'hindi' 
                ? 'आप इसे साइडबार के "Notes & Folders" में कभी भी पढ़ या PDF बना सकते हैं।' 
                : 'You can review and export your notes anytime from the Notes & Folders view.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            
            {/* 1. Folder Selection Dropdown / Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>📂</span>
                  <span>{language === 'hindi' ? 'लक्ष्य फ़ोल्डर चुनें:' : 'Select Target Folder:'}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewFolder(!isCreatingNewFolder)}
                  className="text-[11px] text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>{isCreatingNewFolder ? (language === 'hindi' ? 'रद्द करें' : 'Cancel') : (language === 'hindi' ? '+ नया फ़ोल्डर' : '+ New Folder')}</span>
                </button>
              </div>

              {/* Inline Folder Creator */}
              {isCreatingNewFolder && (
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-pink-500/40 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                      {emojiOptions.slice(0, 5).map(em => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setNewFolderEmoji(em)}
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer ${
                            newFolderEmoji === em ? 'bg-pink-600 text-white' : 'hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder={language === 'hindi' ? "फ़ोल्डर का नाम (e.g. SSC Steno PYQ)" : "Folder Name..."}
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateAndSelectFolder();
                        }
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 text-xs px-2.5 py-1.5 rounded-lg text-white placeholder-slate-500 outline-none focus:border-pink-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreateAndSelectFolder}
                      className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      {language === 'hindi' ? 'बनाएं' : 'Create'}
                    </button>
                  </div>
                </div>
              )}

              {/* Folders Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-1">
                {folders.map(folder => {
                  const isSelected = selectedFolderId === folder.id;
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setSelectedFolderId(folder.id)}
                      className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all cursor-pointer truncate ${
                        isSelected 
                          ? 'bg-gradient-to-r from-pink-950/70 to-indigo-950/70 border-pink-500 text-pink-200 font-bold shadow-sm' 
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm shrink-0">{folder.emoji || '📁'}</span>
                      <span className="text-xs truncate">{folder.name.split('/')[0].trim()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Note Title Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                <span>{language === 'hindi' ? 'नोट्स का शीर्षक (Topic / Title):' : 'Note Title:'}</span>
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder={language === 'hindi' ? "जैसे: भारतीय संविधान के प्रमुख अनुच्छेद" : "Note Title..."}
                className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 text-xs px-3 py-2 rounded-xl text-white outline-none font-semibold transition-colors"
              />
            </div>

            {/* 3. Note Content Preview/Editor */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'hindi' ? 'चयनित उत्तर (Content to Save):' : 'Highlighted Content:'}</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {noteContent.length} chars
                </span>
              </div>
              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Content..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 text-xs p-2.5 rounded-xl text-slate-200 outline-none leading-relaxed custom-scrollbar transition-colors font-sans resize-none"
              />
            </div>

            {/* 4. Tags input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'hindi' ? 'टैग्स (अल्पविराम से अलग करें):' : 'Tags (comma separated):'}</span>
              </label>
              <input
                type="text"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
                placeholder="SSC, Steno, History, GK"
                className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 text-xs px-3 py-1.5 rounded-xl text-slate-300 outline-none font-mono transition-colors"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer active:scale-98"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>{language === 'hindi' ? 'फ़ोल्डर में सेव करें 💾' : 'Save to Folder 💾'}</span>
              </button>

              {onOpenNotesView && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNotesView();
                  }}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open Notes Notebook"
                >
                  <span>{language === 'hindi' ? 'सभी नोट्स' : 'All Notes'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
