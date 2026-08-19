import type { Expense } from "@/types";
export const expenses: Expense[] = [
  { id: "EXP-4829", title: "Monthly groceries", group: "Hostel Block A", category: "Food & dining", amount: 2480, date: "Today, 10:24 AM", paidBy: "You", splitWith: 5, status: "pending" },
  { id: "EXP-4828", title: "Hackathon supplies", group: "CodeFest '26", category: "Projects", amount: 1850, date: "Yesterday", paidBy: "Rohan Mehta", splitWith: 4, status: "you-owe" },
  { id: "EXP-4827", title: "Movie tickets", group: "Weekend Plans", category: "Entertainment", amount: 1200, date: "Apr 19", paidBy: "Priya Shah", splitWith: 6, status: "settled" },
  { id: "EXP-4826", title: "Uber to campus", group: "Hostel Block A", category: "Travel", amount: 380, date: "Apr 18", paidBy: "You", splitWith: 2, status: "settled" }
];
export const spendingData = [{ month: "Nov", amount: 4200 }, { month: "Dec", amount: 5400 }, { month: "Jan", amount: 3800 }, { month: "Feb", amount: 6100 }, { month: "Mar", amount: 5700 }, { month: "Apr", amount: 7600 }];
export const categoryData = [{ name: "Food", value: 42, color: "#2563eb" }, { name: "Travel", value: 24, color: "#10b981" }, { name: "Projects", value: 18, color: "#8b5cf6" }, { name: "Other", value: 16, color: "#f59e0b" }];
export const groups = [
  { name: "Hostel Block A", members: 12, balance: 1240, color: "from-blue-600 to-cyan-500", initials: "HA" },
  { name: "CodeFest '26", members: 8, balance: -465, color: "from-violet-600 to-fuchsia-500", initials: "CF" },
  { name: "Weekend Plans", members: 6, balance: 0, color: "from-emerald-600 to-teal-500", initials: "WP" }
];
