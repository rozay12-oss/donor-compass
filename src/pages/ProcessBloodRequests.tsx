import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter,
  Calendar,
  Droplets
} from "lucide-react";
import { Link } from "react-router-dom";

interface BloodRequest {
  id: number;
  blood_type: string;
  quantity: number;
  status: string;
  created_at: string;
  user_id: string;
  profile?: {
    full_name: string;
    phone: string;
    email: string;
  };
}

interface EmergencyRequest {
  id: string;
  name: string;
  blood_type: string;
  units: number;
  location: string;
  contact: string;
  urgency: string;
  notes: string;
  created_at: string;
}

const ProcessBloodRequests = () => {
  const { toast } = useToast();
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [processingNotes, setProcessingNotes] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch blood requests with user profiles
      const { data: bloodRequestsData, error: bloodError } = await supabase
        .from('blood_requests')
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (bloodError) throw bloodError;

      // Fetch emergency requests
      const { data: emergencyData, error: emergencyError } = await supabase
        .from('emergency_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (emergencyError) throw emergencyError;

      setBloodRequests(bloodRequestsData || []);
      setEmergencyRequests(emergencyData || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blood requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: number, status: string) => {
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Updated",
        description: `Request has been marked as ${status}`,
        variant: status === 'approved' ? 'default' : 'destructive',
      });

      fetchRequests();
      setSelectedRequest(null);
      setProcessingNotes("");
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", color: string }> = {
      pending: { variant: "outline", color: "text-yellow-600" },
      approved: { variant: "default", color: "text-green-600" },
      rejected: { variant: "destructive", color: "text-red-600" },
      fulfilled: { variant: "secondary", color: "text-blue-600" },
      urgent: { variant: "destructive", color: "text-red-600" }
    };

    const config = variants[status] || variants.pending;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode }> = {
      low: { variant: "outline", icon: <Clock className="h-3 w-3" /> },
      medium: { variant: "secondary", icon: <AlertTriangle className="h-3 w-3" /> },
      high: { variant: "default", icon: <AlertTriangle className="h-3 w-3" /> },
      critical: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3" /> }
    };

    const config = variants[urgency] || variants.low;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
      </Badge>
    );
  };

  const filteredRequests = statusFilter === "all" 
    ? bloodRequests 
    : bloodRequests.filter(req => req.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        <Header userRole="admin" userName="Admin" onRoleChange={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading requests...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Header userRole="admin" userName="Admin" onRoleChange={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Process Blood Requests
              </h1>
              <p className="text-muted-foreground mt-1">
                Review and process incoming blood requests from hospitals and patients
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Requests Section */}
        {emergencyRequests.length > 0 && (
          <Card className="mb-6 border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Emergency Requests ({emergencyRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {emergencyRequests.map((request) => (
                  <div key={request.id} className="bg-background/50 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{request.name}</span>
                        <Badge variant="destructive" className="ml-2">
                          {request.blood_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {request.units} units needed
                        </span>
                      </div>
                      {getUrgencyBadge(request.urgency)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {request.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {request.contact}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {request.notes && (
                      <p className="text-sm mt-2 p-2 bg-muted/50 rounded">{request.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regular Blood Requests Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Blood Requests ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <div className="text-center py-8">
                <Droplets className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                <p className="text-muted-foreground">
                  {statusFilter === "all" 
                    ? "No blood requests have been submitted yet." 
                    : `No ${statusFilter} requests found.`}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requester</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.profile?.full_name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{request.profile?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {request.blood_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.quantity} units</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Process Blood Request</DialogTitle>
                              </DialogHeader>
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Requester Information</h4>
                                      <div className="space-y-1 text-sm">
                                        <p><strong>Name:</strong> {selectedRequest.profile?.full_name}</p>
                                        <p><strong>Email:</strong> {selectedRequest.profile?.email}</p>
                                        <p><strong>Phone:</strong> {selectedRequest.profile?.phone || 'N/A'}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Request Details</h4>
                                      <div className="space-y-1 text-sm">
                                        <p><strong>Blood Type:</strong> {selectedRequest.blood_type}</p>
                                        <p><strong>Units:</strong> {selectedRequest.quantity}</p>
                                        <p><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
                                        <p><strong>Date:</strong> {new Date(selectedRequest.created_at).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Processing Notes</label>
                                    <Textarea
                                      value={processingNotes}
                                      onChange={(e) => setProcessingNotes(e.target.value)}
                                      placeholder="Add notes about the processing decision..."
                                      className="min-h-[80px]"
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                                      className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                                      className="bg-medical-success hover:bg-medical-success/90"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {request.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateRequestStatus(request.id, 'approved')}
                                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateRequestStatus(request.id, 'rejected')}
                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProcessBloodRequests;