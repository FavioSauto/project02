'use client';

import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { Check, ChevronsUpDown, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockGooglePlacesSearch } from '../utils/mock-apis';

interface LocationOption {
  id: string;
  name: string;
  type: 'standard' | 'hidden_gem';
  category: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  typicalVisitDuration: number;
  description: string;
}

interface LocationSelectorProps {
  value?: LocationOption | null;
  onSelect: (location: LocationOption) => void;
  destination?: string;
  placeholder?: string;
}

export function LocationSelector({ value, onSelect, destination, placeholder = 'Search locations...' }: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'standard' | 'hidden_gem'>('all');

  useEffect(
    function loadLocations() {
      async function fetchLocations() {
        if (!destination && !searchQuery) {
          setLocations([]);
          return;
        }

        setIsLoading(true);
        try {
          const query = destination || searchQuery;
          const type = filterType === 'all' ? undefined : filterType;
          const results = await mockGooglePlacesSearch(query, type);
          setLocations(results);
        } catch (error) {
          setLocations([]);
        } finally {
          setIsLoading(false);
        }
      }

      const debounce = setTimeout(fetchLocations, 300);
      return () => clearTimeout(debounce);
    },
    [destination, searchQuery, filterType]
  );

  function handleSelect(location: LocationOption) {
    onSelect(location);
    setOpen(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Toggle
          pressed={filterType === 'standard'}
          onPressedChange={(pressed) => setFilterType(pressed ? 'standard' : 'all')}
          size="sm"
        >
          Standard
        </Toggle>
        <Toggle
          pressed={filterType === 'hidden_gem'}
          onPressedChange={(pressed) => setFilterType(pressed ? 'hidden_gem' : 'all')}
          size="sm"
        >
          Hidden Gems
        </Toggle>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value ? (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {value.name}
              </span>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder="Search locations..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center text-sm">Loading locations...</div>
              ) : (
                <>
                  <CommandEmpty>No locations found.</CommandEmpty>
                  <CommandGroup>
                    {locations.map((location) => (
                      <CommandItem
                        key={location.id}
                        value={location.id}
                        onSelect={() => handleSelect(location)}
                        className="flex flex-col items-start gap-1 py-3"
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Check
                              className={cn(
                                'h-4 w-4',
                                value?.id === location.id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            <span className="font-medium">{location.name}</span>
                          </div>
                          <Badge variant={location.type === 'hidden_gem' ? 'secondary' : 'outline'}>
                            {location.type === 'hidden_gem' ? 'Hidden Gem' : 'Standard'}
                          </Badge>
                        </div>
                        <div className="ml-6 flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {location.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {location.typicalVisitDuration} min
                          </span>
                        </div>
                        {location.description && (
                          <p className="ml-6 text-xs text-muted-foreground line-clamp-1">
                            {location.description}
                          </p>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value && (
        <div className="rounded-lg border p-3 text-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{value.name}</p>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
            <Badge variant={value.type === 'hidden_gem' ? 'secondary' : 'outline'}>
              {value.type === 'hidden_gem' ? 'Hidden Gem' : 'Standard'}
            </Badge>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {value.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Typical visit: {value.typicalVisitDuration} minutes
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

