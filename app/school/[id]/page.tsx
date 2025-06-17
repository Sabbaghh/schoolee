import React from 'react';
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

function page() {
  return (
    <div className="w-full">
      <div className="w-full px-6 lg:px-44 mt-36">
        {/* Title */}
        <div>
          <h1 className="text-sm text-white/50">{`< Back`}</h1>
          <div className="flex flex-row mt-2">
            <div className="flex-1">
              <h1 className="text-xl">Al Manar Secondary School </h1>
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
          <p className="text-sm">Location : Umm Suqeim Third - Dubai </p>
          <p className="text-sm">Curriculum : British</p>
          <p className="text-sm">Grade: : FS 1 - Year 6</p>
          <p className="text-sm">Middle School</p>
        </div>

        {/* About */}
        <div className="mt-10 flex flex-row">
          <div>
            <h1 className="text-6xl">About</h1>
            <p className="w-full lg:w-2/3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
              magnam adipisci tempore nam, ratione quibusdam voluptas
              exercitationem perspiciatis in impedit minima dolor itaque enim
              minus rerum delectus, sint debitis. Facilis? Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Sapiente magnam adipisci
              tempore nam, ratione quibusdam voluptas exercitationem
              perspiciatis in impedit minima dolor itaque enim minus rerum
              delectus, sint debitis. Facilis? Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
          </div>
        </div>

        {/* grades */}

        <div className="mt-10 w-full lg:w-2/3">
          <h1 className="text-2xl">Grades</h1>
          <div className=" gap-5 mt-5 grid grid-cols-3 ">
            {[
              'FS 1 / Pre Primary',
              'FS 2 /  KG1',
              'Year 1 / KG2',
              'Year 1 / Garde 1',
              'Year 2 / Grade 2',
              'Year 3 / Grade 3',
              'Year 1 / Garde 1',
              'Year 2 / Grade 2',
              'Year 3 / Grade 3',
            ].map((grade, index) => (
              <p className="border-b pb-2 text-sm" key={index}>
                {grade}
              </p>
            ))}
          </div>
        </div>

        {/* taps */}

        <Tabs defaultValue="Admission" className="mt-10">
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="Admission"
              className="data-[state=active]:border-b-[1px] data-[state=active]:border-b-primary rounded-none"
            >
              Admission
            </TabsTrigger>
            <TabsTrigger
              value="Location"
              className="data-[state=active]:border-b-[1px] data-[state=active]:border-b-primary  rounded-none"
            >
              Location
            </TabsTrigger>
            <TabsTrigger
              value="Fees Structure"
              className="data-[state=active]:border-b-[1px] data-[state=active]:border-b-primary  rounded-none"
            >
              Fees Structure
            </TabsTrigger>
            <TabsTrigger
              value="Academic Calendar"
              className="data-[state=active]:border-b-[1px] data-[state=active]:border-b-primary  rounded-none"
            >
              Academic Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent className="w-full lg:w-2/3 px-3 mt-5" value="Admission">
            {/* Admission content goes here */}
            <p className="text-white/70">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et,
              ipsum, distinctio voluptates temporibus in sed rerum corporis
              delectus, similique eius soluta culpa ad! Soluta voluptas omnis
              minus earum, velit illum , Lorem ipsum dolor sit, amet consectetur
              adipisicing elit. Et, ipsum, distinctio voluptates temporibus in
              sed rerum corporis delectus, similique eius soluta culpa ad!
              Soluta voluptas omnis minus earum, velit illum!
            </p>
            <div className="mt-5">
              <h1 className="text-2xl font-bold">Important Information</h1>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    We also have school assemblies in our Auditorium
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Quaerat sunt deleniti nisi qui modi optio molestiae.
                      Accusamus unde minus, excepturi maiores cumque laudantium
                      dolores minima, quae dolorem earum, ratione quaerat!
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Sometimes the students from other schools come and
                    participate.
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Quaerat sunt deleniti nisi qui modi optio molestiae.
                      Accusamus unde minus, excepturi maiores cumque laudantium
                      dolores minima, quae dolorem earum, ratione quaerat!
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    In the different competitions organised in our schools.
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Quaerat sunt deleniti nisi qui modi optio molestiae.
                      Accusamus unde minus, excepturi maiores cumque laudantium
                      dolores minima, quae dolorem earum, ratione quaerat!
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          <TabsContent value="Location">Location</TabsContent>
          <TabsContent value="Fees Structure">Fees Structure</TabsContent>
          <TabsContent value="Academic Calendar">Academic Calendar</TabsContent>
          <TabsContent value="Uniform">Uniform</TabsContent>
          <TabsContent value="Schoolarships"></TabsContent>
        </Tabs>

        {/* Facilities */}
        <div className="mt-10 w-full lg:w-2/3">
          <h1 className="text-2xl">Facilities</h1>
          <div className=" gap-5 mt-5 grid grid-cols-2 ">
            {[
              'Lorem ipsum, dolor sit amet',
              'Lorem ipsum, dolor sit amet',
              'Lorem ipsum, dolor sit amet',
              'Lorem ipsum, dolor sit amet',
              'Lorem ipsum, dolor sit amet',
              'Lorem ipsum, dolor sit amet',
            ].map((grade, index) => (
              <p className="border-b pb-2 text-md" key={index}>
                {grade}
              </p>
            ))}
          </div>
        </div>

        <div className="mb-64"></div>
      </div>
    </div>
  );
}

export default page;
