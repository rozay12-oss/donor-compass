import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { BloodInventoryTable } from "@/components/BloodInventoryTable";
import { ArrowLeft, Search, Building2, Clock, CheckCircle, XCircle, AlertTriangle, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const HospitalPortal = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const hospitalRequests = [
    {
      id: "HR-001",
      requestDate: "2024-01-15",
      bloodType: "O+",
      units: 5,
      status: "pending",
      patientName: "John Smith",
      urgency: "high",
      department: "Emergency",
    },
    {
      id: "HR-002", 
      requestDate: "2024-01-14",
      bloodType: "A+",
      units: 2,
      status: "fulfilled",
      patientName: "Jane Doe",
      urgency: "medium",
      department: "Surgery",
    },
    {
      id: "HR-003",
      requestDate: "2024-01-13",
      bloodType: "B-",
      units: 3,
      status: "cancelled",
      patientName: "Bob Johnson",
      urgency: "low",
      department: "Oncology",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "fulfilled":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "fulfilled":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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
        userRole="hospital" 
        userName="City General Hospital" 
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
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Hospital Portal
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage blood requests and track inventory for your hospital
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  New Request
                </h3>
                <p className="text-muted-foreground mb-4">
                  Submit a new blood request for your patients
                </p>
                <Link to="/blood-request">
                  <Button className="w-full bg-gradient-primary text-white">
                    Create Request
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency
                </h3>
                <p className="text-muted-foreground mb-4">
                  Submit urgent blood requests with high priority
                </p>
                <Link to="/emergency-requests">
                  <Button variant="destructive" className="w-full">
                    Emergency Request
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Check Inventory
                </h3>
                <p className="text-muted-foreground mb-4">
                  View real-time blood availability across all types
                </p>
                <Button variant="outline" className="w-full">
                  View Inventory
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search by request ID, patient name, or blood type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background/50"
                />
                <Button className="bg-gradient-primary text-white">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blood Inventory */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Current Blood Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <BloodInventoryTable />
            </CardContent>
          </Card>

          {/* Hospital Requests */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Hospital Blood Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hospitalRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 bg-background/50 hover:bg-background/70 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{request.id}</span>
                        <Badge 
                          variant="outline" 
                          className={`flex items-center gap-1 ${getStatusColor(request.status)}`}
                        >
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`${getUrgencyColor(request.urgency)}`}
                        >
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Patient:</span> {request.patientName}
                      </div>
                      <div>
                        <span className="font-medium">Blood Type:</span> {request.bloodType}
                      </div>
                      <div>
                        <span className="font-medium">Units:</span> {request.units}
                      </div>
                      <div>
                        <span className="font-medium">Department:</span> {request.department}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HospitalPortal;