import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';


export default function CreateDialog() {
    const {data, setData, post, processing, errors, reset} = useForm({
        iata_code: '',
        airport_name: '',
        city:'',
        country:'',
        timezone:'',
        airport_status:'',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/airports');
    }

    return (
        <div className="space-y-6">
            <div className="m-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-orange-400 hover:bg-orange-600"
                            variant="default"
                            size="sm"
                            data-test="delete-user-button"
                        >
                            <Plus/>
                            Create
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-2xl'>
                        <DialogTitle>
                            Create Airport
                        </DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new airport.
                        </DialogDescription>

                        <form onSubmit={submit}>
                            <div className="grid gap-3">
                                {/* IATA Code */}
                                <Label htmlFor="iata_code">
                                    IATA Code
                                </Label>    
                                <Input
                                    id="iata_code"
                                    value={data.iata_code}
                                    onChange={(e) => setData('iata_code' , e.target.value)}
                                    type="text"
                                    name="iata_code"
                                    placeholder="eg. MNL"
                                />
                                <InputError message={errors.iata_code} />
                                
                                {/* Airport Name - FIX: Added value and onChange */}
                                <Label htmlFor="airport_name">
                                    Airport Name
                                </Label>    
                                <Input
                                    id="airport_name"
                                    value={data.airport_name}
                                    onChange={(e) => setData('airport_name' , e.target.value)}
                                    type="text"
                                    name="airport_name"
                                    placeholder="eg. Manila International Airport"
                                />
                                <InputError message={errors.airport_name} />

                                {/* City - FIX: Added value and onChange */}
                                <Label htmlFor="city">
                                    City
                                </Label>    
                                <Input
                                    id="city"
                                    value={data.city}
                                    onChange={(e) => setData('city' , e.target.value)}
                                    type="text"
                                    name="city"
                                    placeholder="eg. manila"
                                />
                                <InputError message={errors.city} />

                                {/* Country - FIX: Added value and onChange */}
                                <Label htmlFor="country">
                                    Country
                                </Label>    
                                <Input
                                    id="country"
                                    value={data.country}
                                    onChange={(e) => setData('country' , e.target.value)}
                                    type="text"
                                    name="country"
                                    placeholder="eg. Philippines"
                                />
                                <InputError message={errors.country} />

                                {/* Status - FIX: Added value and onChange */}
                                <Label htmlFor="airport_status">
                                    Status
                                </Label>    
                                <Input
                                    id="airport_status"
                                    value={data.airport_status}
                                    onChange={(e) => setData('airport_status' , e.target.value)}
                                    type="text"
                                    name="airport_status"
                                    placeholder="eg. Active"
                                />
                                <InputError message={errors.airport_status} />

                                {/* Timezone - FIX: Added value and onChange */}
                                <Label htmlFor="timezone">
                                    Timezone
                                </Label>    
                                <Input
                                    id="timezone"
                                    value={data.timezone}
                                    onChange={(e) => setData('timezone' , e.target.value)}
                                    type="text"
                                    name="timezone"
                                    placeholder="eg. Asia/Manila"
                                />
                                <InputError message={errors.timezone} />           
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        className="mt-4 hover:bg-gray-200"
                                        variant="secondary"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    className="mt-4 bg-orange-400 hover:bg-orange-600"
                                    variant="default"
                                    disabled={processing}
                                    asChild
                                >
                                    <button
                                        type="submit"
                                    >
                                        Create Airport
                                    </button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}