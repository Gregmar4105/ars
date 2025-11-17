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
        title: 'Aircrafts', 
        href: '/aircrafts' 
    },
];

export default function Index({ aircrafts }: any) {
    const { filters } = usePage().props;
    const [search, setSearch] = useState<string>(filters?.search || "");

    // ---- Local instant filtering (unchanged) ----
    const filteredAircrafts = useMemo(() => {
        if (!aircrafts?.data) return [];

        const q = search.toLowerCase();

        return aircrafts.data.filter(({ icao_code, model_name, manufacturer, capacity_pax, wake_turbulence_category }: any) =>
            icao_code.toLowerCase().includes(q) ||
            model_name.toLowerCase().includes(q) ||
            manufacturer.toLowerCase().includes(q) ||
            capacity_pax.toString().includes(q)||
            wake_turbulence_category.toLowerCase().includes(q)
        );
    }, [search, aircrafts]);

    const hasAircrafts = filteredAircrafts.length > 0;

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
            searchToastId.current = toast.loading("Searching aircrafts...");
        } else {
            toast.loading("Searching aircrafts...", { id: searchToastId.current });
        }

        router.get(
            "/aircrafts",
            { search: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ["aircrafts"],

                // onSuccess receives the page props as argument
                onSuccess: (page) => {
                    setLoading(false);

                    // Get updated aircrafts from the returned page props
                    const updatedAircrafts = (page.props.aircrafts as any)?.data || [];

                    if (updatedAircrafts.length > 0) {
                        toast.success("Aircrafts found!", { id: searchToastId.current || undefined });
                    } else {
                        toast.error("No matching aircrafts found.", { id: searchToastId.current || undefined });
                    }

                    searchToastId.current = null;
                },

                onError: () => {
                    setLoading(false);
                    toast.error("Failed to load aircrafts.", { id: searchToastId.current || undefined });
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
            <Head title="Aircrafts" />

            {/* Top Controls: Create + Search */}
            <div className="flex items-center relative">
                <CreateDialog />
                <Search className="absolute left-166 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    type="text"
                    placeholder="Search aircrafts..."
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
                            <TableHead className="text-base font-bold">ICAO Code</TableHead>
                            <TableHead className="text-base font-bold">Aircraft Model</TableHead>
                            <TableHead className="text-base font-bold">Manufacturer</TableHead>
                            <TableHead className="text-base font-bold">Max Capacity</TableHead>
                            <TableHead className="text-base font-bold">Status</TableHead>
                            <TableHead className="text-base font-bold">Turbulence Category</TableHead>
                            <TableHead className="text-base font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {!hasAircrafts && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                                    No aircrafts found.
                                </TableCell>
                            </TableRow>
                        )}

                        {hasAircrafts &&
                            filteredAircrafts.map(({ id, icao_code, model_name, manufacturer, capacity_pax, aircraft_status, wake_turbulence_category }: any) => (
                                <TableRow key={id}>
                                    <TableCell className="font-bold">{icao_code}</TableCell>
                                    <TableCell>{model_name}</TableCell>
                                    <TableCell>{manufacturer}</TableCell>
                                    <TableCell>{capacity_pax}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="default"
                                            className={aircraft_status === "Inactive" ? "bg-red-600 text-white" : "bg-green-500 text-white"}
                                        >
                                            {aircraft_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{wake_turbulence_category}</TableCell>
                                    <TableCell className="flex items-center gap-2">

                                        {/* DIALOGS*/}

                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
                <div className="flex items-center justify-between mt-2 mx-4">
                    <div className="flex items-center gap-2 text-md ">
                        Showing total results: <p className="font-bold">{aircrafts.total}</p> aircraft/s.
                    </div>
                    <Pagination links={aircrafts.links} />
                </div>
        </AppLayout>
    );
}
