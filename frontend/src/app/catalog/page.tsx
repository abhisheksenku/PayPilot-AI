'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LaptopVisual, LaptopModelType } from '@/components/catalog/LaptopVisual';
import {
  ShoppingBag,
  FileText,
  Star,
  CheckCircle2,
  Heart,
  Cpu,
  Zap,
  Monitor,
  Tag,
  ChevronDown,
  X,
  Filter,
  Search,
} from 'lucide-react';

interface CatalogItem {
  id: string;
  visualModel: LaptopModelType;
  name: string;
  subtitle: string;
  score: string;
  isTopPick?: boolean;
  price: number;
  specs: [string, string, string];
  category: 'all' | 'ml-laptops' | 'macbooks' | 'workstations';
  brand: 'Lenovo' | 'Apple' | 'HP' | 'ASUS' | 'Dell';
}

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'prod-lenovo-loq',
    visualModel: 'lenovo-loq',
    name: 'Lenovo LOQ 15',
    subtitle: 'Gaming & ML Laptop',
    score: '98/100 AI Score',
    isTopPick: true,
    price: 749.0,
    specs: ['115W TGP RTX 4060', '16GB DDR5 5200MHz', '100% sRGB Display'],
    category: 'ml-laptops',
    brand: 'Lenovo',
  },
  {
    id: 'prod-macbook-pro',
    visualModel: 'macbook-pro',
    name: 'Apple MacBook Pro 14 M3 Pro',
    subtitle: 'Developer & AI Workflows',
    score: '94/100 Score',
    isTopPick: false,
    price: 1849.0,
    specs: ['M3 Pro (12-core)', '36GB Unified RAM', '14.2" Liquid Retina XDR'],
    category: 'macbooks',
    brand: 'Apple',
  },
  {
    id: 'prod-hp-victus',
    visualModel: 'hp-victus',
    name: 'HP Victus 15',
    subtitle: 'Gaming & AI Development',
    score: '87/100 Score',
    isTopPick: false,
    price: 699.0,
    specs: ['95W TGP RTX 3050', '16GB DDR5 4800MHz', '144Hz FHD (15.6")'],
    category: 'ml-laptops',
    brand: 'HP',
  },
  {
    id: 'prod-asus-rog',
    visualModel: 'asus-rog',
    name: 'ASUS ROG Zephyrus G16',
    subtitle: 'Creator & ML Workstation',
    score: '95/100 Score',
    isTopPick: false,
    price: 1499.0,
    specs: ['115W TGP RTX 4070', '32GB DDR5 5600MHz', '16" 240Hz 2.5K (100% DCI-P3)'],
    category: 'workstations',
    brand: 'ASUS',
  },
  {
    id: 'prod-dell-g15',
    visualModel: 'dell-g15',
    name: 'Dell G15 Gaming',
    subtitle: 'ML Training & Gaming',
    score: '89/100 Score',
    isTopPick: false,
    price: 779.0,
    specs: ['140W TGP RTX 4050', '16GB DDR5 4800MHz', '15.6" FHD 165Hz'],
    category: 'ml-laptops',
    brand: 'Dell',
  },
  {
    id: 'prod-lenovo-legion',
    visualModel: 'lenovo-legion',
    name: 'Lenovo Legion Pro 5',
    subtitle: 'High-Performance Dev Laptop',
    score: '97/100 Score',
    isTopPick: false,
    price: 1299.0,
    specs: ['140W TGP RTX 4060', '32GB DDR5 5600MHz', '16" WQXGA 240Hz (100% sRGB)'],
    category: 'ml-laptops',
    brand: 'Lenovo',
  },
];

