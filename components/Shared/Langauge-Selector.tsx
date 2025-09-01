'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Check } from 'lucide-react';

export default function Component() {
  const [open, setOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const countries = [
    { value: 'ksa', label: 'KSA', flag: '🇸🇦' },
    { value: 'uae', label: 'United Arab Emirates', flag: '🇦🇪' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCountry = localStorage.getItem('country');
      if (storedCountry && countries.some((c) => c.value === storedCountry)) {
        setCurrentCountry(storedCountry);
        setSelectedCountry(storedCountry);
      }
    }
  }, []);

  const handleCountrySelect = (value: string) => {
    setSelectedCountry(value);
  };

  const handleConfirm = () => {
    if (selectedCountry) {
      localStorage.setItem('country', selectedCountry);
      setCurrentCountry(selectedCountry);
      console.log('Selected country:', selectedCountry);
      // Here you would typically update your app's settings based on country
      setOpen(false);
    }
  };

  const selectedCountryObj = countries.find((c) => c.value === currentCountry);

  return (
    // <div className="flex min-h-screen items-center justify-center bg-gray-50">
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          {selectedCountryObj ? (
            <>
              <span>{selectedCountryObj.flag}</span>
              {selectedCountryObj.label}
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              Choose Country
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Select Country
          </DialogTitle>
          <DialogDescription>
            Choose your preferred country for the application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="country-select" className="text-sm font-medium">
              Country
            </label>
            <Select value={selectedCountry} onValueChange={handleCountrySelect}>
              <SelectTrigger id="country-select">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    <div className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedCountry}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    // </div>
  );
}
