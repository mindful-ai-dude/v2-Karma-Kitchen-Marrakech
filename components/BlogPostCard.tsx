import React, { useState } from 'react';
import { BlogPost } from '../types';
import { CopyIcon, CheckIcon, SaveIcon, DriveIcon } from './Icons';

interface BlogPostCardProps {
  post: BlogPost;
  onSaveLocal: (post: BlogPost) => void;
  onSaveDrive: (post: BlogPost) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onSaveLocal, onSaveDrive }) => {
  const [copied, setCopied] = useState(false);
  const [savedLocal, setSavedLocal] = useState(false);
  const [savedDrive, setSavedDrive] = useState(false);

  const handleCopy = () => {
    // Ensure paragraphs are separated by double newlines for plain text editors
    // We normalize newlines to ensure consistent double spacing
    const paragraphs = post.content.split(/\n+/).filter(Boolean);
    const textToCopy = `${post.title}\n\n${paragraphs.join('\n\n')}`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLocalSave = () => {
    onSaveLocal(post);
    setSavedLocal(true);
    setTimeout(() => setSavedLocal(false), 2000);
  };

  const handleDriveSave = () => {
    onSaveDrive(post);
    setSavedDrive(true);
    setTimeout(() => setSavedDrive(false), 2000);
  };

  // Helper to render bold text if the model uses markdown bolding (**text**)
  // Since the model might output markdown, a simple parser for bolding is useful 
  // to ensure it looks good even without a full markdown renderer.
  const renderParagraphWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-lg transition-all hover:shadow-xl hover:scale-[1.01] flex flex-col h-full relative group">
      
      {/* Header Actions (Copy) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={handleCopy}
          className="p-2 rounded-full bg-white/80 shadow-sm hover:bg-white text-gray-700 transition-all"
          title="Copy to clipboard"
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-600" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold mb-6 font-serif text-gray-900 leading-tight pr-8">
        {post.title}
      </h3>
      
      <div className="prose prose-gray max-w-none flex-grow">
        {post.content.split(/\n+/).filter(Boolean).map((paragraph, idx) => (
          <p key={idx} className="mb-5 text-gray-800 leading-relaxed font-serif text-[1.05rem]">
            {renderParagraphWithBold(paragraph)}
          </p>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200/30 flex justify-between items-center">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 opacity-60"></span>
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 opacity-30"></span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleLocalSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${savedLocal ? 'bg-green-100 text-green-700' : 'bg-white/50 hover:bg-white text-gray-600'}`}
            title="Save to Local Database"
          >
            {savedLocal ? <CheckIcon className="w-4 h-4" /> : <SaveIcon className="w-4 h-4" />}
            {savedLocal ? 'Saved' : 'Save'}
          </button>
          
          <button
            onClick={handleDriveSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${savedDrive ? 'bg-blue-100 text-blue-700' : 'bg-white/50 hover:bg-white text-gray-600'}`}
            title="Save to Google Drive"
          >
            {savedDrive ? <CheckIcon className="w-4 h-4" /> : <DriveIcon className="w-4 h-4" />}
            {savedDrive ? 'Sent' : 'Drive'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;