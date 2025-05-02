'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
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
        const values = input.values as
          | { min?: string; max?: string; step?: string }
          | undefined;
        acc[input.key] = {
          min: parseFloat(values?.min ?? '0'),
          max: parseFloat(values?.max ?? '0'),
        };
      } else {
        acc[input.key] = '';
      }
      return acc;
    }, {});
  }, [active]);

  const [values, setValues] = useState<Record<string, unknown>>(initialValues);

  // Reset values when switching tabs
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

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

  const handleSearch = () => {
    // 1) grab all current values
    const params = new URLSearchParams();
    params.set('model_type', active);

    // 2) flatten your `values` object into query params
    Object.entries(values).forEach(([key, val]) => {
      if (typeof val === 'object' && val !== null) {
        // a range: { min, max }
        const range = val as { min?: number; max?: number };
        if (range.min != null) params.set(`${key}_min`, String(range.min));
        if (range.max != null) params.set(`${key}_max`, String(range.max));
      } else {
        // primitive
        params.set(key, String(val));
      }
    });

    // 3) push to /results?…
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* nav tabs */}
      <Tabs value={active} onValueChange={setActive}>
        <TabsList>
          {dummyData.map((b) => (
            <TabsTrigger key={b.id} value={b.model_type}>
              {b.name.replace(' Filter', '')}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* dynamic filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        {visibleInputs.map((i) => (
          <div key={i.id}>
            <Label htmlFor={i.key}>{i.name}</Label>

            {i.type === 'text' && (
              <Input
                id={i.key}
                placeholder={i.placeholder}
                value={String(values[i.key] || '')}
                onChange={(e) => onChange(i.key, e.currentTarget.value)}
              />
            )}

            {i.type === 'select' && (
              <Select
                onValueChange={(v) => onChange(i.key, v)}
                value={values[i.key] as string | undefined}
              >
                <SelectTrigger id={i.key}>
                  <SelectValue placeholder={i.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {i.options.map((opt) => (
                    <SelectItem key={opt.key} value={String(opt.key)}>
                      {typeof opt.value === 'string' ? opt.value : opt.value.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {i.type === 'range' &&
              (() => {
                // Use JSON-defined values
                const minOption = parseFloat(
                  (i.values && 'min' in i.values ? i.values.min : '0') ?? '0',
                );
                const maxOption = parseFloat(
                  (i.values && typeof i.values === 'object' && 'max' in i.values
                    ? i.values.max
                    : '100') ?? '100',
                );
                const step = parseFloat(
                  (i.values as { step?: string } | undefined)?.step ?? '1',
                );

                const raw = values[i.key] as
                  | { min?: number; max?: number }
                  | undefined;
                const minValue = raw?.min ?? minOption;
                const maxValue = raw?.max ?? maxOption;

                const safeMin = Math.min(minValue, maxValue);
                const safeMax = Math.max(minValue, maxValue);

                return (
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
                            onChange(i.key, { min: Math.min(v, safeMax) });
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
                            onChange(i.key, { max: Math.max(v, safeMin) });
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
                );
              })()}
          </div>
        ))}
        <div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
    </div>
  );
}

export default Filter;
