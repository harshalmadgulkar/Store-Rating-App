// @components/StarRating.tsx
import { Star } from "lucide-react";
import { useState } from "react";

interface Props {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export default function StarRating({ value, onChange, readonly = false, size = 24 }: Props) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-pointer transition-colors ${
            (hover || value) >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  );
}