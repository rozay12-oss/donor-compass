import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { ArrowLeft, BarChart3, Download, TrendingUp, Users, Droplets, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const reportData = {
    overview: {
      totalDonations: 1250,
      activeDonors: 890,
      bloodUnitsCollected: 2100,
      emergencyRequests: 45,
      trends: {
        donations: "+12%",
        donors: "+8%",
        collections: "+15%",
        emergencies: "-5%"
      }
    },
    inventory: {
      "A+": { available: 145, critical: false },
      "A-": { available: 23, critical: true },
      "B+": { available: 89, critical: false },
      "B-": { available: 12, critical: true },
      "AB+": { available: 34, critical: false },
      "AB-": { available: 8, critical: true },
      "O+": { available: 203, critical: false },
      "O-": { available: 15, critical: true },
    },
    donations: [
      { month: "Jan", donations: 120, units: 180 },
      { month: "Feb", donations: 135, units: 202 },
      { month: "Mar", donations: 128, units: 195 },
      { month: "Apr", donations: 142, units: 215 },
      { month: "May", donations: 156, units: 234 },
      { month: "Jun", donations: 149, units: 223 },
    ]
  };

  const downloadReport = (format: string) => {
    // In a real app, this would generate and download the report
    console.log(`Downloading ${selectedReport} report in ${format} format`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Header 
        userRole="admin" 
        userName="Administrator" 
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
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive insights into blood bank operations and performance
            </p>
          </div>

          {/* Report Controls */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">Report Type</label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview Summary</SelectItem>
                      <SelectItem value="donations">Donation Statistics</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="donors">Donor Analytics</SelectItem>
                      <SelectItem value="hospitals">Hospital Usage</SelectItem>
                      <SelectItem value="emergency">Emergency Requests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">Time Period</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Last 7 Days</SelectItem>
                      <SelectItem value="monthly">Last 30 Days</SelectItem>
                      <SelectItem value="quarterly">Last 3 Months</SelectItem>
                      <SelectItem value="yearly">Last 12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 items-end">
                  <Button 
                    onClick={() => downloadReport('pdf')}
                    className="bg-gradient-primary text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => downloadReport('excel')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Donations</p>
                    <p className="text-2xl font-bold">{reportData.overview.totalDonations.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {reportData.overview.trends.donations}
                    </p>
                  </div>
                  <Droplets className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Donors</p>
                    <p className="text-2xl font-bold">{reportData.overview.activeDonors.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {reportData.overview.trends.donors}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Units</p>
                    <p className="text-2xl font-bold">{reportData.overview.bloodUnitsCollected.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {reportData.overview.trends.collections}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Emergency Requests</p>
                    <p className="text-2xl font-bold">{reportData.overview.emergencyRequests}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {reportData.overview.trends.emergencies}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blood Inventory Status */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Current Blood Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {Object.entries(reportData.inventory).map(([bloodType, data]) => (
                  <div
                    key={bloodType}
                    className={`border rounded-lg p-4 text-center ${
                      data.critical 
                        ? 'border-red-200 bg-red-50/50' 
                        : 'border-green-200 bg-green-50/50'
                    }`}
                  >
                    <div className="font-bold text-lg">{bloodType}</div>
                    <div className={`text-2xl font-bold ${
                      data.critical ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {data.available}
                    </div>
                    <div className="text-sm text-muted-foreground">units</div>
                    {data.critical && (
                      <div className="text-xs text-red-600 font-medium mt-1">
                        Critical Low
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation Trends */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Monthly Donation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.donations.map((month) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">{month.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <div className="text-sm text-muted-foreground">Donations</div>
                          <div className="font-semibold">{month.donations}</div>
                        </div>
                        <div className="w-32">
                          <div className="text-sm text-muted-foreground">Units</div>
                          <div className="font-semibold">{month.units}</div>
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full"
                            style={{ width: `${(month.donations / 200) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities Summary */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Activities Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-semibold">Successful Blood Drive</div>
                  <div className="text-sm text-muted-foreground">
                    Collected 45 units at Metro Medical Center - 2 hours ago
                  </div>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="font-semibold">Critical Inventory Alert</div>
                  <div className="text-sm text-muted-foreground">
                    A- blood type below minimum threshold - 4 hours ago
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-semibold">New Donor Registration</div>
                  <div className="text-sm text-muted-foreground">
                    15 new donors registered this week - 1 day ago
                  </div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-semibold">Emergency Request Fulfilled</div>
                  <div className="text-sm text-muted-foreground">
                    5 units of O- delivered to City General Hospital - 2 days ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;