interface ResultsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  // model_type will be a string
  const modelType = searchParams.model_type as string;

  // Everything else in searchParams is a string.
  // You can filter out model_type:
  const filters = Object.entries(searchParams)
    .filter(([key]) => key !== 'model_type')
    .map(([key, value]) => ({ key, value }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Results for &quot;{modelType}&quot;
      </h1>

      <ul className="space-y-2">
        {filters.map(({ key, value }) => (
          <li key={key}>
            <strong>{key.replace(/_/g, ' ')}:</strong> {value}
          </li>
        ))}
      </ul>

      {/* TODO: fetch and render real data here */}
    </div>
  );
}
