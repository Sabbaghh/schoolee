'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MapPin, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

// TutorData interface
interface TutorData {
  id: number;
  user_id: number;
  name: { en: string };
  slug: string;
  type: 'tutor';
  gender: string;
  phone: string;
  image: string | null;
  city_id: number;
  bio: string;
  experience: number;
  availability: { day: string; start: string; end: string }[];
  documents: { file: string | null; title: string | null }[];
  city: {
    id: number;
    name: { en: string; ar: string };
    slug: string;
    country_id: number;
  };
  subjects: {
    id: number;
    name: { en: string };
    slug: string;
    details: {
      instructor_id: number;
      subject_id: number;
      age_group: string;
      fee: string;
      session_types: string;
      status: string;
    };
  }[];
  languages: {
    id: number;
    name: { en: string; ar: string };
    code: string;
    pivot: {
      languageable_type: string;
      languageable_id: number;
      language_id: number;
    };
  }[];
}

// SubjectCard component
interface SubjectCardProps {
  subject: TutorData['subjects'][number];
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  // Parse JSON strings for age_group and session_types
  const ageGroup = JSON.parse(subject.details.age_group) as string[];
  const sessionTypes = JSON.parse(subject.details.session_types) as string[];

  return (
    <div className="bg-gray-800 text-white border-none rounded-lg overflow-hidden shadow-md p-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{subject.name.en}</h3>
          {subject.details.status === 'active' && (
            <span className="text-xs text-green-400">Active</span>
          )}
        </div>
        <div>
          <span className="text-gray-400">Age Group: </span>
          <span className="font-medium">
            {ageGroup[0]} - {ageGroup[ageGroup.length - 1]}
          </span>
        </div>
        <div>
          <span className="text-gray-400">Fee: </span>
          <span className="font-medium">{subject.details.fee} AED</span>
        </div>
        {sessionTypes.length > 0 && (
          <div>
            <span className="text-gray-400">Session Types: </span>
            <span className="font-medium">{sessionTypes.join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get('s');
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TutorData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id) {
      setError('Missing type or ID in query parameters');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get<TutorData>(
          `${process.env.NEXT_PUBLIC_BASE_URI}/api/v1/private-coaching/${id}`,
        );
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching tutor data');
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
        Error: {error || 'No tutor data available'}
      </div>
    );
  }

  // Fallback for profile picture
  const profileImage = data.image || '/tutor.png';

  // Format time (remove seconds from availability times)
  const formatTime = (time: string) => time.slice(0, 5); // e.g., "19:02:24" -> "19:02"

  return (
    <div className="w-full">
      <div className="w-full px-6 lg:px-44 mt-50">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mt-6">
          {/* Profile Picture */}
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-lg">
            <Image
              src={profileImage}
              alt={`${data.name.en} Profile Picture`}
              fill
              quality={100}
              className="object-cover"
            />
          </div>
          {/* Title and Inquire Button */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              {data.name.en}
              <span className="text-sm font-bold ml-2 text-gray-300">
                / {data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}
              </span>
            </h1>
            {data.city && (
              <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                <span>{data.city.name.en}</span>
              </div>
            )}
            <Button className="mt-4 bg-primary hover:bg-primary/90 transition-colors">
              Inquire Now
            </Button>
          </div>
        </div>

        {/* Contact Info Section */}
        {data.phone && (
          <div className="mt-10 w-full lg:w-2/3">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">
              Contact Information
            </h2>
            <div className="text-sm text-gray-300">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary" />
                <span>{data.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bio */}
        {data.bio && (
          <div className="mt-10 w-full lg:w-2/3">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">Bio</h2>
            <p className="text-sm text-gray-300">{data.bio}</p>
          </div>
        )}

        {/* Subjects */}
        {data.subjects && data.subjects.length > 0 && (
          <div className="mt-10 w-full lg:w-2/3">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">
              Subjects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.subjects.map((subject, index) => (
                <SubjectCard key={index} subject={subject} />
              ))}
            </div>
          </div>
        )}

        {/* Tabs for Experience and Languages */}
        {(data.experience || data.languages.length > 0) && (
          <Tabs defaultValue="Experience" className="mt-10 w-full lg:w-2/3">
            <TabsList className="bg-transparent border-b border-gray-700">
              {data.experience && (
                <TabsTrigger
                  value="Experience"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-sm font-medium"
                >
                  Experience
                </TabsTrigger>
              )}
              {data.languages.length > 0 && (
                <TabsTrigger
                  value="Languages"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 text-sm font-medium"
                >
                  Languages
                </TabsTrigger>
              )}
            </TabsList>

            {data.experience && (
              <TabsContent className="px-3 mt-5" value="Experience">
                <p className="text-sm text-gray-300">
                  {data.experience} {data.experience === 1 ? 'year' : 'years'}{' '}
                  of tutoring experience
                </p>
              </TabsContent>
            )}
            {data.languages.length > 0 && (
              <TabsContent className="px-3 mt-5" value="Languages">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
                  {data.languages.map((lang, index) => (
                    <p key={index}>{lang.name.en}</p>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}

        {/* Availability */}
        {data.availability && data.availability.length > 0 && (
          <div className="mt-10 w-full lg:w-2/3">
            <h2 className="text-2xl font-semibold mb-4 tracking-tight">
              Availability
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.availability.map((slot, index) => (
                <p
                  key={index}
                  className="border-b pb-2 text-md text-gray-300 uppercase"
                >
                  {slot.day} / {formatTime(slot.start)} - {formatTime(slot.end)}
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
