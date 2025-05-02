interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const modelType = Array.isArray(params.model_type)
    ? params.model_type[0]
    : params.model_type ?? '';

  const filters = Object.entries(params)
    .filter(
      ([key, value]) =>
        key !== 'model_type' && value !== undefined && value !== '',
    )
    .map(([key, value]) => ({
      key,
      value: Array.isArray(value) ? value.join(', ') : value,
    }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Results for &quot;{modelType || 'All Models'}&quot;
      </h1>

      {filters.length > 0 ? (
        <ul className="space-y-2">
          {filters.map(({ key, value }) => (
            <li key={key}>
              <strong>{key.replace(/_/g, ' ')}:</strong> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No filters applied.</p>
      )}
    </div>
  );
}
