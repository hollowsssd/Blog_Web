"use client";
// import axios from "axios";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import Cookies from "universal-cookie";

export default function Menu() {
  // const router = useRouter();
  // const cookies = new Cookies();

  // const Logout = async () => {
  //   const token = cookies.get("token");
  //   if (!token) {
  //     router.push("/");
  //     return;
  //   }
  //   try {
  //     await axios.post(
  //       "http://127.0.0.1:8000/api/auth/logout",
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     cookies.remove("token");
  //     localStorage.removeItem("email");
  //     localStorage.removeItem("name");
  //     localStorage.removeItem("role");

  //     router.push("/");
  //   } catch (err) {
  //     console.error("Logout failed:", err);
  //     router.push("/admin");
  //   }
  // };

  const menuItems = [
    {
      title: "MENU",
      items: [
        { icon: "/images/home.png", label: "Home", href: "/admin" },
        {
          icon: "/images/product.png",
          label: "Tags",
          href: "/list/tags",
        },
        { icon: "/images/student.png", label: "Users", href: "/list/users" },
          { icon: "/images/student.png", label: "Report", href: "/list/report" },
        { icon: "/images/logout.png", label: "Logout", href:"/"},
      ],
    },
  ];

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
            >
              <Image src={item.icon} alt={item.label} width={20} height={20} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
