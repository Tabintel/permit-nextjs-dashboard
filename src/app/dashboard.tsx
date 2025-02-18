"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Settings, Users, FileText } from "lucide-react"

export default function Dashboard() {
  const [role, setRole] = useState("viewer")

  const checkPermission = async (action: string, resource: string) => {
    // Simulating permission check based on role
    if (role === "admin") return true
    if (role === "editor" && (action === "edit" || action === "view")) return true
    if (role === "viewer" && action === "view") return true
    return false
  }

  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canEditContent: false,
    canViewReports: false,
  })

  useEffect(() => {
    const fetchPermissions = async () => {
      const canManageUsers = await checkPermission("manage", "users")
      const canEditContent = await checkPermission("edit", "content")
      const canViewReports = await checkPermission("view", "reports")
      setPermissions({ canManageUsers, canEditContent, canViewReports })
    }
    fetchPermissions()
  }, [role]) //Fixed dependency

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="mb-4">
          <label htmlFor="role-select" className="mr-2">
            Select Role:
          </label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded p-1"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard
            title="Manage Users"
            icon={<Users className="w-6 h-6" />}
            allowed={permissions.canManageUsers}
          />
          <DashboardCard
            title="Edit Content"
            icon={<FileText className="w-6 h-6" />}
            allowed={permissions.canEditContent}
          />
          <DashboardCard
            title="View Reports"
            icon={<Settings className="w-6 h-6" />}
            allowed={permissions.canViewReports}
          />
        </div>
      </div>
    </div>
  )
}

function DashboardCard({ title, icon, allowed }: { title: string; icon: React.ReactNode; allowed: boolean }) {
  return (
    <div className={`p-4 border rounded-lg ${allowed ? "bg-green-100" : "bg-red-100"}`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {icon}
      </div>
      <div className="flex items-center">
        {allowed ? (
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
        )}
        <span>{allowed ? "Allowed" : "Not Allowed"}</span>
      </div>
    </div>
  )
}

