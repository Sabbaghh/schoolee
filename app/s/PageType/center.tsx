// components/SchoolCardsList.tsx
import React from 'react';
import Center from '@/components/Shared/Cards/Center';

interface Center {
  id: number;
  user_id: number;
  type: string;
  name: any;
  city_id: number;
  // Add other fields as needed
}

interface Props {
  data: Center[];
}

const CenterCardsList: React.FC<Props> = ({ data }) => {
  if (!Array.isArray(data)) {
    console.error('Expected data to be an array, received:', data);
    return null;
  }

  return (
    <>
      {data.map((center) => (
        <React.Fragment key={center.id}>
          <Center data={center} />
        </React.Fragment>
      ))}
    </>
  );
};

export default CenterCardsList;
