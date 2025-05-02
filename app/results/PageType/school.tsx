/* data/schools.json */

/* components/SchoolCardsList.tsx */
import React from 'react';
import schools from './data/school';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

function school() {
  return (
    <>
      {schools.map((school) => (
        <Card
          key={school.id}
          className="bg-card rounded-[var(--radius)] p-4 text-card-foreground relative"
        >
          {school.featured && (
            <Badge className="absolute top-0 left-0 rounded-br-none rounded-tl-[var(--radius)] bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}

          <CardHeader className="p-0">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{school.type}</span>
              <span>KHDA: {school.rating}</span>
            </div>

            <div className="flex items-center mt-3">
              <Image
                src={school.image}
                width={48}
                height={48}
                alt={school.name}
                className="rounded-full"
              />
              <CardTitle className="ml-3 text-base font-semibold">
                {school.name}
              </CardTitle>
            </div>

            <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="mr-1 h-4 w-4" />
              {school.location}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 mt-4">
            <div className="flex justify-between text-sm">
              <span>
                Curriculum:{' '}
                <span className="font-medium text-secondary-foreground">
                  {school.curriculum}
                </span>
              </span>
              <span className="text-accent font-bold">
                AED {school.price.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-sm">
              Grade:{' '}
              <span className="font-medium text-secondary-foreground">
                {school.grade}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default school;
