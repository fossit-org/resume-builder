import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
        hover ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '', ...props }: CardSectionProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }: CardSectionProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: CardSectionProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
}
