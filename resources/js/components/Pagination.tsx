import { Link } from "@inertiajs/react";

export default function Pagination({ links }){
    return(
        <div className="flex flex-wrap items-center space-x-1 mt-4 justify-end">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url ?? '#'}
                    dangerouslySetInnerHTML={{__html: link.label }}
                    className={`px-3 py-1 text-sm rounded border ${
                        link.active ? 'bg-orange-400 text-white hover:bg-orange-600' : 'bg-white text-gray-700 hover:bg-orange-400'
                    } ${
                        !link.url ? 'pointer-events-none opacity-50' : 'hover:bg-gray-800'
                    }`}
                />
            ))}
        </div>
    )
}