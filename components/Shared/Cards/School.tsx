import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface SchoolCardProps {
  data: {
    id: number;
    type: 'school' | 'academy' | 'center';
    name: { en: string };
    slug: string;
    location?: { name: { en: string }; slug?: string; city_id?: number };
    is_featured?: number;
    image?: string | null;
    rating_system?: { name: { en: string }; code: string };
    rating?: { name: { en: string }; key: string };
    curriculum?: { name: { en: string } };
    grades?: { name: string; fee: { amount: string; currency: string } }[];
  };
}

export default function SchoolCard({ data }: SchoolCardProps) {
  const {
    is_featured,
    name,
    location,
    type,
    slug,
    image,
    rating_system,
    rating,
    curriculum,
    grades,
  } = data;

  return (
    <Link href={`/p?s=${type}&id=${slug}`} className="relative block group">
      {is_featured && (
        <div className="absolute top-[-10px] left-4 z-10">
          <Badge className="bg-primary text-white border-none rounded-md px-3 py-1 font-medium text-xs tracking-wide shadow-sm">
            FEATURED
          </Badge>
        </div>
      )}

      <Card className="bg-gray-900 text-white border-none relative min-h-56 overflow-hidden transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:bg-gray-850">
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

        <CardContent className="p-5 relative z-[1] flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-400 font-light text-xs" />
            <span className="text-gray-200 font-medium text-xs tracking-wider uppercase bg-gray-800/60 px-2.5 py-1 rounded-md shadow-sm">
              {rating_system
                ? `${rating_system.name.en}: ${rating?.name.en || 'N/A'}`
                : type}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex gap-4 flex-1">
            {/* School Logo */}
            <div className="bg-white rounded-full flex items-center justify-center h-14 w-14 shrink-0 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
              <Image
                src={image || '/PlaceHolder.png'}
                alt={`${name.en} logo`}
                width={42}
                height={42}
                className="rounded-full object-cover"
              />
            </div>

            {/* School Info */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight text-white group-hover:text-primary transition-colors duration-200">
                  {name.en}
                </h3>
                {location?.name?.en && (
                  <div className="flex items-center text-gray-300 text-sm mt-1.5">
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    <span className="truncate">{location.name.en}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between items-end">
                <div className="space-y-1.5 text-sm">
                  {curriculum && (
                    <div>
                      <span className="text-gray-400">Curriculum: </span>
                      <span className="font-medium text-gray-200">
                        {curriculum.name.en}
                      </span>
                    </div>
                  )}
                  {grades && grades.length > 0 && (
                    <div>
                      <span className="text-gray-400">Grades: </span>
                      <span className="font-medium text-gray-200">
                        {grades[0].name} - {grades[grades.length - 1].name}
                      </span>
                    </div>
                  )}
                </div>
                {grades && grades.length > 0 && (
                  <div className="text-right">
                    <div className="text-primary text-sm">
                      {grades[0].fee.currency}
                    </div>
                    <div className="text-xl font-bold text-white">
                      {Number(grades[0].fee.amount) % 1 === 0
                        ? Number(grades[0].fee.amount).toFixed(0)
                        : Number(grades[0].fee.amount).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
