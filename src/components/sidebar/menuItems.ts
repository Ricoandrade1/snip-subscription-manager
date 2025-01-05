import { BarChart, Users, Rss, Image, CalendarDays } from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart,
    url: "/",
  },
  {
    title: "Membros",
    icon: Users,
    url: "/members",
    submenu: [
      { title: "Todos", url: "/members/all", count: 9 },
      { title: "Basic", url: "/members/basic", count: 3 },
      { title: "Classic", url: "/members/classic", count: 3 },
      { title: "Business", url: "/members/business", count: 3 },
    ],
  },
  {
    title: "Social",
    icon: Rss,
    url: "/social",
    submenu: [
      { title: "Story", url: "/story" },
      { title: "Feed", url: "/feed" },
    ],
  },
  {
    title: "Agenda",
    icon: CalendarDays,
    url: "/schedule",
  },
];