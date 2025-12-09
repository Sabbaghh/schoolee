'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

// Define the EntityData interface
interface EntityData {
  id: number;
  type: 'school' | 'academy' | 'center';
  name: { en: string };
  slug: string;
  address?: { name: { en: string }; locationMap?: string };
  phone?: string;
  email?: string;
  website?: string;
  social_links?: string[];
  tags?: string[];
  about?: { en: string };
  hours?: { day: string; start_time: string; end_time: string }[];
  image?: string | null;
  gallery?: string[];
  documents?: { file: string | null; title: string | null }[];
  score?: number | null;
  is_verified?: number;
  is_active?: number;
  is_featured?: number;
  location?: {
    id: number;
    name: { en: string };
    slug: string;
    city_id: number;
  };
  city?: {
    id: number;
    name: { en: string };
    slug: string;
    country_id: number;
  };
  country?: {
    id: number;
    name: { en: string };
    code: string;
    phone_code: string;
    flag: string;
    currency: string;
  };
  admission?: { en: string };
  calendar?: { en: string };
  scholarships?: { en: string };
  accessibility_features?: { en: string };
  rating_system?: { id: number; name: { en: string }; code: string };
  rating?: { id: number; key: string; name: { en: string } };
  curriculum?: { id: number; name: { en: string } };
  grades?: {
    name: string;
    slug: string;
    fee: { amount: string; currency: string };
  }[];
  courses?: {
    id?: number;
    name: { en: string };
    slug?: string;
    entity_id?: number;
    age: (number | string)[];
    session_types?: string[];
    price: number | string;
    currency?: string;
    is_active?: number;
    duration?: string;
    description?: { en: string };
    image?: string | null;
  }[];
  activities?: {
    id?: number;
    name: { en: string };
    slug?: string;
    category_id?: number;
    description?: { en: string };
  }[];
  facilities?: {
    id?: number;
    name: { en: string };
    slug?: string;
  }[];
}

// Separate CourseCard component
interface CourseCardProps {
  course: EntityData['courses'][number];
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const backgroundImage = course.image || '/PlaceHolder.png';

  return (
    <Card className="bg-gray-800 text-white border-none overflow-hidden relative">
      <div className="absolute inset-0" />
      <CardContent className="pt-1 relative z-[1]">
        {course.session_types && course.session_types.length > 0 && (
          <div className="flex justify-between mb-4">
            <span className="text-gray-300 font-light text-sm" />
            <span className="text-gray-300 font-light text-sm">
              {course.session_types.join(', ')}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div>
              <span className="text-gray-400">Name: </span>
              <span className="font-medium">{course.name.en}</span>
            </div>
            <div>
              <span className="text-gray-400">Age: </span>
              <span className="font-medium">
                {course.age[0] ?? 'N/A'} -{' '}
                {course.age[course.age.length - 1] ?? 'N/A'}
              </span>
            </div>
            {course.duration && (
              <div>
                <span className="text-gray-400">Duration: </span>
                <span className="font-medium">{course.duration} Day</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-primary text-sm">
              {course.currency || 'AED'}
            </div>
            <div className="text-2xl font-bold">{course.price}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get('s');
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EntityData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) {
      setError('Missing type or ID in query parameters');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get<EntityData>(
          `${process.env.NEXT_PUBLIC_BASE_URI}/api/v1/entity/${type}/${id}`,
        );
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        Error: {error || 'No data available'}
      </div>
    );
  }

  // Fallback images
  const mainImage = data.image || data.gallery?.[0] || '/images/school.png';
  const galleryImages = data.gallery?.length
    ? data.gallery
    : Array(3).fill('/images/school.png');

  // Map social links to icons (assuming URLs contain platform names)
  const socialIcons: { [key: string]: JSX.Element } = {
    instagram: <Instagram className="w-4 h-4 mr-1 text-primary" />,
    facebook: <Facebook className="w-4 h-4 mr-1 text-primary" />,
    twitter: <Twitter className="w-4 h-4 mr-1 text-primary" />,
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
            <Globe className="w-4 h-4 mr-1 text-primary" />
          )}
          <span className="truncate max-w-[150px]">
            {link.replace(/^https?:\/\//, '')}
          </span>
        </a>
      );
    });
  };

