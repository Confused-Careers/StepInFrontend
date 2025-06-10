"use client";

import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  Shield,
  CreditCard,
  Mail,
  MessageSquare,
  Calendar,
  User,
  Briefcase,
  CheckCircle,
  ChevronLeft,
  Trash2,
} from "lucide-react";

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  content: JSX.Element;
}

const settingsSections: SettingsSection[] = [
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    description: "Manage how you receive notifications",
    content: (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <div className="space-y-3">
              {[
                { id: "email-jobs", label: "New job matches", icon: Briefcase },
                { id: "email-applications", label: "Application updates", icon: Mail },
                { id: "email-messages", label: "New messages", icon: MessageSquare },
                { id: "email-interviews", label: "Interview reminders", icon: Calendar },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                    </div>
                    <Switch id={item.id} defaultChecked />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Push Notifications</h3>
            <div className="space-y-3">
              {[
                { id: "push-jobs", label: "New job matches", icon: Briefcase },
                { id: "push-applications", label: "Application updates", icon: Mail },
                { id: "push-messages", label: "New messages", icon: MessageSquare },
                { id: "push-interviews", label: "Interview reminders", icon: Calendar },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                    </div>
                    <Switch id={item.id} defaultChecked={item.id !== "push-jobs"} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Frequency</h3>
            <div className="space-y-2">
              <Label htmlFor="frequency">Email Digest Frequency</Label>
              <select id="frequency" className="w-full p-2 rounded-md border border-input bg-background" defaultValue="daily">
                <option value="realtime">Real-time</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={false}>Save Preferences</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    icon: Shield,
    description: "Control your privacy and data settings",
    content: (
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your privacy and data settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profile Visibility</h3>
            <div className="space-y-3">
              {[
                { id: "visibility-recruiters", label: "Visible to recruiters" },
                { id: "visibility-companies", label: "Visible to companies I apply to" },
                { id: "visibility-public", label: "Visible in public search results" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                  <Switch id={item.id} defaultChecked={item.id !== "visibility-public"} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Usage</h3>
            <div className="space-y-3">
              {[
                { id: "data-personalization", label: "Use my data for personalized job recommendations" },
                { id: "data-analytics", label: "Allow anonymous usage data for analytics" },
                { id: "data-marketing", label: "Receive marketing communications" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                  <Switch id={item.id} defaultChecked={item.id !== "data-marketing"} />
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button variant="outline" className="text-destructive hover:text-destructive">
              Download My Data
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button disabled={false}>Save Settings</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    id: "billing",
    title: "Billing",
    icon: CreditCard,
    description: "Manage your subscription and payment methods",
    content: (
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Manage your subscription and payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Current Plan</h3>
                <p className="text-sm text-muted-foreground">Free Plan</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Basic job matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Up to 10 applications per month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Standard support</span>
              </div>
            </div>
            <Button className="mt-4 w-full">Upgrade to Pro</Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Methods</h3>
            <p className="text-sm text-muted-foreground">No payment methods added yet.</p>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing History</h3>
            <p className="text-sm text-muted-foreground">No billing history available.</p>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "account",
    title: "Account",
    icon: User,
    description: "Manage your account and security",
    content: (
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </div>
          <div className="pt-6 border-t space-y-4">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch id="2fa" />
            </div>
            <Button variant="outline" disabled>Set Up 2FA</Button>
          </div>
          <div className="pt-6 border-t space-y-4">
            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back.</p>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  },
];

interface SettingsDetailProps {
  section: SettingsSection | null;
  onBackClick: () => void;
}

function SettingsDetail({ section, onBackClick }: SettingsDetailProps) {
  if (!section) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Button variant="ghost" className="mb-4" onClick={onBackClick}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Settings
      </Button>
      {section.content}
    </motion.div>
  );
}

export default function SettingsPage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const selectedSectionDetails = selectedSection
    ? settingsSections.find((section) => section.id === selectedSection) || null
    : null;

  return (
    <main className="flex-1 pb-8">
      <AnimatePresence mode="wait">
        {selectedSection ? (
          <SettingsDetail
            key="settings-detail"
            section={selectedSectionDetails}
            onBackClick={() => setSelectedSection(null)}
          />
        ) : (
          <motion.div
            key="settings-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                {settingsSections.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{section.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {settingsSections.map((section) => (
                <TabsContent key={section.id} value={section.id}>
                  <Card
                    className="cursor-pointer"
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <section.icon className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>{section.title}</CardTitle>
                      </div>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}