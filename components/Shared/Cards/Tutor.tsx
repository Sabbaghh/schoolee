import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface TutorCardProps {
  data: {
    id: number;
    type: string;
    name: { en: string };
    slug: string;
    city?: { name: { en: string }; slug?: string; country_id?: number };
    image?: string | null;
    phone?: string | null;
    email?: string;
    website?: string;
    social_links?: string[];
    subjects?: {
      name: { en: string };
      details?: { age_group: string; fee: string; session_types: string };
    }[];
    languages?: { name: { en: string } }[];
    availability?: {
      day: string | null;
      start: string | null;
      end: string | null;
    }[];
  };
}

export default function TutorCard({ data }: TutorCardProps) {
  const {
    slug,
    type,
    name,
    city,
    image,
    phone,
    email,
    website,
    social_links,
    subjects,
    languages,
    availability,
  } = data;

  // Map social links to icons
  const socialIcons: { [key: string]: JSX.Element } = {
    instagram: <Instagram className="w-4 h-4 mr-2 text-primary" />,
    facebook: <Facebook className="w-4 h-4 mr-2 text-primary" />,
    twitter: <Twitter className="w-4 h-4 mr-2 text-primary" />,
  };

  // Helper function to parse JSON safely
  const parseJsonSafely = (json: string, fallback: any[]) => {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  };

  const renderSocialLinks = (links: string[] | undefined) => {
    if (!links || links.length === 0) return null;
    return links.slice(0, 3).map((link, index) => {
      const platform =
        Object.keys(socialIcons).find((p) => link.toLowerCase().includes(p)) ||
        'generic';
      return (
        <a
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-300 hover:text-primary transition-colors"
        >
          {socialIcons[platform] || (
            <Globe className="w-4 h-4 mr-2 text-primary" />
          )}
          <span className="truncate max-w-[150px]">
            {link.replace(/^https?:\/\//, '')}
          </span>
        </a>
      );
    });
  };

  // Parse age_group and session_types for the first subject
  const firstSubject = subjects && subjects.length > 0 ? subjects[0] : null;
  const ageGroup = firstSubject?.details?.age_group
    ? parseJsonSafely(firstSubject.details.age_group, [])
    : [];
  const sessionTypes = firstSubject?.details?.session_types
    ? parseJsonSafely(firstSubject.details.session_types, [])
    : [];

  return (
    <Link
      href={`/instructor?s=tutor&id=${slug}`}
      className="relative block group"
    >
      <Card className="bg-gray-900 text-white border-none relative h-80 overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:bg-gray-850">
        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,192,165,0.4) 0%, rgba(244,150,110,0.1) 77%, rgba(212,121,70,0) 100%)',
            mixBlendMode: 'overlay',
            opacity: 0.9,
          }}
        />

        <CardContent className="p-5 relative z-[1] flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-400 font-light text-xs" />
            <span className="text-gray-200 font-medium text-xs tracking-wider uppercase bg-gray-800/60 px-2.5 py-1 rounded-md shadow-sm">
              {type.toUpperCase()}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex gap-4 flex-1">
            {/* Tutor Image */}
            <div className="bg-white rounded-full flex items-center justify-center h-14 w-14 shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
              <Image
                src={image || '/tutor.png'}
                alt={`${name.en} image`}
                width={42}
                height={42}
                className="rounded-full object-cover"
              />
            </div>

            {/* Tutor Info */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight text-white group-hover:text-primary transition-colors duration-200">
                  {name.en}
                </h3>
                {city?.name?.en && (
                  <div className="flex items-center text-gray-300 text-sm mt-1.5">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span className="truncate">{city.name.en}</span>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-4 space-y-1.5 text-sm text-gray-300">
                {subjects && subjects.length > 0 && (
                  <div>
                    <span className="text-gray-400">Subjects: </span>
                    <span className="font-medium">
                      {subjects.map((el) => el.name.en).join(' | ')}
                    </span>
                  </div>
                )}
                {languages && languages.length > 0 && (
                  <div>
                    <span className="text-gray-400">Languages: </span>
                    <span className="font-medium">
                      {languages.map((el) => el.name.en).join(' | ')}
                    </span>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-primary" />
                    <span>{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-primary" />
                    <span className="truncate max-w-[200px]">{email}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-primary" />
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
                {social_links && social_links.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {renderSocialLinks(social_links)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          {subjects && subjects.length > 0 && (
            <div className="mt-4 flex justify-between items-end">
              <div className="space-y-1.5 text-sm text-gray-300">
                <div>
                  <span className="text-gray-400">Age Group: </span>
                  <span className="font-medium">
                    {ageGroup.length > 0
                      ? `${ageGroup[0]} - ${ageGroup[ageGroup.length - 1]}`
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Session Types: </span>
                  <span className="font-medium">
                    {sessionTypes.length > 0 ? sessionTypes.join(', ') : 'N/A'}
                  </span>
                </div>
              </div>
              {subjects[0].details?.fee && (
                <div className="text-right">
                  <div className="text-primary text-sm">AED</div>
                  <div className="text-xl font-bold text-white">
                    {Number(subjects[0].details.fee) % 1 === 0
                      ? Number(subjects[0].details.fee).toFixed(0)
                      : Number(subjects[0].details.fee).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Availability */}
          {availability &&
            availability.length > 0 &&
            availability.some((a) => a.day && a.start && a.end) && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-200 mb-2">
                  Availability
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                  {availability
                    .filter((a) => a.day && a.start && a.end)
                    .map((slot, index) => (
                      <p key={index} className="border-b pb-1.5 uppercase">
                        <Clock className="w-4 h-4 mr-2 text-primary inline" />
                        {slot.day} / {slot.start} - {slot.end}
                      </p>
                    ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </Link>
  );
}
