// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import locationData from '../../app/data/locations.json'; // Adjust the path as needed

// interface Location {
//   country: string;
//   code: string;
//   cities: string[];
// }

// export function LocationModal() {
//   const [open, setOpen] = useState(false);
//   const [countryOpen, setCountryOpen] = useState(false);
//   const [cityOpen, setCityOpen] = useState(false);
//   const [country, setCountry] = useState('');
//   const [city, setCity] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState<Location | null>(null);

//   // Open the dialog on mount
//   useEffect(() => {
//     setOpen(true);
//     console.log('Locations loaded:', locationData);
//   }, []);

//   const handleSave = () => {
//     if (country && city) {
//       console.log('Saved selection:', { country, city });
//       setOpen(false);
//     }
//   };

//   const locations: Location[] = locationData;

//   const handleCountrySelect = (value: string) => {
//     const selectedLoc = locations.find((l) => l.country === value);
//     if (selectedLoc) {
//       setCountry(value);
//       setSelectedCountry(selectedLoc);
//       setCity('');
//       setCountryOpen(false);
//     }
//   };

//   const handleCitySelect = (value: string) => {
//     setCity(value);
//     setCityOpen(false);
//   };

//   // Prevent dialog from intercepting popover clicks
//   const stopPropagation = (e: React.MouseEvent) => {
//     e.stopPropagation();
//   };

//   return (
//     // <div className="fixed inset-0 z-50 flex items-center justify-center">
//     //   <div className="space-y-4 py-4">
//     //     <div className="space-y-2">
//     //       <Label htmlFor="country">Country</Label>
//     //       <Popover open={countryOpen} onOpenChange={setCountryOpen}>
//     //         <PopoverTrigger asChild>
//     //           <Button
//     //             variant="outline"
//     //             role="combobox"
//     //             aria-expanded={countryOpen}
//     //             className="w-full justify-between"
//     //             onClick={() => setCountryOpen((prev) => !prev)}
//     //           >
//     //             {country || 'Select a country...'}
//     //             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//     //           </Button>
//     //         </PopoverTrigger>
//     //         <PopoverContent
//     //           className="w-[var(--radix-popover-trigger-width)] p-0"
//     //           align="start"
//     //         >
//     //           <Command>
//     //             <CommandInput placeholder="Search country..." />
//     //             <CommandList>
//     //               <CommandEmpty>No country found.</CommandEmpty>
//     //               <CommandGroup>
//     //                 {locations.map((loc) => (
//     //                   <CommandItem
//     //                     key={loc.code}
//     //                     value={loc.country}
//     //                     onSelect={handleCountrySelect}
//     //                     onMouseDown={stopPropagation}
//     //                   >
//     //                     <Check
//     //                       className={cn(
//     //                         'mr-2 h-4 w-4',
//     //                         country === loc.country
//     //                           ? 'opacity-100'
//     //                           : 'opacity-0',
//     //                       )}
//     //                     />
//     //                     {loc.country}
//     //                   </CommandItem>
//     //                 ))}
//     //               </CommandGroup>
//     //             </CommandList>
//     //           </Command>
//     //         </PopoverContent>
//     //       </Popover>
//     //     </div>
//     //     {selectedCountry && (
//     //       <div className="space-y-2">
//     //         <Label htmlFor="city">City</Label>
//     //         <Popover open={cityOpen} onOpenChange={setCityOpen}>
//     //           <PopoverTrigger asChild>
//     //             <Button
//     //               variant="outline"
//     //               role="combobox"
//     //               className="w-full justify-between"
//     //               onClick={() => setCityOpen((prev) => !prev)}
//     //             >
//     //               {city || 'Select a city...'}
//     //               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//     //             </Button>
//     //           </PopoverTrigger>
//     //           <PopoverContent
//     //             className="w-[var(--radix-popover-trigger-width)] p-0"
//     //             align="start"
//     //           >
//     //             <Command>
//     //               <CommandInput placeholder="Search city..." />
//     //               <CommandList>
//     //                 <CommandEmpty>No city found.</CommandEmpty>
//     //                 <CommandGroup>
//     //                   {selectedCountry.cities.map((cityName) => (
//     //                     <CommandItem
//     //                       key={cityName}
//     //                       value={cityName}
//     //                       onSelect={handleCitySelect}
//     //                       onMouseDown={stopPropagation}
//     //                     >
//     //                       <Check
//     //                         className={cn(
//     //                           'mr-2 h-4 w-4',
//     //                           city === cityName ? 'opacity-100' : 'opacity-0',
//     //                         )}
//     //                       />
//     //                       {cityName}
//     //                     </CommandItem>
//     //                   ))}
//     //                 </CommandGroup>
//     //               </CommandList>
//     //             </Command>
//     //           </PopoverContent>
//     //         </Popover>
//     //       </div>
//     //     )}
//     //     {/* <Button
//     //         onClick={handleSave}
//     //         disabled={!country || !city}
//     //         className="w-full"
//     //       >
//     //         Save
//     //       </Button> */}
//     //   </div>
//     // </div>

//     <></>
//   );
// }

// export default LocationModal;
