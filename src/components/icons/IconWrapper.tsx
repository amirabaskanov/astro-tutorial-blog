import type { SVGProps } from 'react';
import type { JSX } from 'react';

interface IconWrapperProps {
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  className?: string;
}

export function IconWrapper({ icon: Icon, className = '' }: IconWrapperProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Icon width="100%" height="100%" className="w-full h-full" />
    </div>
  );
} 