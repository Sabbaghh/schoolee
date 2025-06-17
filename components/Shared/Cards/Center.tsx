import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function SchoolCard({ data }) {
  const { is_featured, name, location, type, id } = data;

  return (
    <Link href={`/school/${id}`} className="relative ">
      {is_featured ? (
        <div className="absolute top-[-10] left-6 z-10">
          <Badge className="bg-primary text-white border-none rounded-t-none rounded-md px-4 py-1 font-medium">
            FEATURED
          </Badge>
        </div>
      ) : null}

      <Card className="bg-gray-800 text-white border-none relative min-h-48">
        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,192,165,1) 0%, rgba(244,150,110,0.22) 77%, rgba(212,121,70,0) 100%)',
            mixBlendMode: 'overlay',
          }}
        />

        <div className="flex justify-between pr-5">
          <span className="text-gray-300 font-light text-sm"></span>
          <span className="text-gray-300 font-light text-sm">
            {/* Score : <span className="text-white-400 ">{score}</span> */}
            {type.toUpperCase()}
          </span>
        </div>

        {/* School info */}
        <div className="px-5 flex h-full gap-4">
          {/* School logo - adjusted to match height of title and location */}
          <div className="bg-white rounded-full flex items-center justify-center h-14 w-14 shrink-0">
            <Image
              src="/PlaceHolder.png"
              alt="School logo"
              width={42}
              height={42}
              className="rounded-full"
            />
          </div>

          {/* School name and location */}
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold">{name?.en}</h3>
            <div className="flex items-center text-gray-400 text-sm mt-1">
              <MapPin className="w-4 mr-1 text-primary" />
              <span>{location?.name?.en}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
