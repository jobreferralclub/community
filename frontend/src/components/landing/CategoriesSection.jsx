import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  TrendingUp,
  Briefcase,
  Rocket,
  PieChart,
  ShoppingCart,
  Layers3,
  Megaphone,
} from "lucide-react";

const baseCategories = [
  {
    icon: BarChart3,
    title: "Product Management",
    description: "Connect with PMs at top tech companies. Get insights on product strategy roles.",
    avgSalary: "$145K",
    companies: ["Google", "Meta", "Uber"],
    color: "bg-primary-green/10 border-primary-green/30",
    iconColor: "text-primary-green",
  },
  {
    icon: Layers3,
    title: "Program & Project Management",
    description: "Access program management roles and connect with project leaders at growing companies.",
    avgSalary: "$135K",
    companies: ["Microsoft", "Amazon", "Atlassian"],
    color: "bg-blue-500/10 border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Briefcase,
    title: "Operations & Supply Chain Management",
    description: "Ops roles that drive business growth. Connect with operational excellence leaders.",
    avgSalary: "$120K",
    companies: ["Tesla", "SpaceX", "DoorDash"],
    color: "bg-red-500/10 border-red-500/30",
    iconColor: "text-red-400",
  },
  {
    icon: Users,
    title: "Sales & Account Management",
    description: "High-growth sales and account management roles. Connect with revenue leaders.",
    avgSalary: "$115K",
    companies: ["Salesforce", "HubSpot", "Stripe"],
    color: "bg-green-500/10 border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    icon: ShoppingCart,
    title: "Category & Vendor Management",
    description: "Strategic sourcing and vendor management roles at leading retail and tech companies.",
    avgSalary: "$125K",
    companies: ["Amazon", "Walmart", "Target"],
    color: "bg-purple-500/10 border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: PieChart,
    title: "Analytics",
    description: "Find data science, analytics, and ML roles. Connect with data professionals.",
    avgSalary: "$135K",
    companies: ["Netflix", "Airbnb", "Spotify"],
    color: "bg-cyan-500/10 border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: TrendingUp,
    title: "Strategy & Consulting",
    description: "Access strategy roles at leading consulting firms and internal strategy positions.",
    avgSalary: "$165K",
    companies: ["McKinsey", "BCG", "Bain"],
    color: "bg-indigo-500/10 border-indigo-500/30",
    iconColor: "text-indigo-400",
  },
  {
    icon: Megaphone,
    title: "Marketing Management",
    description: "Marketing strategy, digital marketing, and brand management roles at top companies.",
    avgSalary: "$125K",
    companies: ["HubSpot", "Shopify", "Adobe"],
    color: "bg-orange-500/10 border-orange-500/30",
    iconColor: "text-orange-400",
  },
];

const CategoriesSection = () => {
  const [categories, setCategories] = useState(
    baseCategories.map((cat) => ({ ...cat, openRoles: 0 }))
  );

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/roles");
        const data = await res.json();

        const updated = baseCategories.map((category) => {
          const match = data.openRoles.find(
            (role) => role.title === category.title
          );
          return {
            ...category,
            openRoles: match ? match.count : 0,
          };
        });

        setCategories(updated);
      } catch (err) {
        console.error("Failed to fetch role counts:", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <section className="section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Referrals Across <span className="gradient-text">Every Industry</span>
          </h2>
          <p className="section-subtitle">
            Whatever your expertise, we connect you with professionals in your field. Find your next role through people who understand your ambitions.
          </p>
        </motion.div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`h-full ${category.color} hover:border-primary-green/50 card-hover group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-900/50 flex items-center justify-center group-hover:bg-gray-900/70 transition-colors duration-300">
                      <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-primary-green/20 text-primary-green border-primary-green/30"
                    >
                      {category.openRoles} open
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-green transition-colors duration-300">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Avg. Salary</span>
                    <span className="font-semibold text-primary-green">{category.avgSalary}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500">Top Companies:</span>
                    <div className="flex flex-wrap gap-1">
                      {category.companies.map((company, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gray-700 text-gray-400">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`h-full ${category.color} hover:border-primary-green/50 card-hover group`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-900/50 flex items-center justify-center group-hover:bg-gray-900/70 transition-colors duration-300">
                      <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-primary-green/20 text-primary-green border-primary-green/30"
                    >
                      {category.openRoles} open
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary-green transition-colors duration-300">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Avg. Salary</span>
                    <span className="font-semibold text-primary-green">{category.avgSalary}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500">Top Companies:</span>
                    <div className="flex flex-wrap gap-1">
                      {category.companies.map((company, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-gray-700 text-gray-400">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-green/10 to-primary-green/5 rounded-2xl p-8 border border-primary-green/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Rocket className="w-6 h-6 text-primary-green" />
              <h3 className="text-2xl font-bold">Ready to Get Started?</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of ambitious professionals who've unlocked better opportunities through trusted referrals and powerful connections.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
