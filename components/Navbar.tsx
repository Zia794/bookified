"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Library", href: "/" },
  { label: "Add New", href: "/books/new" },
  { label: "Pricing", href: "/subscriptions" },
];

const Navbar = () => {
  const pathName = usePathname();
  const { user } = useUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full fixed z-50 px-6 bg-[#f1f4e9]">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex gap-0.5 items-center">
          <Image src="/assets/logo.png" alt="Bookfied" width={42} height={26} />
          <span className="logo-text">Bookified</span>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:flex w-fit gap-7.5 items-center">
          {navItems.map(({ label, href }) => {
            const isActive =
              pathName === href || (href !== "/" && pathName.startsWith(href));

            return (
              <Link
                href={href}
                key={label}
                className={cn(
                  "nav-link-base",
                  isActive ? "nav-link-active" : "text-black hover:opacity-70",
                )}
              >
                {label}
              </Link>
            );
          })}

          <div>
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>

            <SignedIn>
              <div className="nav-user-link flex gap-1 items-center">
                <UserButton />
                {user?.firstName && (
                  <Link href="/subscriptions" className="nav-user-name">
                    {user.firstName}
                  </Link>
                )}
              </div>
            </SignedIn>
          </div>
        </nav>

        {/* ================= MOBILE NAV ================= */}
        <div className="flex md:hidden items-center gap-3">
          {/* Signed Out → show menu button */}
          <SignedOut>
            <button onClick={() => setMobileMenuOpen(true)}>
              <Menu size={26} />
            </button>
          </SignedOut>

          {/* Signed In → avatar opens menu */}
          <SignedIn>
            <button onClick={() => setMobileMenuOpen(true)}>
              <UserButton afterSignOutUrl="/" />
            </button>
          </SignedIn>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <span className="font-semibold text-lg">Menu</span>

          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col gap-6 p-6">
          {navItems.map(({ label, href }) => {
            const isActive =
              pathName === href || (href !== "/" && pathName.startsWith(href));

            return (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-lg",
                  isActive ? "font-semibold text-black" : "text-gray-600",
                )}
              >
                {label}
              </Link>
            );
          })}

          {/* Signed Out */}
          <SignedOut>
            <div className="pt-4 border-t">
              <SignInButton mode="modal" />
            </div>
          </SignedOut>

          {/* Signed In */}
          <SignedIn>
            <div className="flex flex-col gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />

                {user?.firstName && (
                  <span className="font-medium">{user.firstName}</span>
                )}
              </div>

              <SignOutButton redirectUrl="/">
                <button className="text-left text-red-500 font-medium hover:opacity-70">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Background overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
        />
      )}
    </header>
  );
};

export default Navbar;
