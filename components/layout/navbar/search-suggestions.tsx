"use client";

import { ClockIcon, FireIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { POPULAR_SEARCHES } from "lib/constants";
import {
  addSearchHistory,
  clearSearchHistory,
  getSearchHistory,
} from "lib/search-history";

type SuggestionProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string;
    width: number;
    height: number;
  };
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
};

export default function SearchSuggestions({
  query,
  isOpen,
  onClose,
  onSearch,
  inputRef,
}: {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSearch: (term: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<SuggestionProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const panelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    setActiveIndex(-1);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search-suggestions?q=${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        setSuggestions(data.products || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Keyboard navigation
  const getTotalItems = useCallback(() => {
    if (query.trim()) {
      return suggestions.length;
    }
    return POPULAR_SEARCHES.length + searchHistory.length;
  }, [query, suggestions, searchHistory]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const total = getTotalItems();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % total);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev <= 0 ? total - 1 : prev - 1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleItemSelect(activeIndex);
      } else if (e.key === "Escape") {
        onClose();
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, getTotalItems, onClose, inputRef]);

  const handleItemSelect = (index: number) => {
    if (query.trim()) {
      // Product suggestion selected
      if (index < suggestions.length) {
        const product = suggestions[index]!;
        addSearchHistory(product.title);
        router.push(`/product/${product.handle}`);
        onClose();
      }
    } else {
      // No query - popular searches or history
      const historyCount = searchHistory.length;
      if (index < historyCount) {
        const term = searchHistory[index]!;
        onSearch(term);
      } else {
        const term = POPULAR_SEARCHES[index - historyCount]!;
        onSearch(term);
      }
    }
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  const handleHistoryItemClick = (term: string) => {
    onSearch(term);
  };

  const handlePopularClick = (term: string) => {
    onSearch(term);
  };

  const handleProductClick = (product: SuggestionProduct) => {
    addSearchHistory(product.title);
    router.push(`/product/${product.handle}`);
    onClose();
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(amount));
  };

  if (!isOpen) return null;

  // Build a flat list of items for active index tracking
  let globalIndex = 0;

  return (
    <div
      ref={panelRef}
      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[80vh] overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      {query.trim() ? (
        // Show product suggestions when there's a query
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-neutral-500">
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              搜索中...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((product) => {
                const itemIndex = globalIndex++;
                return (
                  <li key={product.id}>
                    <button
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                        activeIndex === itemIndex
                          ? "bg-neutral-100 dark:bg-neutral-800"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                      onClick={() => handleProductClick(product)}
                      onMouseEnter={() => setActiveIndex(itemIndex)}
                    >
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
                        {product.featuredImage && (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            fill
                            sizes="40px"
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-black dark:text-white">
                          {product.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatPrice(
                            product.priceRange.minVariantPrice.amount,
                            product.priceRange.minVariantPrice.currencyCode
                          )}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-6 text-center text-sm text-neutral-500">
              未找到相关商品
            </div>
          )}
        </div>
      ) : (
        // Show history and popular searches when no query
        <div className="p-3">
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-3">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                  <ClockIcon className="h-3.5 w-3.5" />
                  搜索历史
                </h3>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <XMarkIcon className="h-3 w-3" />
                  清除历史
                </button>
              </div>
              <ul>
                {searchHistory.map((term) => {
                  const itemIndex = globalIndex++;
                  return (
                    <li key={`history-${term}`}>
                      <button
                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                          activeIndex === itemIndex
                            ? "bg-neutral-100 dark:bg-neutral-800"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                        onClick={() => handleHistoryItemClick(term)}
                        onMouseEnter={() => setActiveIndex(itemIndex)}
                      >
                        <ClockIcon className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
                        <span className="truncate text-black dark:text-white">
                          {term}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              <FireIcon className="h-3.5 w-3.5" />
              热门搜索
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => {
                const itemIndex = globalIndex++;
                return (
                  <button
                    key={`popular-${term}`}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      activeIndex === itemIndex
                        ? "border-blue-600 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-400"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-300"
                    }`}
                    onClick={() => handlePopularClick(term)}
                    onMouseEnter={() => setActiveIndex(itemIndex)}
                  >
                    {term}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
