import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
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


export default function EditDialog() {
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
            <div className="">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            variant="default"
                            size="sm"
                            data-test="delete-user-button"
                        >
                            <Trash/>
                        </Button>

                    </DialogTrigger>
                    <DialogContent className='sm:max-w-lg'>
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