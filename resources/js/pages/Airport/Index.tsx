"use client";
import { useState, useMemo } from 'react';
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

const breadcrumbs: BreadcrumbItem[] = [
    { 
        title: 'Airports', 
        href: '/airports' 
    },
];

export default function Index({ airports }) {
    const [search, setSearch] = useState("");

    // Filter airports based on search input
    const filteredAirports = useMemo(() => {
        if (!airports?.data) return [];
        return airports.data.filter(({ iata_code, airport_name, city, country }) =>
            iata_code.toLowerCase().includes(search.toLowerCase()) ||
            airport_name.toLowerCase().includes(search.toLowerCase()) ||
            city.toLowerCase().includes(search.toLowerCase()) ||
            country.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, airports]);

    const hasAirports = filteredAirports.length > 0;

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
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-400 w-full max-w-xl rounded-md px-3 py-1 mr-4 focus:outline-none focus:ring focus:ring-gray-300"
                >
                </Input>
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
                            filteredAirports.map(({ id, iata_code, airport_name, city, country, airport_status, timezone }) => (
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

            <Pagination links={airports.links} />
        </AppLayout>
    );
}
