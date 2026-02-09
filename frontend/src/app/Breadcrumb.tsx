import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';

const Breadcrumb = () => {
  const location = useLocation();
  const prevSegments = useRef<string[]>([]);
  const [segments, setSegments] = useState<string[]>([]);
  const [animateIndex, setAnimateIndex] = useState<number | null>(null);

  // Extract cleaned segments
  const cleanedSegments = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);

    // Remove numeric or param-like parts
    const filtered = pathParts.filter(
      (part) => isNaN(Number(part)) && !part.match(/^(\d+|[a-f0-9]{24})$/i)
    );

    // If route is exactly /dashboard, include dashboard
    if (filtered.length === 1 && filtered[0] === 'dashboard') {
      return ['dashboard'];
    }

    // Otherwise, remove dashboard from breadcrumb
    return filtered.filter((seg) => seg !== 'dashboard');
  }, [location.pathname]);

  // Track new added breadcrumb index and update segments
  useEffect(() => {
    const prev = prevSegments.current;
    const newIndex = cleanedSegments.findIndex((seg, i) => prev[i] !== seg);

    setSegments(cleanedSegments);
    setAnimateIndex(newIndex === -1 ? cleanedSegments.length - 1 : newIndex);
    prevSegments.current = cleanedSegments;
  }, [cleanedSegments]);

  return (
    <div className="flex items-center space-x-1  text-sm font-medium">
      {segments.map((seg, index) => (
        <div
          key={index}
          className={`flex items-center gap-1 capitalize 
            ${index === animateIndex ? 'animate-fade-in' : ''}`}
        >
          <span className="text-gray-700">{seg.replace(/-/g, ' ')}</span>
          {index < segments.length - 1 && <span className="text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right">
            <path d="m9 18 6-6-6-6"/>
            </svg></span>}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
