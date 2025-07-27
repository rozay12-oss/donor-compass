import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { ArrowLeft, Heart, Calendar, Award, Bell, User, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const DonorPortal = () => {
  const donationHistory = [
    {
      id: "DON-001",
      date: "2024-01-10",
      location: "City Blood Bank",
      bloodType: "O+",
      amount: "450ml",
      status: "completed",
    },
    {
      id: "DON-002",
      date: "2023-11-15",
      location: "Metro Medical Center",
      bloodType: "O+",
      amount: "450ml",
      status: "completed",
    },
    {
      id: "DON-003",
      date: "2023-08-20",
      location: "City Blood Bank",
      bloodType: "O+",
      amount: "450ml",
      status: "completed",
    },
  ];

  const upcomingAppointments = [
    {
      id: "APP-001",
      date: "2024-01-25",
      time: "10:00 AM",
      location: "City Blood Bank",
      type: "Regular Donation",
    },
  ];

  const achievements = [
    { title: "First Time Donor", icon: "🩸", earned: true },
    { title: "Life Saver", description: "5 Donations", icon: "💪", earned: true },
    { title: "Hero", description: "10 Donations", icon: "🦸‍♂️", earned: false },
    { title: "Champion", description: "25 Donations", icon: "🏆", earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Header 
        userRole="donor" 
        userName="John Smith" 
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
              Donor Portal
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your donations and help save lives
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-muted-foreground">Total Donations</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">1,350ml</div>
                <div className="text-sm text-muted-foreground">Blood Donated</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">9</div>
                <div className="text-sm text-muted-foreground">Lives Potentially Saved</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">O+</div>
                <div className="text-sm text-muted-foreground">Blood Type</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Donation
                </h3>
                <p className="text-muted-foreground mb-4">
                  Book your next blood donation appointment
                </p>
                <Button className="w-full bg-gradient-primary text-white">
                  Schedule Now
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Update Profile
                </h3>
                <p className="text-muted-foreground mb-4">
                  Keep your contact information up to date
                </p>
                <Link to="/profile">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </h3>
                <p className="text-muted-foreground mb-4">
                  Manage your notification preferences
                </p>
                <Button variant="outline" className="w-full">
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 bg-background/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{appointment.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            📍 {appointment.location}
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                          Confirmed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming appointments. Schedule your next donation!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Donation History */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Donation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donationHistory.map((donation) => (
                  <div
                    key={donation.id}
                    className="border rounded-lg p-4 bg-background/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{donation.id}</span>
                        <Badge 
                          variant="outline" 
                          className="flex items-center gap-1 bg-green-500/10 text-green-700 border-green-200"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(donation.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Location:</span> {donation.location}
                      </div>
                      <div>
                        <span className="font-medium">Blood Type:</span> {donation.bloodType}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> {donation.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 text-center transition-colors ${
                      achievement.earned 
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20' 
                        : 'bg-background/50 border-muted'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className={`font-semibold mb-1 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </div>
                    {achievement.description && (
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                    )}
                    {achievement.earned && (
                      <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-700 border-green-200">
                        Earned
                      </Badge>
                    )}
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

export default DonorPortal;