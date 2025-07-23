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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define FilterType and InputType interfaces
interface InputType {
  id: string;
  key: string;
  name: string;
  type: 'text' | 'select' | 'range';
  values?: { min?: string; max?: string; step?: string };
  options?: { key: string; value: string | { en: string } }[];
  is_dependant?: boolean;
  parent_id?: string;
  icon?: string;
  children_ids?: { id: string; key: string }[];
}

interface FilterType {
  id: string;
  type: string;
  name: string;
  inputs: InputType[];
}

// Memoized FilterCombobox Component
const FilterCombobox = React.memo(
  function FilterCombobox({ input, value, onChange }) {
    const [open, setOpen] = React.useState(false);

    const options =
      input.options?.map((opt) => ({
        value: String(opt.key),
        label: typeof opt.value === 'string' ? opt.value : opt.value.en,
      })) || [];

    const selectedOption = options.find((opt) => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : input.name;

    // Prevent input click from closing popover
    const handleInputClick = (e) => {
      e.stopPropagation();
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between text-white border-none bg-transparent"
          >
            {displayLabel}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-gray-800 text-white shadow-lg">
          <Command>
            <CommandInput
              placeholder={`Search ${input.name}...`}
              className="text-white"
              onClick={handleInputClick}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
              }}
            />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onChange(input.key, option.value);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.input === nextProps.input && prevProps.value === nextProps.value
    );
  },
);

