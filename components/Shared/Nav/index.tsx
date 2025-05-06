'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import dummyData from './dummydata.json';

function Filter() {
  const router = useRouter();
  const [active, setActive] = useState(dummyData[0].model_type);

  // Build initial values from JSON defaults
  const initialValues = useMemo(() => {
    const builder = dummyData.find((b) => b.model_type === active);
    if (!builder) return {};
    return builder.inputs.reduce<Record<string, unknown>>((acc, input) => {
      if (input.type === 'range') {
        const vals = input.values as {
          min?: string;
          max?: string;
          step?: string;
        };
        acc[input.key] = {
          min: parseFloat(vals?.min ?? '0'),
          max: parseFloat(vals?.max ?? '0'),
        };
      } else {
        acc[input.key] = '';
      }
      return acc;
    }, {});
  }, [active]);

  const [values, setValues] = useState<Record<string, unknown>>(initialValues);

  // Reset values when switching tab defaults change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // fecth when filter change
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeout);
  }, [values, active]);

  // Handle tab change: reset filters and navigate only with model_type
  const handleTabChange = (value: string) => {
    setActive(value);
    // reset values to defaults for new tab
    const builder = dummyData.find((b) => b.model_type === value);
    const defaults = builder
      ? builder.inputs.reduce<Record<string, unknown>>((acc, input) => {
          if (input.type === 'range') {
            const vals = input.values as { min?: string; max?: string };
            acc[input.key] = {
              min: parseFloat(vals?.min ?? '0'),
              max: parseFloat(vals?.max ?? '0'),
            };
          } else {
            acc[input.key] = '';
          }
          return acc;
        }, {})
      : {};
    setValues(defaults);
    // navigate with only model_type param
    router.push(`/results?model_type=${value}`);
  };

  // Handle search button click: navigate with all params
  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('model_type', active);
    Object.entries(values).forEach(([key, val]) => {
      if (typeof val === 'object' && val !== null) {
        const range = val as { min?: number; max?: number };
        if (range.min != null) params.set(`${key}_min`, String(range.min));
        if (range.max != null) params.set(`${key}_max`, String(range.max));
      } else {
        params.set(key, String(val));
      }
    });
    router.push(`/results?${params.toString()}`);
  };

  const inputs = useMemo(() => {
    const builder = dummyData.find((b) => b.model_type === active);
    return builder ? builder.inputs : [];
  }, [active]);

  const visibleInputs = inputs.filter(
    (i) => !i.is_dependant || (i.parent_id && values[i.parent_id] != null),
  );

  const onChange = (
    key: string,
    value: string | number | Record<string, number>,
  ) =>
    setValues((prev) => {
      const existing = prev[key];
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        return {
          ...prev,
          [key]: {
            ...(typeof existing === 'object' && existing !== null
              ? existing
              : {}),
            ...value,
          },
        };
      }
      return { ...prev, [key]: value };
    });

  return (
    <>
      <div className="flex flex-row py-3">
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

        <div className="flex-1  justify-center flex">
          <Image alt="logo" src={'/LOGO.png'} width={100} height={100} />
        </div>

        {/* lg screens */}
        <div className="hidden lg:block  mx-auto bg-[#0C141A] rounded-b-full flex-3">
          {/* nav tabs with navigation */}

          <Tabs value={active} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent  w-full gap-1">
              {dummyData.map((b) => (
                <TabsTrigger
                  className={` data-[state=active]:bg-primary/50  data-[state=inactive]:bg-primary  rounded-tl-lg rounded-tr-lg rounded-b-none `}
                  key={b.id}
                  value={b.model_type}
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
                          <i className="fas fa-school text-[10px] text-primary"></i>
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
                              <i className="fas fa-school text-[10px] text-primary"></i>
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
            <div>
              <Button className="bg-transparent" onClick={handleSearch}>
                <div className="self-center ">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex justify-center items-center">
                    <i className="fas fa-search text-sm text-primary"></i>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex flex-row justify-center align-middle self-center ">
            <div className="self-center mx-2">
              <div className="w-8 h-8 bg-secondary/10 rounded-full flex justify-center items-center">
                <i className="fas fa-bars text-[15px] text-primary"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Filter;
