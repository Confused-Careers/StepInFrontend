import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Sparkles } from "lucide-react"

export function UIComponents() {
  return (
    <div className="container py-10 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6">StepIn Design System</h1>
        <p className="text-muted-foreground max-w-2xl">
          A comprehensive collection of UI components for the StepIn job-seeking platform. This design system provides a
          consistent look and feel across the application.
        </p>
      </div>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Typography</h2>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Heading 1</h1>
          <h2 className="text-3xl font-bold">Heading 2</h2>
          <h3 className="text-2xl font-bold">Heading 3</h3>
          <h4 className="text-xl font-bold">Heading 4</h4>
          <h5 className="text-lg font-bold">Heading 5</h5>
          <h6 className="text-base font-bold">Heading 6</h6>
          <p className="text-base">Base paragraph text</p>
          <p className="text-sm">Small text</p>
          <p className="text-xs">Extra small text</p>
          <p className="text-muted-foreground">Muted text for secondary information</p>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-20 w-full bg-primary rounded-md"></div>
            <p className="text-sm font-medium">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-secondary rounded-md"></div>
            <p className="text-sm font-medium">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-accent rounded-md"></div>
            <p className="text-sm font-medium">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-muted rounded-md"></div>
            <p className="text-sm font-medium">Muted</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-background rounded-md border"></div>
            <p className="text-sm font-medium">Background</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-foreground rounded-md"></div>
            <p className="text-sm font-medium">Foreground</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-destructive rounded-md"></div>
            <p className="text-sm font-medium">Destructive</p>
          </div>
          <div className="space-y-2">
            <div className="h-20 w-full bg-border rounded-md"></div>
            <p className="text-sm font-medium">Border</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button size="lg">Large</Button>
          <Button>Default</Button>
          <Button size="sm">Small</Button>
          <Button size="icon">
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button disabled>Disabled</Button>
          <Button className="group">
            With Icon
            <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
          </Button>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Form Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Enter your password" type="password" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>

            <div className="space-y-2">
              <Label>Notification preferences</Label>
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Enable notifications</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Experience level</Label>
              <RadioGroup defaultValue="mid">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entry" id="entry" />
                  <Label htmlFor="entry">Entry level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mid" id="mid" />
                  <Label htmlFor="mid">Mid level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="senior" id="senior" />
                  <Label htmlFor="senior">Senior level</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Salary range</Label>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>

            <Button className="mt-4">Submit</Button>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Posting</CardTitle>
              <CardDescription>View details about this position</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a sample job posting card that displays information about a job opportunity.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">Save</Button>
              <Button>Apply Now</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Complete your profile to improve matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>75% Complete</span>
                  <span className="text-muted-foreground">3/4 Steps</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">Complete your profile to get better job matches.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Complete Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20">Custom</Badge>
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Tabs</h2>
        <Tabs defaultValue="recommended" className="w-full">
          <TabsList>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
          </TabsList>
          <TabsContent value="recommended" className="p-4 border rounded-md mt-2">
            Content for recommended jobs tab
          </TabsContent>
          <TabsContent value="saved" className="p-4 border rounded-md mt-2">
            Content for saved jobs tab
          </TabsContent>
          <TabsContent value="applied" className="p-4 border rounded-md mt-2">
            Content for applied jobs tab
          </TabsContent>
        </Tabs>
      </section>

      {/* Progress */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Progress</h2>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>25% Complete</span>
              <span className="text-muted-foreground">1/4 Steps</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>50% Complete</span>
              <span className="text-muted-foreground">2/4 Steps</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>75% Complete</span>
              <span className="text-muted-foreground">3/4 Steps</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>100% Complete</span>
              <span className="text-muted-foreground">4/4 Steps</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
        </div>
      </section>
    </div>
  )
}

