import * as FiIcons from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";


const {
    FiUser,
    FiBell,
    FiShield,
    FiGlobe,
    FiKey,
    FiDatabase,
    FiBriefcase,
    FiUsers,
    FiFileText,
} = FiIcons;

export const tabs = [
    { id: "profile", name: "Profile", icon: FiUser },
    { id: "notifications", name: "Notifications", icon: FiBell },
    { id: "privacy", name: "Privacy & Security", icon: FiShield },
    { id: "integrations", name: "Integrations", icon: FiGlobe },
    { id: "api", name: "API Access", icon: FiKey },
    { id: "data", name: "Data & Export", icon: FiDatabase },
    { id: "companies", name: "Registered Companies", icon: FiBriefcase },
    { id: "users", name: "Users", icon: FiUsers },
    { id: "resume-from-linkedin", name: "Import Resume from LinkedIn", icon: FaLinkedin },
    { id: "resume", name: "Resume Inputs", icon: FiFileText },
];


export const adminOnly = [
    "Integrations",
    "API Access",
    "Data & Export",
    "Registered Companies",
    "Users",
    "Notifications",
    "Privacy & Security",
];