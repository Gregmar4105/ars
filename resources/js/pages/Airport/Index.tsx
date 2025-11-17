"use client";
import { useState, useMemo, useRef, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { toast } from "sonner";
import CreateDialog from './Create-Dialog';
import EditDialog from './Edit-Dialog';
import DeleteDialog from './Delete-Dialog';
import ShowDialog from './Show-Dialog';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { 
        title: 'Airports', 
        href: '/airports' 
    },
];

export default function Index({ airports }: any) {
    const { filters } = usePage().props;
    const [search, setSearch] = useState<string>(filters?.search || "");

    // ---- Local instant filtering (unchanged) ----
    const filteredAirports = useMemo(() => {
        if (!airports?.data) return [];
        const q = search.toLowerCase();
        return airports.data.filter(({ iata_code, airport_name, city, country, timezone }: any) =>
            iata_code.toLowerCase().includes(q) ||
            airport_name.toLowerCase().includes(q) ||
            city.toLowerCase().includes(q) ||
            country.toLowerCase().includes(q)||
            timezone.toLowerCase().includes(q)
        );
    }, [search, airports]);

    const hasAirports = filteredAirports.length > 0;

    // ---- Debounce timer ref ----
    const debounceTimer = useRef<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [showNoResults, setShowNoResults] = useState(false);
    const searchToastId = useRef<string | number | null>(null);


    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                window.clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    // ---- server search (debounced) ----
    function scheduleServerSearch(value: string, delay = 300) {
    if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
        if (!searchToastId.current) {
            searchToastId.current = toast.loading("Searching airports...");
        } else {
            toast.loading("Searching airports...", { id: searchToastId.current });
        }

        router.get(
            "/airports",
            { search: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ["airports"],

                // onSuccess receives the page props as argument
                onSuccess: (page) => {
                    setLoading(false);

                    // Get updated airports from the returned page props
                    const updatedAirports = (page.props.airports as any)?.data || [];

                    if (updatedAirports.length > 0) {
                        toast.success("Airports found!", { id: searchToastId.current || undefined });
                    } else {
                        toast.error("No matching airports found.", { id: searchToastId.current || undefined });
                    }

                    searchToastId.current = null;
                },

                onError: () => {
                    setLoading(false);
                    toast.error("Failed to load airports.", { id: searchToastId.current || undefined });
                    searchToastId.current = null;
                },
            }
        );
    }, delay);
}


    // ---- Handler for input changes ----
    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setSearch(value);

        // update URL without reload
        const url = new URL(window.location.href);
        if (value) url.searchParams.set("search", value);
        else url.searchParams.delete("search");
        window.history.pushState({}, "", url);

        // schedule server search for fresh DB results (debounced)
        scheduleServerSearch(value, 300);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Airports" />

            {/* Top Controls: Create + Search */}
            <div className="flex items-center relative">
                <CreateDialog />
                <Search className="absolute left-166 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    type="text"
                    placeholder="Search airports..."
                    value={search}
                    onChange={handleSearchChange}
                    className="border border-gray-400 w-full max-w-xl rounded-md px-3 py-1 mr-4 focus:outline-none focus:ring focus:ring-gray-300"
                />
            </div>

            {/* Airports Table */}
            <div className="mx-4 bg-white border border-black dark:border-white dark:bg-primary-foreground p-4 rounded-lg">
                <Table className="w-full">
                    <TableCaption></TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-base font-bold">IATA Code</TableHead>
                            <TableHead className="text-base font-bold">Airport Name</TableHead>
                            <TableHead className="text-base font-bold">City</TableHead>
                            <TableHead className="text-base font-bold">Country</TableHead>
                            <TableHead className="text-base font-bold">Status</TableHead>
                            <TableHead className="text-base font-bold">Timezone</TableHead>
                            <TableHead className="text-base font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {!hasAirports && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                                    No airports found.
                                </TableCell>
                            </TableRow>
                        )}

                        {hasAirports &&
                            filteredAirports.map(({ id, iata_code, airport_name, city, country, airport_status, timezone }: any) => (
                                <TableRow key={id}>
                                    <TableCell className="font-bold">{iata_code}</TableCell>
                                    <TableCell>{airport_name}</TableCell>
                                    <TableCell>{city}</TableCell>
                                    <TableCell>{country}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="default"
                                            className={airport_status === "Inactive" ? "bg-red-600 text-white" : "bg-green-500 text-white"}
                                        >
                                            {airport_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{timezone}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <ShowDialog/>
                                        <EditDialog/>
                                        <DeleteDialog/>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
                <div className="flex items-center justify-between mt-2 mx-4">
                    <div className="flex items-center gap-2 text-md ">
                        Showing total results: <p className="font-bold">{airports.total}</p> airport/s.
                    </div>
                    <Pagination links={airports.links} />
                </div>
        </AppLayout>
    );
}