  return (
    <div className="w-full">
      <div className="w-full px-6 lg:px-44 mt-36">
        {/* Back Button and Title */}
        <div>
          <div className="flex flex-row items-center justify-between mt-2">
            <h1 className="text-2xl font-semibold flex-1 tracking-tight">
              {data.name.en}
              {data.rating_system && data.rating && (
                <span className="text-sm font-bold ml-2 text-gray-300">
                  / {data.rating_system.name.en.toUpperCase()} -{' '}
                  {data.rating.name.en.toUpperCase()}
                </span>
              )}
            </h1>
            <Button className="bg-primary hover:bg-primary/90 transition-colors">
              Inquire now
            </Button>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex flex-col lg:flex-row gap-5 mt-5 h-[50vh]">
          <div className="flex-[3] relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src={'/images/1.jpg'}
              alt={`${data.name.en} Main Image`}
              fill
              quality={100}
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex-1 flex flex-row lg:flex-col gap-5">
            {galleryImages.slice(0, 3).map((imgSrc, i) => (
              <Popover key={i}>
                <PopoverTrigger asChild>
                  <div className="flex-1 bg-black relative rounded-sm overflow-hidden cursor-pointer shadow-md">
                    <Image
                      src={`/images/${i + 1}.jpg`}
                      alt={`${data.name.en} Thumbnail ${i + 1}`}
                      fill
                      quality={100}
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-transparent border-none">
                  <Image
                    src={`/images/${i + 1}.jpg`}
                    alt={`${data.name.en} Enlarged ${i + 1}`}
                    width={600}
                    height={400}
                    className="rounded-lg object-contain max-w-[90vw] max-h-[90vh] shadow-xl"
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>

        {/* Contact Info Section */}
        {(data.location ||
          data.city ||
          data.curriculum ||
          data.grades ||
          data.phone ||
          data.email ||
          data.website ||
          data.social_links) && (
          <div className="mt-10 w-full lg:w-2/3">
            <h1 className="text-2xl font-semibold mb-4 tracking-tight">
              Contact Information
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
              {data.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span>
                    {data.location.name.en}{' '}
                    {data.address ? ` - ${data.address.name.en}` : ''}
                  </span>
                </div>
              )}
              {data.city && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  <span>City: {data.city.name.en}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary" />
                  <span>{data.phone}</span>
                </div>
              )}
              {data.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary" />
                  <span className="truncate max-w-[200px]">{data.email}</span>
                </div>
              )}
              {data.website && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-primary" />
                  <a
                    href={data.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate max-w-[200px] hover:text-primary transition-colors"
                  >
                    {data.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {data.social_links && data.social_links.length > 0 && (
                <div className="flex flex-col gap-2">
                  {renderSocialLinks(data.social_links)}
                </div>
              )}
              {data.curriculum && (
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Curriculum:</span>
                  <span>{data.curriculum.name.en}</span>
                </div>
              )}
              {data.grades && data.grades.length > 0 && (
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Grades:</span>
                  <span>
                    {data.grades[0].name} -{' '}
                    {data.grades[data.grades.length - 1].name}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* About */}
        {data.about?.en && (
          <div className="mt-10">
            <h1 className="text-2xl font-semibold mb-4 tracking-tight">
              About
            </h1>
            <p className="w-full lg:w-2/3 text-sm text-gray-300">
              {data.about.en}
            </p>
          </div>
        )}

        {/* Tabs */}
        {(data.admission?.en ||
          data.scholarships?.en ||
          data.calendar?.en ||
          data.accessibility_features?.en) && (
          <Tabs defaultValue="Admission" className="mt-10">
            <TabsList className="bg-transparent border-b border-gray-700">
              {data.admission?.en && (
                <TabsTrigger
                  value="Admission"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-sm font-medium"
                >
                  Admission
                </TabsTrigger>
              )}
              {data.scholarships?.en && (
                <TabsTrigger
                  value="Scholarships"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-sm font-medium"
                >
                  Scholarships
                </TabsTrigger>
              )}
              {data.calendar?.en && (
                <TabsTrigger
                  value="Calendar"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-sm font-medium"
                >
                  Calendar
                </TabsTrigger>
              )}
              {data.accessibility_features?.en && (
                <TabsTrigger
                  value="Accessibility"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-sm font-medium"
                >
                  Accessibility Features
                </TabsTrigger>
              )}
            </TabsList>

            {data.admission?.en && (
              <TabsContent
                className="w-full lg:w-2/3 px-3 mt-5"
                value="Admission"
              >
                <p className="text-sm text-gray-300">{data.admission.en}</p>
              </TabsContent>
            )}
            {data.scholarships?.en && (
              <TabsContent
                className="w-full lg:w-2/3 px-3 mt-5"
                value="Scholarships"
              >
                <p className="text-sm text-gray-300">{data.scholarships.en}</p>
              </TabsContent>
            )}
            {data.calendar?.en && (
              <TabsContent
                className="w-full lg:w-2/3 px-3 mt-5"
                value="Calendar"
              >
                <p className="text-sm text-gray-300">{data.calendar.en}</p>
              </TabsContent>
            )}
            {data.accessibility_features?.en && (
              <TabsContent
                className="w-full lg:w-2/3 px-3 mt-5"
                value="Accessibility"
              >
                <p className="text-sm text-gray-300">
                  {data.accessibility_features.en}
                </p>
              </TabsContent>
            )}
          </Tabs>
        )}

        {/* Courses */}
        {data.courses && data.courses.length > 0 && (
          <div className="mt-10 w-full lg:w-2/3">
            <h1 className="text-2xl font-semibold mb-4 tracking-tight">
              Courses
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.courses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* Grades */}
        {data.grades && data.grades.length > 0 && (
          <div className="mt-10 w-full lg:w-2/3">
            <h1 className="text-2xl font-semibold mb-4 tracking-tight">
              Grades
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.grades.map((grade, index) => (
                <p key={index} className="border-b pb-2 text-sm text-gray-300">
                  {grade.name} / {grade.fee.amount} {grade.fee.currency}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Activities */}
        {data.activities && data.activities.length > 0 && (
          <div className="mt-10 w-full lg:w-2/3">
            <h1 className="text-2xl font-semibold mb-4 tracking-tight">
              Activities
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.activities.map((activity, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="text-md text-gray-200">{activity.name.en}</p>
                  {activity.description?.en && (
                    <p className="text-sm text-gray-400">
                      {activity.description.en}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities */}
        {data.facilities && data.facilities.length > 0 && (
          <div className="mt-10 w-full lg:w-2/3">
            <h1 className="text-2xl font-semibold mb-4 tracking-tight">
              Facilities
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.facilities.map((facility, index) => (
                <p key={index} className="border-b pb-2 text-md text-gray-300">
                  {facility.name.en}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Working Hours */}
        {data.hours && data.hours.length > 0 && (
          <div className="mt-10 w-full lg:w-2/3">
            <h1 className="text-2xl font-semibold mb-4 tracking-tight">
              Working Hours
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.hours.map((hr, index) => (
                <p
                  key={index}
                  className="border-b pb-2 text-md text-gray-300 uppercase"
                >
                  {hr.day} / {hr.start_time} - {hr.end_time}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="mb-64" />
      </div>
    </div>
  );
}

export default Page;