// Memoized Filter Component
const Filter = React.memo(function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRun = useRef(true);

  // State for filters config
  const [filters, setFilters] = useState<FilterType[] | null>(null);

  // Load filters on mount
  useEffect(() => {
    async function loadFilters() {
      try {
        console.log('Loading filters...', process.env.NEXT_PUBLIC_BASE_URI);
        const { data } = await api.get<FilterType[]>('/api/v1/filters');
        setFilters(data);
      } catch (error) {
        console.error('Error loading filters:', error);
        setFilters([]);
      }
    }
    loadFilters();
  }, []);

  // Initialize active tab
  const [active, setActive] = useState<string>(searchParams.get('type') || '');

  // Set default active tab after filters load
  useEffect(() => {
    if (filters && filters.length > 0 && !active) {
      setActive(filters[0].type);
    }
  }, [filters, active]);

  // Build initial values from URL or defaults
  const initialValues = useMemo(() => {
    const builder = (filters || []).find((f) => f.type === active);
    if (!builder) return {};

    const params = new URLSearchParams(searchParams);
    return builder.inputs.reduce((acc, input) => {
      const key = input.key;
      if (input.type === 'range') {
        const defMin = parseFloat(input.values?.min ?? '0');
        const defMax = parseFloat(input.values?.max ?? '0');
        const qMin = params.get(key + '_min');
        const qMax = params.get(key + '_max');
        acc[key] = {
          min: qMin ? parseFloat(qMin) : defMin,
          max: qMax ? parseFloat(qMax) : defMax,
        };
      } else {
        acc[key] = params.get(key) ?? '';
      }
      return acc;
    }, {} as Record<string, string | number | { min?: number; max?: number }>);
  }, [active, filters, searchParams]);

  const [values, setValues] = useState(initialValues);

  // Reset values when initialValues change
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
      const params = new URLSearchParams(searchParams.toString());
      params.set('type', active);

      const builder = filters?.find((f) => f.type === active);
      let shouldNavigate = false;
      const childrenIds = [];
      const dependentKeys = new Set<string>();

      // Collect all dependent input keys
      builder?.inputs.forEach((input) => {
        if (input.children_ids?.length) {
          input.children_ids.forEach((child) => {
            childrenIds.push(child.id);
            dependentKeys.add(child.key);
          });
        }
      });

      // Track parent inputs that have changed
      const changedParents = new Set<string>();
      builder?.inputs.forEach((input) => {
        const key = input.key;
        const val = values[key];

        // Check if input is a parent by looking for children_ids
        if (input.children_ids?.length) {
          const paramValue =
            input.type === 'range'
              ? `${values[key]?.min}_${values[key]?.max}`
              : String(val);
          const searchParamValue =
            input.type === 'range'
              ? `${searchParams.get(key + '_min')}_${searchParams.get(
                  key + '_max',
                )}`
              : searchParams.get(key);
          if (paramValue !== searchParamValue) {
            changedParents.add(key);
          }
        }

        // Set or delete URL parameters for current inputs
        if (input.type === 'range') {
          const defMin = parseFloat(input.values?.min ?? '0');
          const defMax = parseFloat(input.values?.max ?? '0');
          const cur = val as { min?: number; max?: number };

          if (cur.min != null && cur.min !== defMin) {
            params.set(key + '_min', String(cur.min));
            shouldNavigate = true;
          } else {
            params.delete(key + '_min');
          }
          if (cur.max != null && cur.max !== defMax) {
            params.set(key + '_max', String(cur.max));
            shouldNavigate = true;
          } else {
            params.delete(key + '_max');
          }
        } else if (val && String(val).trim() !== '') {
          params.set(key, String(val));
          shouldNavigate = true;
        } else {
          params.delete(key);
        }
      });

      // Clear dependent parameters if their parent has changed
      dependentKeys.forEach((depKey) => {
        const input = builder?.inputs.find((inp) =>
          inp.children_ids?.some((child) => child.key === depKey),
        );
        if (input && changedParents.has(input.key)) {
          params.delete(depKey);
          setValues((prev) => ({ ...prev, [depKey]: '' }));
        }
      });

      // Update fields parameter
      if (childrenIds.length) {
        params.set('fields', childrenIds.join(','));
      } else {
        params.delete('fields');
      }

      if (shouldNavigate) {
        router.push(`/s?${params.toString()}`, { scroll: false });
      }
    }, 300);

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
      !i.is_dependant || (i.parent_id && (values as any)[i.parent_id] != null),
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
      <div className="flex flex-row py-3 w-full absolute">
        {/* MobileFilters */}
        <div className="flex lg:hidden flex-1 ml-5">
          <Popover>
            <PopoverTrigger>
              <div className="flex flex-row justify-center align-middle">
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
                  <div className="w-full flex" key={i.id}>
                    {i.type === 'text' && (
                      <>
                        <div className="self-center mx-2">
                          <div className="w-6 h-6 bg-secondary/10 rounded-full flex justify-center items-center">
                            <i className="fas fa-school text-[10px] text-primary"></i>
                          </div>
                        </div>
                        <Input
                          className="flex-1 border-none placeholder:text-white font-primary"
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
                        <FilterCombobox
                          input={i}
                          value={values[i.key] as string | undefined}
                          onChange={onChange}
                        />
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

        <Link href="/" className="flex-1 justify-center flex">
          <Image alt="logo" src={'/LOGO.png'} width={100} height={100} />
        </Link>

        {/* lg screens */}
        <div className="hidden lg:block mx-auto bg-[#0C141A] rounded-xl flex-3 pb-2">
          <Tabs value={active} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent w-full gap-1">
              {filters?.map((b) => (
                <TabsTrigger
                  className="data-[state=active]:bg-primary/50 data-[state=inactive]:bg-primary rounded-tl-lg rounded-tr-lg rounded-b-none"
                  key={b.id}
                  value={b.type}
                >
                  {b.name.replace(' Filter', '')}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-row">
            {visibleInputs.map((i) => (
              <div className="w-full flex" key={i.id}>
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
                        className="flex-1 border-none placeholder:text-white placeholder:text-center font-primary"
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
                    <FilterCombobox
                      input={i}
                      value={values[i.key] as string | undefined}
                      onChange={onChange}
                    />
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
            <div className="flex flex-row justify-center align-middle self-center">
              <div className="self-center mx-2">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex justify-center items-center">
                  <i className="fas fa-search text-[15px] text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex flex-row justify-center align-middle self-center"></div>
        </div>
      </div>
    </>
  );
});

export default Filter;
