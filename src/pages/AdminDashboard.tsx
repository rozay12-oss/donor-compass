import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { BloodInventoryTable } from "@/components/BloodInventoryTable";
import { ArrowLeft, Users, Settings, TrendingUp, AlertCircle, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const systemStats = [
    { title: "Total Users", value: "2,847", change: "+12.5%", icon: Users },
    { title: "Active Donors", value: "1,234", change: "+8.2%", icon: Users },
    { title: "Blood Requests", value: "89", change: "+15.3%", icon: TrendingUp },
    { title: "System Alerts", value: "3", change: "-2", icon: AlertCircle },
  ];

  const recentUsers = [
    { id: "U001", name: "Dr. Sarah Johnson", email: "sarah.j@hospital.com", role: "Hospital", status: "active", joinDate: "2024-01-15" },
    { id: "U002", name: "Mike Chen", email: "mike.chen@email.com", role: "Donor", status: "active", joinDate: "2024-01-14" },
    { id: "U003", name: "Lisa Rodriguez", email: "lisa.r@email.com", role: "Patient", status: "pending", joinDate: "2024-01-13" },
    { id: "U004", name: "Dr. James Wilson", email: "j.wilson@clinic.com", role: "Hospital", status: "active", joinDate: "2024-01-12" },
  ];

  const systemAlerts = [
    { id: "A001", type: "warning", message: "Low inventory for O- blood type", timestamp: "2024-01-15 10:30 AM", severity: "high" },
    { id: "A002", type: "info", message: "New hospital registration pending approval", timestamp: "2024-01-15 09:15 AM", severity: "medium" },
    { id: "A003", type: "error", message: "System backup failed", timestamp: "2024-01-15 08:00 AM", severity: "high" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "inactive":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-500/10 text-green-700 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Header 
        userRole="admin" 
        userName="Admin User" 
        onRoleChange={() => {}} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid gap-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage system users, inventory, and monitor system health
            </p>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={{
                  value: parseFloat(stat.change.replace(/[+%-]/g, '')),
                  isPositive: stat.change.startsWith('+')
                }}
              />
            ))}
          </div>

          {/* Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="alerts">System Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentUsers.slice(0, 3).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Critical Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemAlerts.filter(alert => alert.severity === "high").map((alert) => (
                        <div key={alert.id} className="p-3 bg-background/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                          </div>
                          <p className="text-sm">{alert.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <Button className="bg-gradient-primary text-white">
                      Add New User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <Input placeholder="Search users..." className="flex-1 bg-background/50" />
                    <Select>
                      <SelectTrigger className="w-48 bg-background/50">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hospital">Hospital</SelectItem>
                        <SelectItem value="donor">Donor</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Blood Inventory Management</CardTitle>
                    <Button className="bg-gradient-primary text-white">
                      Update Inventory
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <BloodInventoryTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>System Alerts & Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="border rounded-lg p-4 bg-background/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity} priority
                            </Badge>
                            <span className="text-sm font-medium">{alert.id}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                        </div>
                        <p className="text-sm mb-3">{alert.message}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Mark as Read
                          </Button>
                          <Button variant="outline" size="sm">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;