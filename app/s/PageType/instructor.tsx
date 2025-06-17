// components/SchoolCardsList.tsx
import React from 'react';
import InstructorCard from '@/components/Shared/Cards/Tutor';

interface Instructor {
  id: number;
  user_id: number;
  type: string;
  name: any;
  city_id: number;
  // Add other fields as needed
}

interface Props {
  data: Instructor[];
}

const InstructorCardsList: React.FC<Props> = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error('Expected data to be an array, received:', data);
    return null;
  }

  return (
    <>
      {data.map((instructor) => (
        <React.Fragment key={instructor.id}>
          <InstructorCard data={instructor} />
        </React.Fragment>
      ))}
    </>
  );
};

export default InstructorCardsList;
