'use client';

import { useVendorListings, useTradeLog, usePriceHistory } from '@/hooks/use-trade';
import { VendorKiosk } from '@/components/trade/vendor-kiosk';
import { TradeLogger } from '@/components/trade/trade-logger';
import { PriceTracker } from '@/components/trade/price-tracker';

/**
 * TradePanel
 * Client component orchestrating the Trade System widgets.
 */
export default function TradePanel() {
  const { 
    listings, hydrated: kioskHydrated, addListing, markSold, withdrawListing, deleteListing,
    activeCount, slotsRemaining, totalListingFees
  } = useVendorListings();

  const { 
    trades, hydrated: tradesHydrated, addTrade, deleteTrade,
    netProfit, totalPurchases, totalSales
  } = useTradeLog();

  const {
    prices, hydrated: pricesHydrated, addPrice, deletePrice
  } = usePriceHistory();

  const isHydrated = kioskHydrated && tradesHydrated && pricesHydrated;

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Direct Profit P/L</p>
          <p className={`text-lg font-bold font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-600">net Klaatu</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Direct Volume</p>
          <p className="text-sm font-bold font-mono text-slate-200">
            <span className="text-emerald-400/80">S: {totalSales.toLocaleString()}</span> <br/>
            <span className="text-red-400/80">P: {totalPurchases.toLocaleString()}</span>
          </p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Active Kiosk Listings</p>
          <p className={`text-lg font-bold font-mono ${activeCount >= 90 ? 'text-amber-400' : 'text-slate-200'}`}>
            {activeCount} / 100
          </p>
          <p className="text-[10px] text-slate-600">slots used</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Total Kiosk Fees</p>
          <p className="text-lg font-bold font-mono text-amber-500/80">{totalListingFees.toLocaleString()}</p>
          <p className="text-[10px] text-slate-600">Klaatu sunk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Vendor Kiosk */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm min-h-[500px]">
            <VendorKiosk 
              listings={listings}
              slotsRemaining={slotsRemaining}
              onAdd={addListing}
              onMarkSold={markSold}
              onWithdraw={withdrawListing}
              onDelete={deleteListing}
            />
          </div>
        </div>

        {/* Right Column: Direct Trades & Prices */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <TradeLogger 
              trades={trades}
              onAddTrade={addTrade}
              onDeleteTrade={deleteTrade}
            />
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <PriceTracker 
              prices={prices}
              onAddPrice={addPrice}
              onDeletePrice={deletePrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
