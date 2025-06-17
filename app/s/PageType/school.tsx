// components/SchoolCardsList.tsx
import React from 'react';
import SchoolCard from '@/components/Shared/Cards/School';

interface School {
  id: number;
  user_id: number;
  type: string;
  name: any;
  city_id: number;
  // Add other fields as needed
}

interface Props {
  data: School[];
}

const SchoolCardsList: React.FC<Props> = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error('Expected data to be an array, received:', data);
    return null;
  }

  return (
    <>
      {data.map((school) => (
        <React.Fragment key={school.id}>
          <SchoolCard data={school} />
        </React.Fragment>
      ))}
    </>
  );
};

export default SchoolCardsList;
