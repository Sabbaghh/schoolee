'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const School = dynamic(() => import('./PageType/school'), { suspense: true });
const Academy = dynamic(() => import('./PageType/academy'), { suspense: true });
const Center = dynamic(() => import('./PageType/center'), { suspense: true });
const Instructor = dynamic(() => import('./PageType/instructor'), {
  suspense: true,
});

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<unknown[]>([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
  });
  const [inputs, setInputs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // state for each filter key
  const [values, setValues] = useState<Record<string, string>>({});

  // extract type & page
  const modelType = searchParams.get('type') || 'school';
  const currentPage = Number(searchParams.get('page') || '1');

  // seed filter values from URL params whenever inputs or searchParams change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const v: Record<string, string> = {};
    inputs.forEach((inp) => {
      const val = params.get(inp.key);
      if (val) v[inp.key] = val;
    });
    setValues(v);
  }, [inputs, searchParams.toString()]);

  // onChange: update state + URL (reset page to 1)
  function onChange(key: string, v: string) {
    setValues((prev) => ({ ...prev, [key]: v }));

    const params = new URLSearchParams(searchParams.toString());
    if (v) {
      params.set(key, v);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.replace(`/s?${params.toString()}`);
  }

  // build baseParams for pagination links
  const baseParams = new URLSearchParams();
  Array.from(searchParams.entries()).forEach(([k, v]) => {
    if (v) baseParams.append(k, v);
  });
  if (!baseParams.has('type')) baseParams.append('type', 'school');

  const pageHref = (page: number) => {
    const p = new URLSearchParams(baseParams.toString());
    p.set('page', page.toString());
    return `/s?${p.toString()}`;
  };

  // fetch data + inputs when params change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const url = `${
          process.env.NEXT_PUBLIC_BASE_URI
        }/api/v1/search?${baseParams.toString()}`;
        const res = await axios.get(url);
        const r = res.data.results;
        setData(r.data);
        setMeta({
          current_page: r.current_page,
          last_page: r.last_page,
          per_page: r.per_page,
          total: r.total,
        });
        setInputs(res.data.inputs || []);
      } catch (err) {
        console.error(err);
        setData([]);
        setMeta({ current_page: 1, last_page: 1, per_page: 9, total: 0 });
        setInputs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams.toString()]);

  const renderComponent = () => {
    switch (modelType) {
      case 'school':
        return <School data={data} />;
      case 'academy':
        return <Academy data={data} />;
      case 'center':
        return <Center data={data} />;
      case 'instructor':
        return <Instructor data={data} />;
      default:
        return <div className="text-red-500">Unknown type: {modelType}</div>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 px-5 lg:px-5 xl:px-36  mt-32">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            className="relative border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden p-2"
          >
            <div className="bg-gray-800 rounded-md overflow-hidden relative">
              {/* Radial overlay (static) */}
              <div className="absolute inset-0 bg-gray-700 mix-blend-overlay pointer-events-none" />

              <div className="p-4 pt-6 relative z-10 space-y-4">
                {/* Header line placeholders */}
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 bg-gray-100/80 dark:bg-gray-700/60" />
                  <Skeleton className="h-4 w-28 bg-gray-100/80 dark:bg-gray-700/60" />
                </div>

                {/* Logo + title */}
                <div className="flex gap-4">
                  <Skeleton className="h-14 w-14 rounded-full bg-gray-100/80 dark:bg-gray-700/60" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-gray-100/80 dark:bg-gray-700/60" />
                    <Skeleton className="h-4 w-1/2 bg-gray-100/80 dark:bg-gray-700/60" />
                  </div>
                </div>

                {/* Footer info */}
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-gray-100/80 dark:bg-gray-700/60" />
                    <Skeleton className="h-4 w-24 bg-gray-100/80 dark:bg-gray-700/60" />
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-8 mx-auto bg-gray-100/80 dark:bg-gray-700/60" />
                    <Skeleton className="h-8 w-16 mx-auto bg-gray-100/80 dark:bg-gray-700/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { current_page, last_page } = meta;
  const totalPages = last_page;

  // pagination range (5 pages)
  const maxToShow = 5;
  let start = Math.max(1, currentPage - Math.floor(maxToShow / 2));
  let end = Math.min(totalPages, start + maxToShow - 1);
  if (end - start + 1 < maxToShow) start = Math.max(1, end - maxToShow + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="px-5 lg:px-5 xl:px-36 flex flex-col gap-5 mt-32">
      <div className="flex flex-row justify-between">
        <div className="text-2xl flex gap-4">
          {inputs.map((input) => (
            <Select
              key={input.id}
              value={values[input.key] || ''}
              onValueChange={(v) => onChange(input.key, v)}
            >
              <SelectTrigger
                className="border-none w-full text-white"
                id={input.key}
              >
                <SelectValue placeholder={input.placeholder || input.name} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white shadow-lg">
                {input.options.length > 0 ? (
                  input.options.map((opt) => (
                    <SelectItem
                      key={opt.key}
                      value={String(opt.key)}
                      className="text-white hover:bg-white/10 data-[state=checked]:bg-white/20"
                    >
                      {typeof opt.value === 'string' ? opt.value : opt.value.en}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-white/60">
                    No options available
                  </div>
                )}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 flex-3">
        {data.length > 0 ? (
          <Suspense
            fallback={
              modelType === 'school' ? (
                <SchoolLoading />
              ) : modelType === 'academy' ? (
                <AcademyLoading />
              ) : modelType === 'center' ? (
                <CenterLoading />
              ) : (
                <InstructorLoading />
              )
            }
          >
            {renderComponent()}
          </Suspense>
        ) : (
          <p>No results found.</p>
        )}
      </div>

      <div className="flex-1 pb-5">
        {data.length > 0 && (
          <Pagination>
            <PaginationContent>
              {current_page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={pageHref(current_page - 1)} />
                </PaginationItem>
              )}
              {start > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {pages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={pageHref(p)}
                    isActive={p === current_page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {end < totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {current_page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={pageHref(current_page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

// Individual loading placeholders

function SchoolLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="animate-pulse h-8 w-3/4 bg-gray-200 rounded mb-4" />
      <div className="animate-pulse h-4 w-1/2 bg-gray-200 rounded" />
    </div>
  );
}

function AcademyLoading() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
      <span className="ml-3 text-sm">Loading academies…</span>
    </div>
  );
}

function CenterLoading() {
  return (
    <div className="text-center py-10">
      <p>Loading centers…</p>
    </div>
  );
}

function InstructorLoading() {
  return (
    <div className="text-center py-10">
      <p>Loading instructors…</p>
    </div>
  );
}
