import React from 'react';

interface TechIconProps {
  name: string;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ name, className = "w-3 h-3" }) => {
  const normalizedName = name.toLowerCase();

  const getIcon = () => {
    switch (normalizedName) {
      case 'flutter':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M14.314 0L2.3 12L6 15.7L21.684.012h-7.357zm.014 11.072l-6.126 6.11l3.69 3.704L21.745 11.072h-7.417z" />
          </svg>
        );
      case 'figma':
        return (
          <svg viewBox="0 0 38 57" fill="currentColor" className={className}>
            <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0zM0 47.5a9.5 9.5 0 0 1 9.5-9.5H19v9.5a9.5 9.5 0 1 1-19 0zM19 0v19h9.5a9.5 9.5 0 1 0 0-19H19zM0 9.5a9.5 9.5 0 0 0 9.5 9.5H19V0H9.5A9.5 9.5 0 0 0 0 9.5zM0 28.5a9.5 9.5 0 0 0 9.5 9.5H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
          </svg>
        );
      case 'react':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="2" />
            <path d="M12 12c-4.418 0-8-1.79-8-4s3.582-4 8-4 8 1.79 8 4-3.582 4-8 4Z" />
            <path d="M12 12c-4.418 0-8 1.79-8 4s3.582 4 8 4 8-1.79 8-4-3.582-4-8-4Z" />
            <path d="M12 12c-1.105 0-2 4.03-2 9s.895 9 2 9 2-4.03 2-9-.895-9-2-9Z" transform="rotate(60 12 12)" />
            <path d="M12 12c-1.105 0-2 4.03-2 9s.895 9 2 9 2-4.03 2-9-.895-9-2-9Z" transform="rotate(-60 12 12)" />
          </svg>
        );
      case 'node.js':
      case 'nodejs':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 1L3.5 6v12l8.5 5 8.5-5V6L12 1zm6.5 16.2l-6.5 3.8-6.5-3.8V7.8l6.5-3.8 6.5 3.8v9.4z" />
            <path d="M12 7.2L8.5 9.3v5.4l3.5 2.1 3.5-2.1V9.3L12 7.2z" />
          </svg>
        );
      case 'kotlin':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M1.3 24l11.3-11.5L24 24zM0 0h12L0 12.5zM13.4 0L0 14v10l24-24z" />
          </svg>
        );
      case 'mysql':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12.2 19c-3.1 0-5.4-1.1-6.1-2.9.1 0 .2.1.3.1 2.8 0 4.1-2.4 5.3-4.5 1-1.9 2-3.8 4.2-3.8 1 0 1.8.4 2.3 1.2.6.9.7 2.1.3 3.4-.6 1.9-2.2 4.6-5.1 6.3-.4.2-.8.2-1.2.2zm11-6.8c-.4-2.2-1.6-4-3.3-4.9-1-.5-2.2-.8-3.3-.8-3.1 0-4.8 2.3-6 4.6-.9 1.7-1.8 3.3-3.1 3.3-1.4 0-2.4-.9-2.9-2.4-.1-.3-.1-.6-.1-.9 0-3.3 2.7-6 6.1-6 1.1 0 2.2.3 3.2.9.4.2.8-.2.6-.6-.9-1.3-2.4-2-4-2-4.5 0-8.1 3.5-8.1 7.8 0 .9.1 1.7.4 2.5.6 2.3 2.3 3.9 4.8 3.9.4 0 .7 0 1.1-.1 3.6-1.1 6.1-4.8 7.3-8.3.1-.3.4-.4.7-.2.2.1.4.3.4.6.2 3.6-2.1 7.6-5.8 8.8-.4.1-.7.4-.6.8.1.4.4.6.8.6.4 0 .8-.1 1.2-.2 4-2.1 6.5-6.2 7-9.4.1-.2.1-.5.1-.7z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
    }
  };

  return <span className="inline-flex items-center">{getIcon()}</span>;
};

export default TechIcon;
