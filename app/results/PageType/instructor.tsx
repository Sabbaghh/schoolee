/* data/schools.json */

/* components/SchoolCardsList.tsx */
import React from 'react';
import schools from './data/school';
import TutorCard from '@/components/Shared/Cards/Tutor';

function instructor() {
  return (
    <>
      {schools.map((school) => (
        <React.Fragment key={school.id}>
          <TutorCard />
        </React.Fragment>
      ))}
    </>
  );
}

export default instructor;
