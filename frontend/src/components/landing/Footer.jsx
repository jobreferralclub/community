import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Users,
  Mail,
  Linkedin,
  Instagram,
  Youtube,
  MapPin,
} from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "How It Works", href: "#how-it-works" },
        { label: "Categories", href: "#categories" },
        { label: "Success Stories", href: "#stories" },
        { label: "Simulations", href: "#practice" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Member Directory", href: "#directory" },
        { label: "Events", href: "#events" },
        { label: "Resources", href: "#resources" },
        { label: "Blog", href: "#blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "#help" },
        { label: "Contact Us", href: "#contact" },
        { label: "Community Guidelines", href: "#guidelines" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Press", href: "#press" },
        { label: "Partners", href: "#partners" },
      ],
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/company/jobreferralclub/",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/job_referral_club?utm_source=ig_web_button_share_sheet&igsh=MXRwMTduc290c3Zmbw==/",
      label: "Instagram",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@JobReferralClub",
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo.jpg"
                  alt="JobReferral.Club Logo"
                  className="w-14 h-14 object-contain"
                />
                <div className="font-bold text-2xl text-white">
                  JobReferral<span className="text-primary-green">.Club</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The referral-first community helping ambitious professionals
                land high-impact roles through real connections and trusted
                networks.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-4 h-4 text-primary-green" />
                  <span>India</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-4 h-4 text-primary-green" />
                  <span>support@jobreferral.club</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-green transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-gray-400 text-sm"
            >
              © 2024 JobReferral.Club. All rights reserved.
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-4">
                <a
                  href="#privacy"
                  className="text-gray-400 hover:text-primary-green text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="text-gray-400 hover:text-primary-green text-sm transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#cookies"
                  className="text-gray-400 hover:text-primary-green text-sm transition-colors"
                >
                  Cookie Policy
                </a>
              </div>

              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, href, label }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-primary-green hover:bg-primary-green/10 transition-all duration-300"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
