/* data/schools.json */

/* components/SchoolCardsList.tsx */
import React from 'react';
import schools from './data/school';
import SchoolCard from '@/components/Shared/Cards/School';

function school() {
  return (
    <>
      {schools.map((school) => (
        <React.Fragment key={school.id}>
          <SchoolCard />
        </React.Fragment>
      ))}
    </>
  );
}

export default school;
