"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/";
  };

  const menuItems = [
    {
      title: "MENU",
      items: [
        { icon: "/images/home.png", label: "Home", href: "/admin" },
        { icon: "/images/product.png", label: "Tags", href: "/list/tags" },
        { icon: "/images/student.png", label: "Users", href: "/list/users" },
        { icon: "/images/student.png", label: "Report", href: "/list/report" },
        { icon: "/images/logout.png", label: "Logout", onClick: handleLogout },
      ],
    },
  ];

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-semibold my-4 px-4 uppercase tracking-wide text-xs">
            {section.title}
          </span>

          {section.items.map((item) => {
            const isActive = pathname === item.href;

            const commonClasses =
              "flex items-center justify-center lg:justify-start gap-4 py-2 px-4 rounded-xl transition-colors";

            const activeClasses =
              "bg-blue-100 text-blue-600 font-semibold shadow-sm";
            const inactiveClasses =
              "text-gray-500 hover:bg-gray-100 hover:text-blue-500";

            return item.onClick ? (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`${commonClasses} ${inactiveClasses}`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="opacity-70"
                />
                <span className="hidden lg:block">{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses
                  }`}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={`${isActive ? "opacity-100" : "opacity-70"}`}
                />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}