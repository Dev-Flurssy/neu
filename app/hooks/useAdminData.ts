"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Stats {
  totalUsers: number;
  totalNotes: number;
  totalApiCalls: number;
  successfulCalls: number;
  failedCalls: number;
  successRate: string;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  emailVerified: Date | null;
  _count: {
    notes: number;
    apiUsage: number;
  };
}

interface RecentUsage {
  id: string;
  endpoint: string;
  status: string;
  createdAt: Date;
  user: {
    email: string | null;
    name: string | null;
  };
}

export function useAdminData() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recentUsage, setRecentUsage] = useState<RecentUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);

      if (statsRes.status === 403 || usersRes.status === 403) {
        router.push("/dashboard");
        return;
      }

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();

      setStats(statsData.stats);
      setRecentUsage(statsData.recentUsage);
      setUsers(usersData.users);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to update user role");
      }
    } catch (error) {
      alert("Failed to update user role");
    }
  };

  return {
    stats,
    users,
    recentUsage,
    loading,
    deleteUser,
    toggleUserRole,
  };
}
