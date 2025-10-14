import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Page } from "@/design-system/components";
import { designTokens } from "@/design-system/tokens";
import {
    ArrowRight,
    Award,
    BarChart3,
    BookOpen,
    Bot,
    Brain,
    Building2,
    CheckCircle,
    Clock,
    Heart,
    HelpCircle,
    Lightbulb,
    Linkedin,
    Mail,
    MessageSquare,
    RefreshCw,
    Rocket,
    Search,
    Settings,
    Sparkles,
    Target,
    Target as TargetIcon,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";

const AboutPage = () => {
  const keyFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Lead Scoring",
      description: "Automatically score and prioritize leads based on AI analysis",
      benefits: [
        "Focus on high-quality prospects first",
        "Reduce time spent on low-value leads",
        "Increase conversion rates by 40%",
        "Smart prioritization saves hours daily"
      ]
    },
    {
      icon: Heart,
      title: "Smart Favoriting System",
      description: "Mark and track your most important leads and companies",
      benefits: [
        "Quick access to your top prospects",
        "Never lose track of important contacts",
        "Personalized lead management",
        "Streamlined follow-up process"
      ]
    },
    {
      icon: Zap,
      title: "Advanced Lead Scraping",
      description: "Automated lead discovery with intelligent filtering",
      benefits: [
        "Find qualified leads automatically",
        "Target specific industries and roles",
        "Continuous lead pipeline growth",
        "Reduce manual research time by 80%"
      ]
    },
    {
      icon: Bot,
      title: "Automated Outreach",
      description: "Set up automated LinkedIn and email sequences",
      benefits: [
        "Scale your outreach efforts",
        "Consistent follow-up timing",
        "Personalized message sequences",
        "Never miss a follow-up opportunity"
      ]
    },
    {
      icon: Target,
      title: "Pipeline Management",
      description: "Visual pipeline with drag-and-drop lead progression",
      benefits: [
        "Clear view of your sales funnel",
        "Easy lead stage management",
        "Track progress at a glance",
        "Identify bottlenecks quickly"
      ]
    },
    {
      icon: Building2,
      title: "Company Intelligence",
      description: "Comprehensive company profiles with automatic updates",
      benefits: [
        "Complete company insights",
        "Automatic logo and data fetching",
        "Industry and size classification",
        "Better targeting and personalization"
      ]
    },
    {
      icon: MessageSquare,
      title: "Conversation Tracking",
      description: "Centralized communication history and management",
      benefits: [
        "All conversations in one place",
        "Never lose context",
        "Track response rates",
        "Improve communication timing"
      ]
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Real-time insights and performance metrics",
      benefits: [
        "Track key performance indicators",
        "Identify successful strategies",
        "Data-driven decision making",
        "Continuous improvement insights"
      ]
    }
  ];

  const automationFeatures = [
    {
      icon: Linkedin,
      title: "LinkedIn Automation",
      description: "Automated connection requests, messaging, and follow-ups",
      features: ["Smart connection targeting", "Personalized message sequences", "Response tracking", "Compliance monitoring"]
    },
    {
      icon: Mail,
      title: "Email Campaigns",
      description: "Automated email sequences with template management",
      features: ["Template library", "A/B testing", "Delivery optimization", "Open rate tracking"]
    },
    {
      icon: Search,
      title: "Lead Discovery",
      description: "Automated lead finding and qualification",
      features: ["Industry targeting", "Role-based filtering", "Company size criteria", "Location preferences"]
    },
    {
      icon: RefreshCw,
      title: "Data Synchronization",
      description: "Real-time data updates across all platforms",
      features: ["Automatic profile updates", "Contact information sync", "Activity tracking", "Status updates"]
    }
  ];

  const businessBenefits = [
    {
      icon: TrendingUp,
      title: "Increase Productivity",
      description: "Save 10+ hours per week with automation",
      metric: "300% more efficient"
    },
    {
      icon: Target,
      title: "Higher Conversion Rates",
      description: "Better targeting leads to more qualified prospects",
      metric: "40% improvement"
    },
    {
      icon: Clock,
      title: "Faster Response Times",
      description: "Never miss an opportunity with automated follow-ups",
      metric: "5x faster follow-up"
    },
    {
      icon: Award,
      title: "Better Lead Quality",
      description: "AI scoring ensures you focus on the right prospects",
      metric: "60% higher quality"
    }
  ];

  const userTypes = [
    {
      role: "Recruitment Agencies",
      description: "Scale your operations and improve client satisfaction",
      benefits: ["Manage multiple clients", "Track placement success", "Automated candidate sourcing", "Client reporting"]
    },
    {
      role: "Corporate Recruiters",
      description: "Streamline internal hiring and reduce time-to-fill",
      benefits: ["Internal pipeline management", "Department collaboration", "Candidate tracking", "Hiring analytics"]
    },
    {
      role: "Sales Teams",
      description: "Generate more qualified leads and close more deals",
      benefits: ["Lead generation", "Prospect management", "Sales pipeline", "Performance tracking"]
    },
    {
      role: "Business Development",
      description: "Identify and nurture strategic partnerships",
      benefits: ["Partnership identification", "Relationship tracking", "Outreach automation", "ROI measurement"]
    }
  ];

  return (
    <Page
      title="Empowr CRM Features"
    >
      <div className="space-y-8 w-full">
        {/* Hero Section */}
        <Card className={designTokens.shadows.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Rocket className="h-6 w-6 text-primary" />
              Why Choose Empowr CRM?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Empowr CRM is designed to revolutionize how you manage leads, companies, and recruitment processes. 
              Our AI-powered platform helps you work smarter, not harder, by automating repetitive tasks and 
              providing intelligent insights that drive better results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered Intelligence</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Complete Automation</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Proven Results</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className={designTokens.shadows.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Key Features & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 ml-11">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Features */}
        <Card className={designTokens.shadows.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Automation & Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {automationFeatures.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <feature.icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-11">
                    {feature.features.map((feat, featIndex) => (
                      <Badge key={featIndex} variant="secondary" className="text-xs">
                        {feat}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Benefits */}
        <Card className={designTokens.shadows.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Proven Business Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessBenefits.map((benefit, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    <div className="mt-2 text-lg font-bold text-primary">{benefit.metric}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Perfect For */}
        <Card className={designTokens.shadows.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Perfect For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userTypes.map((type, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <TargetIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{type.role}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-1 ml-11">
                    {type.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className={designTokens.shadows.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Get Started Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <h3 className="font-semibold">Explore Your Dashboard</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Start with your personalized dashboard to see your key metrics and recent activity.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <h3 className="font-semibold">Add Your First People</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Import or manually add your prospects and watch AI score them automatically.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <h3 className="font-semibold">Set Up Automation</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Configure automated outreach sequences and watch your productivity soar.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      4
                    </div>
                    <h3 className="font-semibold">Organize Your Pipeline</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Set up your sales stages and start moving leads through your process.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      5
                    </div>
                    <h3 className="font-semibold">Track Performance</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Monitor your success with real-time analytics and performance insights.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      6
                    </div>
                    <h3 className="font-semibold">Scale Your Success</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Use insights to optimize your process and achieve even better results.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className={designTokens.shadows.card}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Ready to Get Started?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Add Your First Lead
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Bot className="h-4 w-4 mr-2" />
                    Setup Automation
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Our platform is designed to be intuitive and easy to use. If you need assistance, 
                  check out our built-in help system or contact support.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open('/docs/MASTER_INDEX.md', '_blank')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Documentation
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default AboutPage;