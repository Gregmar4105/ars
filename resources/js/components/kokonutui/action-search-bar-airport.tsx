"use client";

/**
 * @author: @kokonutui
 * @description: A modern search bar component with action buttons and suggestions
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import {
    Search,
    Send,
    BarChart2,
    Video,
    PlaneTakeoff,
    AudioLines,
    LayoutGrid,
} from "lucide-react";

/**
 * Local useDebounce hook to avoid relying on a missing "@/hooks/use-debounce" module.
 * Keeps the same API: const debounced = useDebounce(value, delay);
 */
function useDebounce<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export interface IAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    description?: string;
    short?: string;
    end?: string;
}

interface SearchResult {
    actions: IAction[];
}

const ANIMATION_VARIANTS = {
    container: {
        hidden: { opacity: 0, height: 0 },
        show: {
            opacity: 1,
            height: "auto",
            transition: {
                height: { duration: 0.4 },
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
            },
        },
    },
    item: {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2 },
        },
    },
} as const;

const allActionsSample = [
    {
        id: "1",
        label: "Book tickets",
        icon: <PlaneTakeoff className="h-4 w-4 text-blue-500" />,
        description: "Operator",
        short: "⌘K",
        end: "Agent",
    },
];

function ActionSearchBarAirport({
    actions = allActionsSample,
    defaultOpen = false,
    className,
}: {
    actions?: IAction[];
    defaultOpen?: boolean;
    className?: string;
}) {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<SearchResult | null>(null);
    const [isFocused, setIsFocused] = useState(defaultOpen);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedAction, setSelectedAction] = useState<IAction | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debouncedQuery = useDebounce(query, 200);

    const filteredActions = useMemo(() => {
        if (!debouncedQuery) return actions;

        const normalizedQuery = debouncedQuery.toLowerCase().trim();
        return actions.filter((action) => {
            const searchableText =
                `${action.label} ${action.description || ""}`.toLowerCase();
            return searchableText.includes(normalizedQuery);
        });
    }, [debouncedQuery, actions]);

    useEffect(() => {
        if (!isFocused) {
            setResult(null);
            setActiveIndex(-1);
            return;
        }

        setResult({ actions: filteredActions });
        setActiveIndex(-1);
    }, [filteredActions, isFocused]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setIsTyping(true);
            setActiveIndex(-1);
        },
        []
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!result?.actions.length) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev < result.actions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : result.actions.length - 1
                    );
                    break;
                case "Enter":
                    e.preventDefault();
                    if (activeIndex >= 0 && result.actions[activeIndex]) {
                        setSelectedAction(result.actions[activeIndex]);
                    }
                    break;
                case "Escape":
                    setIsFocused(false);
                    setActiveIndex(-1);
                    break;
            }
        },
        [result?.actions, activeIndex]
    );

    const handleActionClick = useCallback((action: IAction) => {
        setSelectedAction(action);
    }, []);

    const handleFocus = useCallback(() => {
        setSelectedAction(null);
        setIsFocused(true);
        setActiveIndex(-1);
    }, []);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            setIsFocused(false);
            setActiveIndex(-1);
        }, 200);
    }, []);

    return (
    // Outer container: Removed max-w-xl to allow the inner container to expand.
    <div className="w-xl mr-4">
        {/* New relative container for the search input and dropdown */}
        {/* *** MODIFIED CLASSNAME HERE ***
            Changed 'max-w-sm mx-auto' to 'max-w-full'. 
            This makes the search bar take up the full width of its parent container.
        */}
        <div className="relative w-full max-w-full">
            {/* Search Input Container */}
            <div className="w-full bg-background">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="What's up?"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        role="combobox"
                        aria-expanded={isFocused && !!result}
                        aria-autocomplete="list"
                        aria-activedescendant={
                            activeIndex >= 0
                                ? `action-${result?.actions[activeIndex]?.id}`
                                : undefined
                        }
                        id="search"
                        autoComplete="off"
                        className="pl-3 pr-9 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
                        <AnimatePresence mode="popLayout">
                            {query.length > 0 ? (
                                <motion.div
                                    key="send"
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="search"
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Search Results Dropdown: Made absolute to overlay content */}
            <AnimatePresence>
                {isFocused && result && !selectedAction && (
                    <motion.div
                        // Key changes: absolute, top-full, z-20, left-0, right-0
                        className="absolute w-full border rounded-md shadow-lg overflow-hidden dark:border-gray-800 bg-white dark:bg-black top-full mt-1 z-20 left-0 right-0"
                        variants={ANIMATION_VARIANTS.container}
                        role="listbox"
                        aria-label="Search results"
                        initial="hidden"
                        animate="show"
                        exit="exit"
                    >
                        <motion.ul role="none">
                            {result.actions.map((action) => (
                                <motion.li
                                    key={action.id}
                                    id={`action-${action.id}`}
                                    className={`px-3 py-2 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-zinc-900 cursor-pointer rounded-md ${
                                        activeIndex ===
                                        result.actions.indexOf(action)
                                            ? "bg-gray-100 dark:bg-zinc-800"
                                            : ""
                                    }`}
                                    variants={ANIMATION_VARIANTS.item}
                                    layout
                                    onClick={() =>
                                        handleActionClick(action)
                                    }
                                    role="option"
                                    aria-selected={
                                        activeIndex ===
                                        result.actions.indexOf(action)
                                    }
                                >
                                    <div className="flex items-center gap-2 justify-between">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-gray-500"
                                                aria-hidden="true"
                                            >
                                                {action.icon}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {action.label}
                                            </span>
                                            {action.description && (
                                                <span className="text-xs text-gray-400">
                                                    {action.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {action.short && (
                                            <span
                                                className="text-xs text-gray-400"
                                                aria-label={`Keyboard shortcut: ${action.short}`}
                                            >
                                                {action.short}
                                            </span>
                                        )}
                                        {action.end && (
                                            <span className="text-xs text-gray-400 text-right">
                                                {action.end}
                                            </span>
                                        )}
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                        <div className="mt-2 px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Press ⌘K to open commands</span>
                                <span>ESC to cancel</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
);
}

export default ActionSearchBarAirport;
