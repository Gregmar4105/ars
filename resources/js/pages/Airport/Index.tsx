"use client";
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Pencil, Trash } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import CreateDialog from './Create-Dialog';
import { type BreadcrumbItem } from '@/types';
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Airports',
        href: '/airports',
    },
];

export default function Index({ airports }) {
    const hasAirports = airports?.data && airports.data.length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Airports" />
            <CreateDialog />
            
            <div
                className="ml-4 bg-white border border-black dark:border-white
                dark:bg-primary-foreground p-4 rounded-lg"
            >
                <Table className="w-full">
                    <TableCaption></TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>IATA Code</TableHead>
                            <TableHead>Airport Name</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Timezone</TableHead>
                            <TableHead>Actions</TableHead>
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
                            airports.data.map(({ id, iata_code, airport_name, city, country, airport_status, timezone }) => (
                                <TableRow key={id}>
                                    <TableCell>{iata_code}</TableCell>
                                    <TableCell>{airport_name}</TableCell>
                                    <TableCell>{city}</TableCell>
                                    <TableCell>{country}</TableCell>
                                    <TableCell>
                                        <Badge>{airport_status}</Badge>
                                    </TableCell>
                                    <TableCell>{timezone}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" title="Edit">
                                            <Pencil size={16} />
                                        </Button>
                                        <Button variant="ghost" size="sm" title="Delete">
                                            <Trash size={16} />
                                        </Button>
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
