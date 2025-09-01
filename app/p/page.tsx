'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';

function Page() {
  const searchParams = useSearchParams();
  const type = searchParams.get('s');
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!type || !id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URI}/api/v1/entity/${type}/${id}`,
        );
        setData(res.data);
        // console.log(res.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      }
    };

    fetchData();
  }, [type, id]);
  return (
    <div className="w-full">
      <div className="w-full px-6 lg:px-44 mt-36">
        {/* Title */}
        <div>
          <h1 className="text-sm text-white/50">{`< Back`}</h1>
          <div className="flex flex-row mt-2">
            <div className="flex-1">
              <h1 className="text-xl">
                {data?.name.en}
                {` / `}
                <span className="text-sm font-bold">
                  {data?.khda_rating
                    ? `${data?.khda_rating.toUpperCase()}`
                    : ''}
                </span>
              </h1>
            </div>
            <div>
              <Button>
                <h1>Inquire now</h1>
              </Button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex flex-col lg:flex-row gap-5 mt-5 h-[50vh]">
          {/* Main */}
          <div className="flex-3 relative rounded-lg overflow-hidden">
            <Image
              src="/images/school.png"
              alt="School Image"
              fill
              quality={100}
              className="object-cover"
            />
          </div>

          {/* Thumbnails with Popover */}
          <div className="flex-1 flex flex-row lg:flex-col gap-5">
            {[1, 2, 3].map((_, i) => (
              <Popover key={i}>
                <PopoverTrigger asChild>
                  <div className="flex-1 bg-black relative rounded-sm overflow-hidden cursor-pointer">
                    <Image
                      src="/images/school.png"
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      quality={100}
                      className="object-cover"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-transparent border-none">
                  <Image
                    src="/images/school.png"
                    alt={`Enlarged ${i + 1}`}
                    width={600}
                    height={400}
                    className="rounded-lg object-contain max-w-[90vw] max-h-[90vh]"
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
        {/* info */}
        <div className="flex flex-row gap-5 mt-5">
          <p className="text-sm">Location : {data?.city?.name?.en} </p>
          {data?.curriculum ? (
            <p className="text-sm">Curriculum : {data?.curriculum?.name.en}</p>
          ) : null}
          {data?.grades ? (
            <p className="text-sm">
              Grade: : {data?.grades?.[0].name} -{' '}
              {data?.grades?.[data?.grades?.length - 1].name}
            </p>
          ) : null}
        </div>

        {/* About */}
        <div className="mt-10 flex flex-row">
          <div>
            <h1 className="text-6xl">About</h1>
            <p className="w-full lg:w-2/3">{data?.about?.en}</p>
          </div>
        </div>

        {/* taps */}

        <Tabs defaultValue="Admission" className="mt-10">
          <TabsList className="bg-transparent">
            {data?.grades?.length > 0 ? (
              <TabsTrigger
                value="Grades"
                className="data-[state=active]:border-b-[1px] data-[state=active]:border-b-primary rounded-none"
              >
                Grades
              </TabsTrigger>
            ) : null}

            {data?.admission?.en ? (
              <TabsTrigger
                value="Admission"
                className="data-[state=active]:border-b-[1px] data-[state=active]:border-b-primary rounded-none"
              >
                Admission
              </TabsTrigger>
            ) : null}

            {data?.scholarships?.en ? (
              <TabsTrigger
                value="Scholarships"
                className="data-[state=active]:border-b-[1px] data-[state=active]:border-b-primary rounded-none"
              >
                scholarships
              </TabsTrigger>
            ) : null}
            {data?.calendar?.en ? (
              <TabsTrigger
                value="Calendar"
                className="data-[state=active]:border-b-[1px] data-[state=active]:border-b-primary rounded-none"
              >
                Calendar
              </TabsTrigger>
            ) : null}
          </TabsList>

          {data?.grades?.length > 0 ? (
            <TabsContent className="w-full lg:w-2/3 " value="Grades">
              {/* Grades content goes here */}
              <div className="mt-10 w-full lg:full">
                <h1 className="text-2xl">Grades</h1>
                <div className=" gap-5 mt-5 grid grid-cols-3 ">
                  {data?.grades?.map((grade, index) => (
                    <p className="border-b pb-2 text-sm" key={index}>
                      {grade?.name} / {grade?.fee?.amount}{' '}
                      {grade?.fee?.currency}
                    </p>
                  ))}
                </div>
              </div>
            </TabsContent>
          ) : null}

          {data?.admission?.en ? (
            <TabsContent
              className="w-full lg:w-2/3 px-3 mt-5"
              value="Admission"
            >
              <p className="text-sm">{data?.admission.en}</p>
            </TabsContent>
          ) : null}

          {data?.scholarships?.en ? (
            <TabsContent
              className="w-full lg:w-2/3 px-3 mt-5"
              value="Scholarships"
            >
              <p className="text-sm">{data?.scholarships.en}</p>
            </TabsContent>
          ) : null}
          {data?.calendar?.en ? (
            <TabsContent className="w-full lg:w-2/3 px-3 mt-5" value="Calendar">
              <p className="text-sm">{data?.calendar.en}</p>
            </TabsContent>
          ) : null}
        </Tabs>

        {/* Facilities */}
        <div className="mt-10 w-full lg:w-2/3">
          <h1 className="text-2xl">Facilities</h1>
          <div className=" gap-5 mt-5 grid grid-cols-2 ">
            {data?.facilities?.map((facility, index) => (
              <p className="border-b pb-2 text-md" key={index}>
                {facility?.name?.en}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-64"></div>
      </div>
    </div>
  );
}

export default Page;
