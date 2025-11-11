import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import  ActionSearchSidebar  from '@/components/kokonutui/action-search-bar';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
    {/* 🎯 Outer div now uses flex and justify-between to push items to the ends */}
    <div className="flex w-full items-center justify-between">
        
        {/* LEFT/CENTER BLOCK: Sidebar Trigger and Breadcrumbs grouped together */}
        <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>

        {/* RIGHT BLOCK: Action Search Bar pushed to the right-most edge */}
        <div>
            <ActionSearchSidebar/>
        </div>
        
    </div>
</header>
    );
}
