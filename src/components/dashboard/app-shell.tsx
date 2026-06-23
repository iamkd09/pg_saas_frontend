"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareWarning,
  Settings,
  Shield,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useDashboard } from "@/contexts/dashboard-context";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

function NavLinks({
  links,
  onNavigate,
}: {
  links: NavLink[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const active =
          link.href === "/dashboard" || link.href === "/dashboard/admin"
            ? pathname === link.href
            : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4.5" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { homepage, loading, isTenant, isSuperAdmin, isOwner } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = useMemo(() => {
    if (isSuperAdmin) {
      return [
        { href: "/dashboard/admin", label: "Platform", icon: Shield },
        { href: "/dashboard/admin/organizations", label: "Organizations", icon: Building2 },
        { href: "/dashboard/admin/users", label: "Users", icon: Users },
        { href: "/dashboard", label: "Homepage", icon: LayoutDashboard },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
      ] satisfies NavLink[];
    }

    if (isTenant) {
      return [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/dashboard/profile", label: "My Profile", icon: UserCircle },
        { href: "/dashboard/my-rents", label: "My Rents", icon: CreditCard },
        { href: "/dashboard/my-complaints", label: "Complaints", icon: MessageSquareWarning },
        { href: "/dashboard/notices", label: "Notices", icon: Megaphone },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
      ] satisfies NavLink[];
    }

    const managerLinks: NavLink[] = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/properties", label: "Properties", icon: Building2 },
      { href: "/dashboard/tenants", label: "Tenants", icon: Users },
      { href: "/dashboard/rents", label: "Rents", icon: CreditCard },
      { href: "/dashboard/complaints", label: "Complaints", icon: MessageSquareWarning },
      { href: "/dashboard/notices", label: "Notices", icon: Megaphone },
      { href: "/dashboard/team", label: "Team", icon: Users },
    ];

    if (isOwner) {
      managerLinks.push({
        href: "/dashboard/organization",
        label: "Organization",
        icon: Building2,
      });
    }

    managerLinks.push({
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    });

    return managerLinks;
  }, [isSuperAdmin, isTenant, isOwner]);

  const displayName = homepage
    ? [homepage.user.first_name, homepage.user.last_name].filter(Boolean).join(" ") ||
      homepage.user.username
    : "PG Manager";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08),_transparent_50%)]">
      <div className="mx-auto flex min-h-svh max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r bg-background/80 p-5 backdrop-blur-xl lg:block">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <p className="font-semibold tracking-tight">PG Manager</p>
              <p className="text-xs text-muted-foreground">
                {isSuperAdmin ? "Platform admin" : "Property operations"}
              </p>
            </div>
          </div>
          <div className="mt-8">
            <NavLinks links={links} />
          </div>
          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4.5" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </button>
                <div>
                  <p className="text-sm text-muted-foreground">Welcome back</p>
                  <p className="font-medium">{loading ? "..." : displayName}</p>
                </div>
              </div>
              {homepage ? (
                <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
                  {homepage.user.role.replace("_", " ")}
                </span>
              ) : null}
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r bg-background p-5 shadow-2xl lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="font-semibold">Menu</p>
                <button
                  type="button"
                  className="rounded-lg p-2 hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="size-5" />
                </button>
              </div>
              <NavLinks links={links} onNavigate={() => setMobileOpen(false)} />
              <button
                type="button"
                onClick={handleLogout}
                className="mt-8 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <LogOut className="size-4.5" />
                Sign out
              </button>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
