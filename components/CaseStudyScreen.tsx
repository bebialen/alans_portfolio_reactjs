
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Tag, ChevronLeft, Github, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project } from '../types';

interface CaseStudyScreenProps {
  project: Project;
  onClose: () => void;
}

const CaseStudyScreen: React.FC<CaseStudyScreenProps> = ({ project, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (!project.caseStudyPath) {
        setContent('No case study available for this project.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(project.caseStudyPath);
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent('Failed to load case study content.');
        }
      } catch (error) {
        console.error('Error fetching case study:', error);
        setContent('Error loading case study.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    // Prevent scrolling on the main body when the case study is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project.caseStudyPath]);

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[200] bg-[#050505] overflow-y-auto"
    >
      {/* Header / Nav */}
      <div className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Portfolio
        </button>
        <div className="flex items-center gap-4">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Project Hero Info */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech.map((t) => (
                <span key={t} className="text-[9px] font-black bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tighter uppercase font-display leading-tight">
              {project.title}
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
              {project.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Markdown Content */}
        <div className="prose prose-invert prose-blue max-w-none">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Decrypting Case Study...</p>
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl sm:text-4xl font-black text-white mt-12 mb-6 uppercase tracking-tight" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl sm:text-3xl font-black text-blue-400 mt-10 mb-4 uppercase tracking-tight" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl sm:text-2xl font-black text-white mt-8 mb-4 uppercase tracking-tight" {...props} />,
                  p: ({node, ...props}) => <p className="text-zinc-400 leading-relaxed mb-6 text-base sm:text-lg" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-none space-y-3 mb-8" {...props} />,
                  li: ({node, ...props}) => (
                    <li className="flex gap-3 text-zinc-400 text-base sm:text-lg">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                      <span>{props.children}</span>
                    </li>
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-blue-500 bg-blue-500/5 p-6 rounded-r-2xl mb-8 italic text-zinc-300" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto mb-8 rounded-xl border border-white/5">
                      <table className="w-full text-left border-collapse" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => <th className="bg-zinc-900 p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-white/5" {...props} />,
                  td: ({node, ...props}) => <td className="p-4 text-sm text-zinc-400 border-b border-white/5" {...props} />,
                  hr: () => <hr className="border-white/5 my-12" />,
                  code: ({node, className, children, ...props}) => {
                    const isCodeBlock = /language-(\w+)/.test(className || '');
                    return isCodeBlock ? (
                      <code className={`${className} block bg-zinc-900 p-6 rounded-2xl overflow-x-auto border border-white/5 mb-8 text-sm font-mono text-zinc-300`} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-zinc-800 text-blue-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({node, children, ...props}) => <div className="not-prose">{children}</div>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Call to Action */}
      <div className="max-w-4xl mx-auto px-6 pb-20 mt-20 border-t border-white/5 pt-12">
        <div className="bg-gradient-to-br from-zinc-900 to-black p-8 sm:p-12 rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Interested in this project?</h3>
            <p className="text-zinc-500">Let's discuss how we can build something similar.</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-white text-black px-8 py-4 rounded-full font-black text-xs tracking-widest hover:scale-105 transition-all"
          >
            LET'S CONNECT
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CaseStudyScreen;
