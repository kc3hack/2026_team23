// components/Callout.tsx
import { BadgeInfo, TriangleAlert, Skull, InfoIcon } from 'lucide-react';
import { ReactNode } from 'react';
type CalloutProps = {
  children: ReactNode;
  type?: 'info' | 'warning' | 'danger';
};

export default function Callout({ children, type = 'info' }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
    danger: 'bg-red-50 border-red-500 text-red-900',
  };

  return (
    <div className={`border-l-4 p-4 my-4 rounded-r-lg w-fit ${styles[type]}`}>
      <div className="flex items-center">
        {/* アイコンなどを入れると良い */}
        <span className="font-bold mr-2">
          {type === 'info' && <InfoIcon />}
          {type === 'warning' && <TriangleAlert />}
          {type === 'danger' && <Skull />}
        </span>
        <div>{children}</div>
      </div>
    </div>
  );
}

