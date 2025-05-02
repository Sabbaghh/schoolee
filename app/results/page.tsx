import React from 'react';

import Academy from './PageType/academy';
import Center from './PageType/center';
import Instructor from './PageType/instructor';
import School from './PageType/school';

// Define the interface for searchParams
interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const modelType = Array.isArray(resolvedSearchParams.model_type)
    ? resolvedSearchParams.model_type[0]
    : resolvedSearchParams.model_type;

  // Normalize the page parameter
  const rawPage = Array.isArray(resolvedSearchParams.page)
    ? resolvedSearchParams.page[0]
    : resolvedSearchParams.page;
  const pageNum = rawPage && !isNaN(Number(rawPage)) ? rawPage : '1';

  // Build API query params, preserving original params except 'page'
  const apiParams = new URLSearchParams();
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value === undefined || key === 'page') return;
    if (Array.isArray(value)) {
      value.forEach((v) => apiParams.append(key, v));
    } else {
      apiParams.append(key, value);
    }
  });
  apiParams.append('page', pageNum);

  const apiUrl = `api/results?${apiParams.toString()}`;
  console.log('API URL:', apiUrl);

  // Extract filters for display
  const filters = Object.entries(resolvedSearchParams)
    .filter(
      ([key, value]) => key !== 'page' && value !== undefined && value !== '',
    )
    .map(([key, value]) => ({
      key,
      value: Array.isArray(value) ? value.join(', ') : value,
    }));

  // Render the correct component based on model_type
  const renderResultsComponent = () => {
    switch (modelType) {
      case 'universal':
        return <p>universal</p>;
      case 'school':
        return <School />;
      case 'academy':
        return <Academy />;
      case 'center':
        return <Center />;
      case 'instructor':
        return <Instructor />;
      default:
        return (
          <div className="text-red-500">
            Unknown model type: {modelType || 'None'}
          </div>
        );
    }
  };

  // Final Render
  return (
    <div className="p-6 px-5 lg:px-5 xl:px-60">
      <h1 className="text-2xl font-bold mb-4">
        Results{' '}
        {filters.length > 0 && (
          <>for {filters.find((f) => f.key === 'model_type')?.value}</>
        )}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {renderResultsComponent()}
      </div>
    </div>
  );
}
