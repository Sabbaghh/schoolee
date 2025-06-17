// components/SchoolCardsList.tsx
import React from 'react';
import AcademyCard from '@/components/Shared/Cards/Academy';

interface Academy {
  id: number;
  user_id: number;
  type: string;
  name: any;
  city_id: number;
  // Add other fields as needed
}

interface Props {
  data: Academy[];
}

const AcademyCardsList: React.FC<Props> = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error('Expected data to be an array, received:', data);
    return null;
  }

  return (
    <>
      {data.map((academy) => (
        <React.Fragment key={academy.id}>
          <AcademyCard data={academy} />
        </React.Fragment>
      ))}
    </>
  );
};

export default AcademyCardsList;
