'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Package,
  Users,
  Tag,
  BarChart3,
  Globe,
  Store,
  Crown,
  Wallet,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const baseLinkStyles =
  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150'

type MenuKey = 'orders' | 'catalog' | 'promotions' | 'onlineStore'

const collapsibleMenus: {
  key: MenuKey
  label: string
  icon: React.ComponentType<{ className?: string }>
  links: { label: string; href: string }[]
}[] = [
  {
    key: 'orders',
    label: 'Orders',
    icon: ShoppingBag,
    links: [
      { label: 'Online', href: '/orders' },
      { label: 'Purchase', href: '/purchases' },
      { label: 'Estimate', href: '/estimates' },
      { label: 'Abandoned Carts', href: '/abandoned-carts' },
    ],
  },
  {
    key: 'catalog',
    label: 'Catalog',
    icon: Package,
    links: [
      { label: 'Products', href: '/products' },
      { label: 'Categories', href: '/categories' },
      { label: 'Collections', href: '/collections' },
    ],
  },
  {
    key: 'promotions',
    label: 'Promotions',
    icon: Tag,
    links: [
      { label: 'Coupons', href: '/coupons' },
      { label: 'Banners', href: '/banners' },
      { label: 'Refer & Earn', href: '/refer-earn' },
    ],
  },
  {
    key: 'onlineStore',
    label: 'Online Store',
    icon: Globe,
    links: [
      { label: 'Store Settings', href: '/store-settings' },
      { label: 'Display Settings', href: '/display-settings' },
      { label: 'Themes', href: '/themes' },
      { label: 'Users And Roles', href: '/users-roles' },
      { label: 'Store Blog', href: '/store-blog' },
      { label: 'Store Pages', href: '/store-pages' },
    ],
  },
]

const primaryLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Invoices', href: '/invoices', icon: FileText },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'App Store', href: '/app-store', icon: Store },
  { label: 'Billing Plans', href: '/billing-plans', icon: Crown },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<Record<MenuKey, boolean>>({
    orders: pathname?.startsWith('/orders') || pathname?.startsWith('/purchases') || pathname?.startsWith('/estimates'),
    catalog: pathname?.startsWith('/products') || pathname?.startsWith('/categories') || pathname?.startsWith('/collections'),
    promotions: pathname?.startsWith('/coupons') || pathname?.startsWith('/banners') || pathname?.startsWith('/refer-earn'),
    onlineStore:
      pathname?.startsWith('/store-settings') ||
      pathname?.startsWith('/display-settings') ||
      pathname?.startsWith('/themes') ||
      pathname?.startsWith('/users-roles') ||
      pathname?.startsWith('/store-blog') ||
      pathname?.startsWith('/store-pages'),
  })

  const toggleMenu = (key: MenuKey) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const isActive = (href: string) => pathname === href

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-100 flex flex-col h-screen shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-lg font-semibold">
            S
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Control</p>
            <p className="text-xl font-semibold text-white">Shoopy</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-3">
        {primaryLinks.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`${baseLinkStyles} ${
              isActive(href) ? 'bg-white text-[#0f172a]' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}

        {collapsibleMenus.map(({ key, label, icon: Icon, links }) => {
          const active = links.some((link) => pathname?.startsWith(link.href))
          const isExpanded = expandedMenus[key]
          return (
            <div key={key} className="space-y-2">
              <button
                onClick={() => toggleMenu(key)}
                className={`${baseLinkStyles} w-full justify-between ${
                  active ? 'bg-white text-[#0f172a]' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {links.map(({ label: subLabel, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm ${
                        isActive(href) ? 'bg-white/15 text-white border-l-4 border-white' : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <span>{subLabel}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/wallet"
          className="flex items-center justify-between rounded-3xl bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <Wallet className="h-6 w-6 text-emerald-300" />
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-200/70">Wallet</p>
              <p className="text-lg font-semibold">9,685 credits</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-white/60" />
        </Link>
      </div>
    </aside>
  )
}

