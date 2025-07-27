import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { BloodInventoryTable } from "@/components/BloodInventoryTable";
import { ArrowLeft, Search, Heart, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PatientPortal = () => {
  const [searchBloodType, setSearchBloodType] = useState("");

  const patientRequests = [
    {
      id: "REQ-001",
      requestDate: "2024-01-15",
      bloodType: "O+",
      units: 2,
      status: "pending",
      hospital: "City General Hospital",
      urgency: "high",
    },
    {
      id: "REQ-002", 
      requestDate: "2024-01-10",
      bloodType: "A+",
      units: 1,
      status: "fulfilled",
      hospital: "Metro Medical Center",
      urgency: "medium",
    },
    {
      id: "REQ-003",
      requestDate: "2024-01-08",
      bloodType: "B-",
      units: 3,
      status: "cancelled",
      hospital: "Regional Hospital",
      urgency: "low",
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
        userRole="patient" 
        userName="John Doe" 
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
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Patient Portal
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your blood requests and check availability
            </p>
          </div>

          {/* Blood Availability Search */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Check Blood Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="bloodType">Search by Blood Type</Label>
                  <Input
                    id="bloodType"
                    placeholder="Enter blood type (e.g., A+, O-, AB+)"
                    value={searchBloodType}
                    onChange={(e) => setSearchBloodType(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <Button className="mt-6 bg-gradient-primary text-white">
                  Search
                </Button>
              </div>
              
              <BloodInventoryTable />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Need Blood?</h3>
                <p className="text-muted-foreground mb-4">
                  Submit a new blood request for yourself or a family member
                </p>
                <Link to="/blood-request">
                  <Button className="w-full bg-gradient-primary text-white">
                    Submit Blood Request
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Emergency Request</h3>
                <p className="text-muted-foreground mb-4">
                  Submit an urgent blood request that will be prioritized
                </p>
                <Link to="/blood-request">
                  <Button variant="destructive" className="w-full">
                    Emergency Request
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Request History */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Your Blood Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientRequests.map((request) => (
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Blood Type:</span> {request.bloodType}
                      </div>
                      <div>
                        <span className="font-medium">Units:</span> {request.units}
                      </div>
                      <div>
                        <span className="font-medium">Hospital:</span> {request.hospital}
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

export default PatientPortal;