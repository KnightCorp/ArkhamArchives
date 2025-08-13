import React, { useEffect, useRef } from "react";
import {
  Search,
  Brain,
  Database,
  Users,
  Shield,
  Zap,
  Globe,
  Network,
  Cpu,
  Eye,
  Target,
  TrendingUp,
  GitBranch,
  Share2,
  UserPlus,
  Lock,
  UserCheck,
  ExternalLink,
} from "lucide-react";

const AiSearchDigitalLabs: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPrepTimeIndex, setCurrentPrepTimeIndex] = React.useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const searchFeatures = [
    {
      icon: Brain,
      title: "Multi-LLM Integration",
      desc: "Select from multiple language models and APIs for optimal results",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    },
    {
      icon: Database,
      title: "Blockchain Archive",
      desc: "Immutable website archiving on blockchain for permanent access",
      image:
        "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg",
    },
    {
      icon: Network,
      title: "Data Source Management",
      desc: "Unified interface for managing diverse data sources and integrations",
      image:
        "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg",
    },
    {
      icon: Shield,
      title: "Secure Processing",
      desc: "End-to-end encryption with privacy-first architecture",
      image:
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
    },
  ];

  const researchSpaces = [
    {
      name: "Finance & Trading",
      icon: TrendingUp,
      image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg",
      applications: [
        "Bloomberg Terminal",
        "Trading Platforms",
        "Risk Management Systems",
        "Portfolio Analytics",
      ],
      aiModels: [
        "Market Prediction Models",
        "Sentiment Analysis",
        "Fraud Detection",
        "Algorithmic Trading",
      ],
      dataPipelines: [
        "Real-time Market Data",
        "News Sentiment Feeds",
        "Economic Indicators",
        "Transaction Monitoring",
      ],
      automationTools: [
        "Trade Execution",
        "Risk Assessment",
        "Compliance Reporting",
        "Portfolio Rebalancing",
      ],
    },
    {
      name: "Healthcare & Biotech",
      icon: Brain,
      image:
        "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
      applications: [
        "Electronic Health Records",
        "Medical Imaging",
        "Drug Discovery Platforms",
        "Clinical Trial Management",
      ],
      aiModels: [
        "Diagnostic AI",
        "Drug Interaction Models",
        "Genomic Analysis",
        "Treatment Recommendation",
      ],
      dataPipelines: [
        "Patient Data Integration",
        "Lab Results Processing",
        "Medical Literature Mining",
        "Clinical Trial Data",
      ],
      automationTools: [
        "Appointment Scheduling",
        "Prescription Management",
        "Lab Report Generation",
        "Treatment Planning",
      ],
    },
    {
      name: "Legal & Compliance",
      icon: Shield,
      image:
        "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg",
      applications: [
        "Case Management Systems",
        "Document Review Platforms",
        "Legal Research Tools",
        "Contract Management",
      ],
      aiModels: [
        "Contract Analysis",
        "Legal Precedent Search",
        "Risk Assessment",
        "Compliance Monitoring",
      ],
      dataPipelines: [
        "Legal Document Processing",
        "Regulatory Updates",
        "Case Law Analysis",
        "Client Communication",
      ],
      automationTools: [
        "Document Generation",
        "Deadline Tracking",
        "Billing Automation",
        "Compliance Reporting",
      ],
    },
    {
      name: "Engineering & Tech",
      icon: Cpu,
      image:
        "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
      applications: [
        "CAD Software",
        "Project Management",
        "Version Control",
        "Testing Frameworks",
      ],
      aiModels: [
        "Code Generation",
        "Bug Detection",
        "Performance Optimization",
        "Design Validation",
      ],
      dataPipelines: [
        "Code Repository Analysis",
        "Performance Metrics",
        "User Feedback",
        "System Monitoring",
      ],
      automationTools: [
        "CI/CD Pipelines",
        "Testing Automation",
        "Deployment Scripts",
        "Code Review",
      ],
    },
    {
      name: "Marketing & Sales",
      icon: Target,
      image:
        "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
      applications: [
        "CRM Systems",
        "Marketing Automation",
        "Analytics Platforms",
        "Content Management",
      ],
      aiModels: [
        "Customer Segmentation",
        "Lead Scoring",
        "Content Optimization",
        "Price Prediction",
      ],
      dataPipelines: [
        "Customer Journey Tracking",
        "Social Media Monitoring",
        "Sales Performance",
        "Campaign Analytics",
      ],
      automationTools: [
        "Email Campaigns",
        "Lead Nurturing",
        "Social Media Posting",
        "Report Generation",
      ],
    },
    {
      name: "Supply Chain",
      icon: Network,
      image:
        "https://images.pexels.com/photos/3183190/pexels-photo-3183190.jpeg",
      applications: [
        "Inventory Management",
        "Logistics Platforms",
        "Supplier Portals",
        "Demand Planning",
      ],
      aiModels: [
        "Demand Forecasting",
        "Route Optimization",
        "Quality Prediction",
        "Supplier Risk Assessment",
      ],
      dataPipelines: [
        "Inventory Tracking",
        "Shipment Monitoring",
        "Supplier Performance",
        "Market Demand",
      ],
      automationTools: [
        "Order Processing",
        "Inventory Replenishment",
        "Shipment Tracking",
        "Supplier Communication",
      ],
    },
    {
      name: "Energy & Utilities",
      icon: Zap,
      image:
        "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
      applications: [
        "Grid Management",
        "Asset Monitoring",
        "Customer Billing",
        "Maintenance Systems",
      ],
      aiModels: [
        "Load Forecasting",
        "Predictive Maintenance",
        "Outage Prediction",
        "Energy Optimization",
      ],
      dataPipelines: [
        "Smart Meter Data",
        "Weather Integration",
        "Equipment Sensors",
        "Customer Usage",
      ],
      automationTools: [
        "Grid Balancing",
        "Maintenance Scheduling",
        "Billing Automation",
        "Outage Response",
      ],
    },
    {
      name: "Education & Training",
      icon: Brain,
      image:
        "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg",
      applications: [
        "Learning Management Systems",
        "Assessment Platforms",
        "Virtual Classrooms",
        "Content Creation",
      ],
      aiModels: [
        "Personalized Learning",
        "Performance Prediction",
        "Content Recommendation",
        "Skill Assessment",
      ],
      dataPipelines: [
        "Student Progress Tracking",
        "Learning Analytics",
        "Content Engagement",
        "Assessment Results",
      ],
      automationTools: [
        "Assignment Grading",
        "Progress Reporting",
        "Content Delivery",
        "Student Communication",
      ],
    },
    {
      name: "Media & Entertainment",
      icon: Eye,
      image:
        "https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg",
      applications: [
        "Content Management",
        "Streaming Platforms",
        "Production Tools",
        "Distribution Systems",
      ],
      aiModels: [
        "Content Recommendation",
        "Audience Analysis",
        "Content Generation",
        "Quality Enhancement",
      ],
      dataPipelines: [
        "Viewer Analytics",
        "Content Performance",
        "Social Media Sentiment",
        "Revenue Tracking",
      ],
      automationTools: [
        "Content Scheduling",
        "Social Media Management",
        "Revenue Optimization",
        "Audience Targeting",
      ],
    },
    {
      name: "Real Estate",
      icon: Globe,
      image:
        "https://images.pexels.com/photos/1036657/pexels-photo-1036657.jpeg",
      applications: [
        "Property Management",
        "CRM Systems",
        "Market Analysis",
        "Virtual Tours",
      ],
      aiModels: [
        "Property Valuation",
        "Market Prediction",
        "Investment Analysis",
        "Customer Matching",
      ],
      dataPipelines: [
        "Market Data Integration",
        "Property Listings",
        "Customer Preferences",
        "Transaction History",
      ],
      automationTools: [
        "Lead Generation",
        "Property Matching",
        "Document Processing",
        "Marketing Campaigns",
      ],
    },
    {
      name: "Agriculture & Food",
      icon: Database,
      image:
        "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg",
      applications: [
        "Farm Management",
        "Supply Chain Tracking",
        "Quality Control",
        "Market Platforms",
      ],
      aiModels: [
        "Crop Yield Prediction",
        "Disease Detection",
        "Weather Analysis",
        "Quality Assessment",
      ],
      dataPipelines: [
        "Sensor Data Integration",
        "Weather Monitoring",
        "Market Prices",
        "Supply Chain Tracking",
      ],
      automationTools: [
        "Irrigation Control",
        "Harvesting Scheduling",
        "Quality Monitoring",
        "Market Analysis",
      ],
    },
    {
      name: "Transportation",
      icon: Network,
      image:
        "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
      applications: [
        "Fleet Management",
        "Route Planning",
        "Maintenance Systems",
        "Booking Platforms",
      ],
      aiModels: [
        "Route Optimization",
        "Predictive Maintenance",
        "Demand Forecasting",
        "Safety Analysis",
      ],
      dataPipelines: [
        "Vehicle Tracking",
        "Traffic Data",
        "Maintenance Records",
        "Customer Bookings",
      ],
      automationTools: [
        "Route Planning",
        "Maintenance Scheduling",
        "Booking Management",
        "Fleet Optimization",
      ],
    },
    {
      name: "Cybersecurity",
      icon: Shield,
      image:
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
      applications: [
        "SIEM Systems",
        "Threat Detection",
        "Vulnerability Scanners",
        "Incident Response",
      ],
      aiModels: [
        "Anomaly Detection",
        "Threat Intelligence",
        "Behavioral Analysis",
        "Risk Assessment",
      ],
      dataPipelines: [
        "Network Traffic Analysis",
        "Log Aggregation",
        "Threat Feeds",
        "Security Events",
      ],
      automationTools: [
        "Incident Response",
        "Patch Management",
        "Threat Hunting",
        "Compliance Monitoring",
      ],
    },
    {
      name: "Manufacturing",
      icon: Cpu,
      image:
        "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg",
      applications: [
        "ERP Systems",
        "Quality Control",
        "Production Planning",
        "Asset Management",
      ],
      aiModels: [
        "Predictive Maintenance",
        "Quality Prediction",
        "Production Optimization",
        "Demand Forecasting",
      ],
      dataPipelines: [
        "Sensor Data Integration",
        "Production Metrics",
        "Quality Data",
        "Supply Chain",
      ],
      automationTools: [
        "Production Scheduling",
        "Quality Control",
        "Maintenance Planning",
        "Inventory Management",
      ],
    },
    {
      name: "Retail & E-commerce",
      icon: Target,
      image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
      applications: [
        "E-commerce Platforms",
        "Inventory Systems",
        "POS Systems",
        "Customer Analytics",
      ],
      aiModels: [
        "Recommendation Engines",
        "Price Optimization",
        "Demand Forecasting",
        "Customer Segmentation",
      ],
      dataPipelines: [
        "Customer Behavior",
        "Sales Data",
        "Inventory Levels",
        "Market Trends",
      ],
      automationTools: [
        "Order Processing",
        "Inventory Management",
        "Customer Service",
        "Marketing Campaigns",
      ],
    },
    {
      name: "Government & Policy",
      icon: Eye,
      image:
        "https://images.pexels.com/photos/8112198/pexels-photo-8112198.jpeg",
      applications: [
        "Citizen Services",
        "Policy Management",
        "Data Analytics",
        "Communication Platforms",
      ],
      aiModels: [
        "Policy Impact Analysis",
        "Citizen Sentiment",
        "Resource Allocation",
        "Fraud Detection",
      ],
      dataPipelines: [
        "Citizen Data",
        "Policy Metrics",
        "Economic Indicators",
        "Social Media Monitoring",
      ],
      automationTools: [
        "Service Delivery",
        "Policy Implementation",
        "Data Reporting",
        "Citizen Communication",
      ],
    },
    {
      name: "Non-profit & NGO",
      icon: Users,
      image:
        "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg",
      applications: [
        "Donor Management",
        "Project Tracking",
        "Volunteer Coordination",
        "Impact Measurement",
      ],
      aiModels: [
        "Donor Prediction",
        "Impact Assessment",
        "Resource Optimization",
        "Outreach Targeting",
      ],
      dataPipelines: [
        "Donor Analytics",
        "Project Data",
        "Volunteer Tracking",
        "Impact Metrics",
      ],
      automationTools: [
        "Fundraising Campaigns",
        "Volunteer Management",
        "Project Reporting",
        "Donor Communication",
      ],
    },
    {
      name: "Research & Academia",
      icon: Brain,
      image:
        "https://images.pexels.com/photos/3825537/pexels-photo-3825537.jpeg",
      applications: [
        "Research Management",
        "Publication Systems",
        "Collaboration Tools",
        "Data Analysis",
      ],
      aiModels: [
        "Literature Analysis",
        "Research Prediction",
        "Collaboration Matching",
        "Grant Success Prediction",
      ],
      dataPipelines: [
        "Research Data",
        "Publication Metrics",
        "Collaboration Networks",
        "Funding Information",
      ],
      automationTools: [
        "Research Workflow",
        "Publication Management",
        "Collaboration Facilitation",
        "Grant Applications",
      ],
    },
    {
      name: "Consulting",
      icon: TrendingUp,
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
      applications: [
        "Project Management",
        "Client Portals",
        "Knowledge Management",
        "Time Tracking",
      ],
      aiModels: [
        "Project Success Prediction",
        "Resource Optimization",
        "Client Matching",
        "Market Analysis",
      ],
      dataPipelines: [
        "Project Data",
        "Client Feedback",
        "Market Intelligence",
        "Performance Metrics",
      ],
      automationTools: [
        "Project Planning",
        "Client Communication",
        "Report Generation",
        "Resource Allocation",
      ],
    },
    {
      name: "Insurance",
      icon: Shield,
      image:
        "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg",
      applications: [
        "Claims Processing",
        "Underwriting Systems",
        "Customer Portals",
        "Risk Assessment",
      ],
      aiModels: [
        "Risk Prediction",
        "Fraud Detection",
        "Claims Automation",
        "Customer Segmentation",
      ],
      dataPipelines: [
        "Claims Data",
        "Customer Information",
        "Market Data",
        "Regulatory Updates",
      ],
      automationTools: [
        "Claims Processing",
        "Policy Management",
        "Customer Service",
        "Risk Assessment",
      ],
    },
    {
      name: "Telecommunications",
      icon: Network,
      image: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg",
      applications: [
        "Network Management",
        "Customer Service",
        "Billing Systems",
        "Service Provisioning",
      ],
      aiModels: [
        "Network Optimization",
        "Churn Prediction",
        "Service Recommendation",
        "Fault Detection",
      ],
      dataPipelines: [
        "Network Performance",
        "Customer Usage",
        "Service Quality",
        "Market Trends",
      ],
      automationTools: [
        "Network Monitoring",
        "Service Provisioning",
        "Customer Support",
        "Billing Automation",
      ],
    },
    {
      name: "Aerospace & Defense",
      icon: Zap,
      image:
        "https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg",
      applications: [
        "Mission Planning",
        "Asset Tracking",
        "Maintenance Systems",
        "Simulation Platforms",
      ],
      aiModels: [
        "Mission Optimization",
        "Predictive Maintenance",
        "Threat Assessment",
        "Performance Analysis",
      ],
      dataPipelines: [
        "Sensor Data",
        "Mission Data",
        "Maintenance Records",
        "Performance Metrics",
      ],
      automationTools: [
        "Mission Planning",
        "Asset Management",
        "Maintenance Scheduling",
        "Performance Monitoring",
      ],
    },
    {
      name: "Pharmaceuticals",
      icon: Database,
      image:
        "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg",
      applications: [
        "Drug Discovery",
        "Clinical Trials",
        "Regulatory Management",
        "Supply Chain",
      ],
      aiModels: [
        "Drug Discovery AI",
        "Clinical Trial Optimization",
        "Adverse Event Prediction",
        "Market Analysis",
      ],
      dataPipelines: [
        "Research Data",
        "Clinical Data",
        "Regulatory Information",
        "Market Intelligence",
      ],
      automationTools: [
        "Research Workflow",
        "Trial Management",
        "Regulatory Reporting",
        "Supply Chain Optimization",
      ],
    },
    {
      name: "Mining & Resources",
      icon: Globe,
      image:
        "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg",
      applications: [
        "Resource Planning",
        "Equipment Management",
        "Safety Systems",
        "Environmental Monitoring",
      ],
      aiModels: [
        "Resource Prediction",
        "Equipment Optimization",
        "Safety Analysis",
        "Environmental Impact",
      ],
      dataPipelines: [
        "Geological Data",
        "Equipment Sensors",
        "Safety Metrics",
        "Environmental Data",
      ],
      automationTools: [
        "Resource Planning",
        "Equipment Maintenance",
        "Safety Monitoring",
        "Environmental Compliance",
      ],
    },
    {
      name: "Sports & Fitness",
      icon: Target,
      image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg",
      applications: [
        "Performance Analytics",
        "Training Management",
        "Fan Engagement",
        "Health Monitoring",
      ],
      aiModels: [
        "Performance Prediction",
        "Injury Prevention",
        "Training Optimization",
        "Fan Behavior Analysis",
      ],
      dataPipelines: [
        "Performance Data",
        "Health Metrics",
        "Training Data",
        "Fan Engagement",
      ],
      automationTools: [
        "Training Scheduling",
        "Performance Monitoring",
        "Fan Communication",
        "Health Tracking",
      ],
    },
  ];

  const prepTimeFeatures = [
    {
      icon: Eye,
      title: "Real-time Situational Awareness",
      desc: "Drawing signals from 25+ research spaces for comprehensive intelligence",
      image:
        "https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg",
    },
    {
      icon: Brain,
      title: "Predictive Analytics",
      desc: "Predicting eventualities and outcomes using advanced AI models",
      image:
        "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg",
    },
    {
      icon: Network,
      title: "Pattern Recognition",
      desc: "Uncovering invisible threads and correlations between disparate events",
      image:
        "https://images.pexels.com/photos/3183190/pexels-photo-3183190.jpeg",
    },
    {
      icon: Target,
      title: "Strategic Planning",
      desc: "Formulating approaches and strategies for complex problem solving",
      image:
        "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    },
  ];

  const socialFeatures = [
    {
      icon: Share2,
      title: "Research Publishing",
      desc: "Share your findings with the global research community",
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    },
    {
      icon: UserPlus,
      title: "Researcher Network",
      desc: "Follow and collaborate with leading researchers worldwide",
      image:
        "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
    },
    {
      icon: GitBranch,
      title: "Collaborative Spaces",
      desc: "Work together on complex research projects in real-time",
      image:
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    },
    {
      icon: Users,
      title: "Peer Review",
      desc: "Get feedback and validation from domain experts",
      image:
        "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg",
    },
  ];

  const privacyFeatures = [
    {
      icon: Lock,
      title: "Privacy by Design",
      desc: "Your data remains under your control with end-to-end encryption",
      image:
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
    },
    {
      icon: UserCheck,
      title: "Data Sharing Controls",
      desc: "Granular control over what data is shared and with whom",
      image:
        "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg",
    },
    {
      icon: Shield,
      title: "Secure Infrastructure",
      desc: "Zero-knowledge architecture ensures your research data stays private",
      image:
        "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg",
    },
  ];

  return (
    <div
      className="section-container"
      id="ai-search-digital-labs"
      ref={sectionRef}
    >
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="video-bg"
          onError={(e) => console.error("Video failed to load:", e)}
          onCanPlay={() => console.log("Video can play")}
          onLoadedData={() => console.log("Video loaded")}
        >
          <source src="/signup.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>
      <div className="video-overlay"></div>

      <div className="section-content max-w-[1920px] mx-auto px-12 py-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <Search className="w-12 h-12 text-white mr-6" />
            <Brain className="w-12 h-12 text-white mr-6" />
            <h2 className="section-title text-5xl">AI Search & Digital Labs</h2>
          </div>

          <p className="section-subtitle text-2xl max-w-4xl mx-auto">
            A comprehensive platform integrating advanced search, automation,
            and research capabilities with blockchain archiving, multi-LLM
            integration, and collaborative digital laboratories.
          </p>
        </div>

        {/* Advanced Search Platform */}
        <div className="glass rounded-lg p-12 mb-24">
          <div className="flex items-center mb-8">
            <Search className="w-10 h-10 text-white mr-6" />
            <h3 className="text-4xl font-bold">Advanced Search Platform</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {searchFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass bg-black/40 overflow-hidden group h-[300px] relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <feature.icon className="w-6 h-6 text-white" />
                    <h4 className="text-lg font-bold font-cinzel">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Spaces */}
        <div className="glass rounded-lg p-12 mb-24">
          <div className="flex items-center mb-8">
            <Database className="w-10 h-10 text-white mr-6" />
            <h3 className="text-4xl font-bold">Digital Research Spaces</h3>
          </div>

          <p className="text-xl mb-12 text-gray-300">
            Industry-specific digital laboratories with vertical agents,
            automated workflows, and reimagined professional tools for
            comprehensive research and development.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {researchSpaces.map((space, index) => (
              <div
                key={index}
                className="glass bg-black/40 overflow-hidden group h-[200px] relative hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <div className="flex items-center space-x-2 mb-1">
                    <space.icon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                      {space.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prep Time Module */}
        <div className="glass rounded-lg p-12 mb-24">
          <div className="flex items-center mb-8">
            <Eye className="w-10 h-10 text-white mr-6" />
            <h3 className="text-4xl font-bold">Prep Time Intelligence</h3>
          </div>

          <p className="text-xl mb-12 text-gray-300">
            Real-time situational awareness drawing from 25+ research spaces,
            providing predictive analytics, pattern recognition, and strategic
            planning capabilities for complex problem solving.
          </p>

          {/* Prep Time Sliderboard */}
          <div className="relative mb-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentPrepTimeIndex * 100}%)`,
                }}
              >
                {prepTimeFeatures.map((feature, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="glass bg-black/40 overflow-hidden group h-[400px] relative mx-4">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                        <div className="flex items-center space-x-4 mb-4">
                          <feature.icon className="w-8 h-8 text-white" />
                          <h4 className="text-2xl font-bold font-cinzel">
                            {feature.title}
                          </h4>
                        </div>
                        <p className="text-white/80 text-lg">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() =>
                setCurrentPrepTimeIndex(Math.max(0, currentPrepTimeIndex - 1))
              }
              disabled={currentPrepTimeIndex === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-full transition-all duration-300"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() =>
                setCurrentPrepTimeIndex(
                  Math.min(
                    prepTimeFeatures.length - 1,
                    currentPrepTimeIndex + 1
                  )
                )
              }
              disabled={currentPrepTimeIndex === prepTimeFeatures.length - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed p-3 rounded-full transition-all duration-300"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {prepTimeFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPrepTimeIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPrepTimeIndex
                      ? "bg-white"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Auto-advance functionality */}
        <div className="hidden">
          {React.useEffect(() => {
            const interval = setInterval(() => {
              setCurrentPrepTimeIndex((prev) =>
                prev === prepTimeFeatures.length - 1 ? 0 : prev + 1
              );
            }, 5000);

            return () => clearInterval(interval);
          }, [])}
        </div>

        {/* Social Research Platform */}
        <div className="glass rounded-lg p-12 mb-24">
          <div className="flex items-center mb-8">
            <Users className="w-10 h-10 text-white mr-6" />
            <h3 className="text-4xl font-bold">
              Collaborative Research Network
            </h3>
          </div>

          <p className="text-xl mb-12 text-gray-300">
            Connect with researchers worldwide, publish findings, and
            collaborate in real-time on complex research projects with peer
            review and validation systems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {socialFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass bg-black/40 overflow-hidden group h-[250px] relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <feature.icon className="w-6 h-6 text-white" />
                    <h4 className="text-lg font-bold font-cinzel">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Section */}
        <div className="glass rounded-lg p-12 mb-16">
          <div className="flex items-center mb-8">
            <Lock className="w-10 h-10 text-white mr-6" />
            <h3 className="text-4xl font-bold">Privacy First</h3>
          </div>

          <p className="text-xl mb-12 text-gray-300">
            Your privacy is our priority. We believe in giving you complete
            control over your data while delivering powerful AI research
            capabilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {privacyFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass bg-black/40 overflow-hidden group h-[250px] relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <feature.icon className="w-6 h-6 text-white" />
                    <h4 className="text-lg font-bold font-cinzel">
                      {feature.title}
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          <button className="cta-button text-lg px-12 py-4">
            Enter Digital Labs <Brain className="w-5 h-5 ml-2" />
          </button>

          <button className="cta-button text-lg px-12 py-4 bg-transparent border border-red-800 hover:bg-red-900/20">
            Start Research <Search className="w-5 h-5 ml-2" />
          </button>

          <a
            href="https://www.youtube.com/@thearkhamexperience"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button text-lg px-12 py-4 bg-transparent border border-red-800 hover:bg-red-900/20"
          >
            Watch Tutorial <ExternalLink className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AiSearchDigitalLabs;
