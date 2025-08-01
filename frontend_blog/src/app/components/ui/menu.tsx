"use client";
import Image from "next/image";
import Link from "next/link";

export default function Menu() {
  const handleLogout = () => {
    localStorage.removeItem("token");
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
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>

          {section.items.map((item) =>
            item.onClick ? (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex cursor-pointer items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt={item.label} width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href as string}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
              >
                <Image src={item.icon} alt={item.label} width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
          )}
        </div>
      ))}
    </div>
  );
}