export default function CatalogPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [isBudgetFilterActive, setIsBudgetFilterActive] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showBrandDropdown, setShowBrandDropdown] = useState<boolean>(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter items based on active filters
  const filteredItems = CATALOG_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (selectedBrand !== 'all' && item.brand !== selectedBrand) {
      return false;
    }
    if (isBudgetFilterActive && item.price > 824.0) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 pt-3 pb-6 max-w-[1600px] mx-auto space-y-4 select-none">
        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              Apps & Product Catalog
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 -mt-0.5">
              Channel3 Verified Developer Hardware Index & AI Benchmarks
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs self-start sm:self-auto">
            <Link
              href="/studio"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EBF5FF] text-[#0070BA] shadow-2xs border border-[#D0E5FF]/60 hover:bg-[#D9EDFF] transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shopping Studio</span>
            </Link>

            <Link
              href="/orders"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Orders</span>
            </Link>
          </div>
        </div>

        {/* Horizontal Filter Bar (Exact Match to Blueprint) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#0070BA] text-white shadow-2xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              All
            </button>

            <button
              onClick={() => setSelectedCategory('ml-laptops')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'ml-laptops'
                  ? 'bg-[#0070BA] text-white shadow-2xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span>💻</span>
              <span>ML Laptops</span>
            </button>

            <button
              onClick={() => setSelectedCategory('macbooks')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'macbooks'
                  ? 'bg-[#0070BA] text-white shadow-2xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🍎</span>
              <span>MacBooks</span>
            </button>

            <button
              onClick={() => setSelectedCategory('workstations')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'workstations'
                  ? 'bg-[#0070BA] text-white shadow-2xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🖥️</span>
              <span>Workstations</span>
            </button>
          </div>

          {/* Brand Dropdown Filter */}
          <div className="relative">
            <button
              onClick={() => setShowBrandDropdown(!showBrandDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              <span>
                Brand: {selectedBrand === 'all' ? 'All Brands' : selectedBrand}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
            </button>

            {showBrandDropdown && (
              <div className="absolute left-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-30 text-xs animate-fade-in">
                {['all', 'Lenovo', 'Apple', 'HP', 'ASUS', 'Dell'].map((brand) => (
                  <button
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setShowBrandDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-gray-50 transition-colors ${
                      selectedBrand === brand
                        ? 'font-bold text-[#0070BA] bg-[#EBF5FF]/50'
                        : 'text-gray-700'
                    }`}
                  >
                    {brand === 'all' ? 'All Brands' : brand}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Budget Constraint Pill */}
          <button
            onClick={() => setIsBudgetFilterActive(!isBudgetFilterActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              isBudgetFilterActive
                ? 'bg-[#EBF5FF] text-[#0070BA] border border-[#D0E5FF] hover:bg-[#D9EDFF]'
                : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
            }`}
          >
            <Filter className="w-3 h-3 text-[#0070BA]" />
            <span>Budget: Under ₹70,000 ($824 USD)</span>
            <span
              className={`p-0.5 rounded-full ${
                isBudgetFilterActive
                  ? 'hover:bg-blue-200 text-[#0070BA]'
                  : 'text-gray-400'
              }`}
            >
              <X className="w-3 h-3" />
            </span>
          </button>
        </div>

        {/* 3x2 Responsive Product Grid (Exact Match to Blueprint) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 relative group"
            >
              {/* Card Header: Top Pick Badge & Channel3 Verified Pill */}
              <div className="flex items-center justify-between min-h-[22px]">
                {item.isTopPick ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] shadow-2xs">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                    Top Pick #1
                  </span>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Channel3 Verified
                  </span>

                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Add to wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        favorites[item.id] ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Side-by-Side Content: Laptop Visual on Left, Details on Right */}
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Left Column: Visual Hardware (~50% width) */}
                <div className="col-span-6 flex items-center justify-center p-1 bg-gradient-to-b from-gray-50/60 to-gray-100/30 rounded-xl border border-gray-100">
                  <LaptopVisual model={item.visualModel} />
                </div>

                {/* Right Column: Title, Subtitle, AI Score (~50% width) */}
                <div className="col-span-6 flex flex-col justify-center space-y-1.5 pl-1">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-base leading-tight tracking-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Gold AI Score Badge */}
                  <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl px-2.5 py-1 text-center shadow-2xs">
                    <div className="inline-flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold text-[#92400E]">
                      <span>🏆</span>
                      <span>{item.score}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Spec Chips Row */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-gray-100">
                <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200/70 text-center space-y-0.5">
                  <div className="w-4 h-4 rounded-md bg-blue-100 text-[#0070BA] flex items-center justify-center mx-auto">
                    <Cpu className="w-2.5 h-2.5" />
                  </div>
                  <div className="text-[9.5px] font-bold text-gray-800 leading-tight truncate">
                    {item.specs[0]}
                  </div>
                </div>

                <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200/70 text-center space-y-0.5">
                  <div className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Zap className="w-2.5 h-2.5" />
                  </div>
                  <div className="text-[9.5px] font-bold text-gray-800 leading-tight truncate">
                    {item.specs[1]}
                  </div>
                </div>

                <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-200/70 text-center space-y-0.5">
                  <div className="w-4 h-4 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                    <Monitor className="w-2.5 h-2.5" />
                  </div>
                  <div className="text-[9.5px] font-bold text-gray-800 leading-tight truncate">
                    {item.specs[2]}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Price & Inspect in Studio CTA */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <div>
                  <div className="text-lg sm:text-xl font-black text-gray-900 font-mono tracking-tight">
                    ${item.price.toFixed(2)}{' '}
                    <span className="text-[10px] font-bold text-gray-500">USD</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/studio')}
                  className="px-3.5 py-1.5 bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs font-bold rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>Inspect in Studio</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center bg-white rounded-2xl border border-gray-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0070BA] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">No hardware models match the selected filters</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try disabling the budget constraint pill or selecting &quot;All Brands&quot; to view all Channel3 verified models.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setIsBudgetFilterActive(false);
                }}
                className="px-4 py-1.5 bg-[#0070BA] hover:bg-[#005ea6] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
