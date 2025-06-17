// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

// Define FilterType and InputType interfaces to match your API
interface InputType {
  id: string;
  key: string;
  name: string;
  type: 'text' | 'select' | 'range';
  values?: { min?: string; max?: string; step?: string };
  options?: { key: string; value: string | { en: string } }[];
  is_dependant?: boolean;
  parent_id?: string;
}

interface FilterType {
  id: string;
  type: string;
  name: string;
  inputs: InputType[];
}

function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRun = useRef(true);

  // State for filters config
  const [filters, setFilters] = useState<FilterType[] | null>(null);

  // Load filters on mount
  useEffect(() => {
    async function loadFilters() {
      try {
        const { data } = await api.get<FilterType[]>('/api/v1/filters');
        setFilters(data);
      } catch (error) {
        console.error('Error loading filters:', error);
        setFilters([]);
      }
    }
    loadFilters();
  }, []);

  // ==== Note: Do NOT early return here, to keep Hooks order consistent ====
  // Instead, render a loading state inside your JSX return:
  // e.g., return filters === null ? <p>Loading filters...</p> : (<div>...your UI...</div>)

  // Initialize active tab: start with URL parameter or empty string
  const [active, setActive] = useState<string>(searchParams.get('type') || '');

  // After filters load, set default if none provided
  useEffect(() => {
    if (filters && filters.length > 0) {
      setActive((current) => current || filters[0].type);
    }
  }, [filters]);

  // Build URL-sync or default initial values
  const initialValues = useMemo(() => {
    const builder = (filters || []).find((f) => f.type === active);
    if (!builder) return {};

    return builder.inputs.reduce((acc, input) => {
      const key = input.key;
      if (input.type === 'range') {
        const defMin = parseFloat(input.values?.min ?? '0');
        const defMax = parseFloat(input.values?.max ?? '0');
        const qMin = searchParams.get(key + '_min');
        const qMax = searchParams.get(key + '_max');
        acc[key] = {
          min: qMin ? parseFloat(qMin) : defMin,
          max: qMax ? parseFloat(qMax) : defMax,
        };
      } else {
        acc[key] = searchParams.get(key) ?? '';
      }
      return acc;
    }, {} as Record<string, string | number | { min?: number; max?: number }>);
  }, [active, searchParams, filters]);

  const [values, setValues] = useState(initialValues);

  // Reset values when active or initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // Real-time navigation effect with debounce
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      // Start with existing query parameters
      const params = new URLSearchParams(searchParams.toString());
      params.set('type', active);

      const builder = filters.find((f) => f.type === active);
      let shouldNavigate = false;
      const childrenIds = [];

      builder?.inputs.forEach((input) => {
        input.children_ids?.forEach((childId) => {
          childrenIds.push(childId);
        });
        const key = input.key;
        const val = values[key];

        if (input.type === 'range') {
          const defMin = parseFloat(input.values?.min ?? '0');
          const defMax = parseFloat(input.values?.max ?? '0');
          const cur = val as { min?: number; max?: number };

          if (cur.min != null && cur.min !== defMin) {
            params.set(key + '_min', String(cur.min));
            shouldNavigate = true;
          } else {
            params.delete(key + '_min'); // Remove if default
          }
          if (cur.max != null && cur.max !== defMax) {
            params.set(key + '_max', String(cur.max));
            shouldNavigate = true;
          } else {
            params.delete(key + '_max'); // Remove if default
          }
        } else if (val && String(val).trim() !== '') {
          params.set(key, String(val));
          shouldNavigate = true;
        } else {
          params.delete(key); // Remove if empty
        }
      });

      if (childrenIds && childrenIds.length) {
        params.set('fields', childrenIds.join(','));
      } else {
        params.delete('fields');
      }

      if (shouldNavigate) {
        router.push(`/s?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [values, active, router, filters, searchParams]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActive(value);
    router.push(`/s?type=${value}`);
  };

  // Prepare inputs
  const inputs = useMemo(
    () => (filters || []).find((f) => f.type === active)?.inputs || [],
    [active, filters],
  );
  const visibleInputs = inputs.filter(
    (i) =>
      !i.is_dependant ||
      (i.parent_id && (values as unknown)[i.parent_id] != null),
  );

  // Input change handler
  const onChange = (
    key: string,
    value: string | number | { min?: number; max?: number },
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="flex flex-row py-3 w-full absolute ">
        {/* MobileFilters */}
        <div className="flex lg:hidden flex-1 ">
          <Popover>
            <PopoverTrigger>
              <div className="flex flex-row justify-center align-middle ">
                <div className="self-center mx-2">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex justify-center items-center">
                    <i className="fas fa-filter text-[15px] text-primary"></i>
                  </div>
                </div>
                <p className="self-center">Filters</p>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2">
                {visibleInputs.map((i) => (
                  <div className=" w-full flex" key={i.id}>
                    {i.type === 'text' && (
                      <>
                        <div className="self-center mx-2">
                          <div className="w-6 h-6 bg-secondary/10 rounded-full flex justify-center items-center">
                            <i className="fas fa-school text-[10px] text-primary"></i>
                          </div>
                        </div>
                        <Input
                          className="flex-1 border-none placeholder:text-white  font-primary  "
                          id={i.key}
                          placeholder={i.name}
                          value={String(values[i.key] || '')}
                          onChange={(e) =>
                            onChange(i.key, e.currentTarget.value)
                          }
                        />
                      </>
                    )}

                    {i.type === 'select' && (
                      <>
                        <div className="self-center mx-2">
                          <div className="w-6 h-6 bg-secondary/10 rounded-full flex justify-center items-center">
                            <i className="fas fa-school text-[10px] text-primary"></i>
                          </div>
                        </div>
                        <Select
                          onValueChange={(v) => onChange(i.key, v)}
                          value={values[i.key] as string | undefined}
                        >
                          <SelectTrigger
                            className="border-none data-[placeholder]:text-white-400 w-full "
                            id={i.key}
                          >
                            <SelectValue placeholder={i.name} />
                          </SelectTrigger>
                          <SelectContent>
                            {i.options.map((opt) => (
                              <SelectItem key={opt.key} value={String(opt.key)}>
                                {typeof opt.value === 'string'
                                  ? opt.value
                                  : opt.value.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    )}

                    {i.type === 'range' &&
                      (() => {
                        const vals = i.values as {
                          min?: string;
                          max?: string;
                          step?: string;
                        };
                        const minOption = parseFloat(vals?.min ?? '0');
                        const maxOption = parseFloat(vals?.max ?? '100');
                        const step = parseFloat(vals?.step ?? '1');

                        const raw = values[i.key] as
                          | { min?: number; max?: number }
                          | undefined;
                        const minValue = raw?.min ?? minOption;
                        const maxValue = raw?.max ?? maxOption;

                        const safeMin = Math.min(minValue, maxValue);
                        const safeMax = Math.max(minValue, maxValue);

                        return (
                          <Popover>
                            <div className="self-center">
                              <div className="self-center mx-2">
                                <div className="w-6 h-6 bg-secondary/10 rounded-full flex justify-center items-center">
                                  <i className="fas fa-school text-[10px] text-primary"></i>
                                </div>
                              </div>
                            </div>
                            <PopoverTrigger className="w-full text-start text-sm ml-3">
                              {i.name}
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="">
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Min"
                                    value={safeMin}
                                    min={minOption}
                                    max={safeMax}
                                    step={step}
                                    onChange={(e) => {
                                      const v = Number(e.target.value);
                                      if (!isNaN(v))
                                        onChange(i.key, {
                                          min: Math.min(v, safeMax),
                                        });
                                    }}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Max"
                                    value={safeMax}
                                    min={safeMin}
                                    max={maxOption}
                                    step={step}
                                    onChange={(e) => {
                                      const v = Number(e.target.value);
                                      if (!isNaN(v))
                                        onChange(i.key, {
                                          max: Math.max(v, safeMin),
                                        });
                                    }}
                                  />
                                </div>

                                <Slider
                                  min={minOption}
                                  max={maxOption}
                                  step={step}
                                  value={[safeMin, safeMax]}
                                  onValueChange={([min, max]) =>
                                    onChange(i.key, { min, max })
                                  }
                                />
                              </div>
                            </PopoverContent>

                            <div className="self-center">
                              <div className="self-center mr-2">
                                <div className="w-6 h-6 rounded-full flex justify-center items-center">
                                  <i className="fas fa-chevron-down text-[10px] text-gray-10"></i>
                                </div>
                              </div>
                            </div>
                          </Popover>
                        );
                      })()}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Link href="/" className="flex-1  justify-center flex">
          <Image alt="logo" src={'/LOGO.png'} width={100} height={100} />
        </Link>

        {/* lg screens */}
        <div className="hidden lg:block  mx-auto bg-[#0C141A] rounded-xl flex-3 pb-2">
          {/* nav tabs with navigation */}
          <Tabs value={active} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent  w-full gap-1">
              {filters?.map((b) => (
                <TabsTrigger
                  className={` data-[state=active]:bg-primary/50  data-[state=inactive]:bg-primary  rounded-tl-lg rounded-tr-lg rounded-b-none `}
                  key={b.id}
                  value={b.type}
                >
                  {b.name.replace(' Filter', '')}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* dynamic filters */}
          <div className="flex flex-row ">
            {visibleInputs.map((i) => (
              <div className=" w-full flex" key={i.id}>
                {i.type === 'text' && (
                  <Popover>
                    <div className="self-center">
                      <div className="self-center mx-2">
                        <div className="w-6 h-6 bg-secondary/10 rounded-full flex justify-center items-center">
                          <i
                            className={`fa ${i.icon} text-[10px] text-primary`}
                          ></i>
                        </div>
                      </div>
                    </div>
                    <PopoverTrigger className="w-full text-sm">
                      {i.name}
                    </PopoverTrigger>
                    <PopoverContent>
                      <Input
                        className="flex-1 border-none placeholder:text-white placeholder:text-center font-primary  "
                        id={i.key}
                        placeholder={i.name}
                        value={String(values[i.key] || '')}
                        onChange={(e) => onChange(i.key, e.currentTarget.value)}
                      />
                    </PopoverContent>
                    <div className="self-center">
                      <div className="self-center mr-2">
                        <div className="w-6 h-6 rounded-full flex justify-center items-center">
                          <i className="fas fa-chevron-down text-[10px] text-gray-10"></i>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary h-0.5 w-1/4 my-auto rounded-full"></div>
                  </Popover>
                )}

                {i.type === 'select' && (
                  <>
                    <div className="self-center mx-2">
                      <div className="w-6 h-6 bg-secondary/10 rounded-full flex justify-center items-center">
                        <i className={`${i.icon} text-[10px] text-primary`}></i>
                      </div>
                    </div>
                    <Select
                      onValueChange={(v) => onChange(i.key, v)}
                      value={values[i.key] as string | undefined}
                    >
                      <SelectTrigger
                        className="border-none data-[placeholder]:text-white-400 w-full "
                        id={i.key}
                      >
                        <SelectValue placeholder={i.name} />
                      </SelectTrigger>
                      <SelectContent>
                        {i.options.map((opt) => (
                          <SelectItem key={opt.key} value={String(opt.key)}>
                            {typeof opt.value === 'string'
                              ? opt.value
                              : opt.value.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="bg-primary h-0.5 w-1/4 my-auto rounded-full"></div>
                  </>
                )}

                {i.type === 'range' &&
                  (() => {
                    const vals = i.values as {
                      min?: string;
                      max?: string;
                      step?: string;
                    };
                    const minOption = parseFloat(vals?.min ?? '0');
                    const maxOption = parseFloat(vals?.max ?? '100');
                    const step = parseFloat(vals?.step ?? '1');

                    const raw = values[i.key] as
                      | { min?: number; max?: number }
                      | undefined;
                    const minValue = raw?.min ?? minOption;
                    const maxValue = raw?.max ?? maxOption;

                    const safeMin = Math.min(minValue, maxValue);
                    const safeMax = Math.max(minValue, maxValue);

                    return (
                      <Popover>
                        <div className="self-center">
                          <div className="self-center mx-2">
                            <div className="w-6 h-6 bg-secondary/10 rounded-full flex justify-center items-center">
                              <i
                                className={`${i.icon} text-[10px] text-primary`}
                              ></i>
                            </div>
                          </div>
                        </div>
                        <PopoverTrigger className="w-full text-sm">
                          {i.name}
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={safeMin}
                                min={minOption}
                                max={safeMax}
                                step={step}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  if (!isNaN(v))
                                    onChange(i.key, {
                                      min: Math.min(v, safeMax),
                                    });
                                }}
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={safeMax}
                                min={safeMin}
                                max={maxOption}
                                step={step}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  if (!isNaN(v))
                                    onChange(i.key, {
                                      max: Math.max(v, safeMin),
                                    });
                                }}
                              />
                            </div>

                            <Slider
                              min={minOption}
                              max={maxOption}
                              step={step}
                              value={[safeMin, safeMax]}
                              onValueChange={([min, max]) =>
                                onChange(i.key, { min, max })
                              }
                            />
                          </div>
                        </PopoverContent>

                        <div className="self-center">
                          <div className="self-center mr-2">
                            <div className="w-6 h-6 rounded-full flex justify-center items-center">
                              <i className="fas fa-chevron-down text-[10px] text-gray-10"></i>
                            </div>
                          </div>
                        </div>
                        <div className="bg-primary h-0.5 w-1/4 my-auto rounded-full"></div>
                      </Popover>
                    );
                  })()}
              </div>
            ))}
            {/* SearchButton */}
            <div className="flex flex-row justify-center align-middle self-center ">
              <div className="self-center mx-2">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex justify-center items-center">
                  <i className="fas fa-search text-[15px] text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex flex-row justify-center align-middle self-center "></div>
        </div>
      </div>
    </>
  );
}

export default Filter;
