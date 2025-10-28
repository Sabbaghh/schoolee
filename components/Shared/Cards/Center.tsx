import { MapPin, Phone, Mail, Globe, Clock } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface AcademyCardProps {
  data: {
    id: number;
    type: 'school' | 'academy' | 'center';
    name: { en: string };
    location?: { name: { en: string }; slug?: string; city_id?: number };
    is_featured?: number;
    image?: string | null;
    phone?: string;
    email?: string;
    website?: string;
    tags?: string[];
    hours?: { day: string; start_time: string; end_time: string }[];
    slug?: string;
  };
}

// Helper function to format hours smartly
const formatHours = (
  hours: { day: string; start_time: string; end_time: string }[] | undefined,
): string => {
  if (!hours || hours.length === 0) return 'Not available';

  // Group consecutive days with the same hours
  const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const grouped: { days: string[]; start_time: string; end_time: string }[] =
    [];
  let currentGroup: string[] = [hours[0].day];
  let currentStart = hours[0].start_time;
  let currentEnd = hours[0].end_time;

  for (let i = 1; i < hours.length; i++) {
    if (
      hours[i].start_time === currentStart &&
      hours[i].end_time === currentEnd &&
      dayOrder.indexOf(hours[i].day) ===
        dayOrder.indexOf(currentGroup[currentGroup.length - 1]) + 1
    ) {
      currentGroup.push(hours[i].day);
    } else {
      grouped.push({
        days: currentGroup,
        start_time: currentStart,
        end_time: currentEnd,
      });
      currentGroup = [hours[i].day];
      currentStart = hours[i].start_time;
      currentEnd = hours[i].end_time;
    }
  }
  grouped.push({
    days: currentGroup,
    start_time: currentStart,
    end_time: currentEnd,
  });

  // Format the grouped hours
  return grouped
    .map((group) => {
      const dayRange =
        group.days.length > 1
          ? `${
              group.days[0].charAt(0).toUpperCase() + group.days[0].slice(1)
            }-${
              group.days[group.days.length - 1].charAt(0).toUpperCase() +
              group.days[group.days.length - 1].slice(1)
            }`
          : group.days[0].charAt(0).toUpperCase() + group.days[0].slice(1);
      return `${dayRange}: ${group.start_time} - ${group.end_time}`;
    })
    .join(', ');
};

export default function AcademyCard({ data }: AcademyCardProps) {
  const {
    is_featured,
    name,
    location,
    type,
    image,
    phone,
    email,
    website,
    tags,
    hours,
    slug,
  } = data;

  return (
    <Link href={`/p?s=${type}&id=${slug}`} className="relative block group">
      {is_featured && (
        <div className="absolute top-[-10px] left-4 z-10">
          <Badge className="bg-primary text-white border-none rounded-md px-3 py-1 font-medium text-xs tracking-wide">
            FEATURED
          </Badge>
        </div>
      )}

      <Card className="bg-gray-900 text-white border-none relative min-h-64 overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl">
        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,192,165,0.5) 0%, rgba(244,150,110,0.11) 77%, rgba(212,121,70,0) 100%)',
            mixBlendMode: 'overlay',
            opacity: 0.85,
          }}
        />

        <div className="relative z-[1] p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-400 font-light text-xs" />
            <span className="text-gray-200 font-medium text-xs tracking-wider uppercase bg-gray-800/50 px-2 py-1 rounded">
              {type}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex gap-4 flex-1">
            {/* Academy Logo */}
            <div className="bg-white rounded-full flex items-center justify-center h-16 w-16 shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Image
                src={image || '/PlaceHolder.png'}
                alt={`${name.en} logo`}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            </div>

            {/* Academy Info */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight text-white group-hover:text-primary transition-colors duration-200">
                  {name.en}
                </h3>
                {location?.name?.en && (
                  <div className="flex items-center text-gray-300 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    <span>{location.name.en}</span>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-3 space-y-1.5 text-sm text-gray-300">
                {phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-primary" />
                    <span>{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-primary" />
                    <span className="truncate max-w-[200px]">{email}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1 text-primary" />
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate max-w-[200px] hover:text-primary transition-colors"
                    >
                      {website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {hours && hours.length > 0 && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-primary" />
                    <span className="truncate max-w-[200px]">
                      {formatHours(hours)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-700 text-gray-200 text-xs px-2 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
