import * as FiIcons from "react-icons/fi";
const {
    FiUsers,
    FiBarChart3,
    FiMail,
    FiVideo,
    FiAward,
    FiDollarSign,
    FiCalendar,
    FiBook,
    FiSettings,
    FiChevronLeft,
} = FiIcons;

export const menuItems = [
    {
        name: "Community",
        icon: FiUsers,
        isSubmenu: true,
        children: [
            {
                name: "Community Hub",
                children: [
                    { name: "Introductions", path: "/community/introductions" },
                    // { name: "Ask the Community", path: "/community/ask-the-community" },
                    // { name: "Announcements", path: "/community/announcements" },
                    { name: "Club Guidelines", path: "/community/club-guidelines" },
                ],
            },
            {
                name: "India Jobs",
                region: "india",
                children: [
                    { name: "Fresher Jobs", path: "/community/in/freshers" },
                    { name: "Operations and Supply Chain Management", path: "/community/in/operations" },
                    { name: "Program and Project Management", path: "/community/in/program" },
                    { name: "Product Management", path: "/community/in/product" },
                    { name: "Marketing Management", path: "/community/in/marketing" },
                    { name: "Sales and Account Management", path: "/community/in/account" },
                    { name: "Category and Vendor Management", path: "/community/in/category" },
                    { name: "Finance", path: "/community/in/finance" },
                    { name: "Human Resources", path: "/community/in/hr" },
                    { name: "Analytics", path: "/community/in/analyst" },
                    { name: "Strategy and Consulting", path: "/community/in/strategy" },
                ],
            },
            {
                name: "United States Jobs",
                region: "us",
                children: [
                    { name: "Operations and Supply Chain Management", path: "/community/us/operations" },
                    { name: "Program and Project Management", path: "/community/us/program" },
                    { name: "Product Management", path: "/community/us/product" },
                    { name: "Marketing Management", path: "/community/us/marketing" },
                    { name: "Sales and Account Management", path: "/community/us/account" },
                    { name: "Category and Vendor Management", path: "/community/us/category" },
                    { name: "Finance", path: "/community/us/finance" },
                    { name: "Human Resources", path: "/community/us/hr" },
                    { name: "Analytics", path: "/community/us/analyst" },
                    { name: "Strategy and Consulting", path: "/community/us/strategy" },
                ],
            },
        ],
    },
    {
        name: "Free Tools",
        icon: FiIcons.FiTool,
        isSubmenu: true,
        children: [
            {
                name: "Job Seekers",
                children: [
                    { name: "Resume Builder", path: "/resume-builder" },
                    { name: "Resume Analyzer", path: "/resume-analyzer" },
                    { name: "Mock Interviewer", path: "/mock-interviewer" },
                ],
            },
            {
                name: "Recruiters",
                children: [
                    { name: "Resume Ranker", path: "/resume-ranker" },
                ],
            },
        ]
    },
    { name: "Analytics", icon: FiBarChart3, path: "/community/analytics" },
    { name: "Email Broadcast", icon: FiMail, path: "/community/email" },
    { name: "Events", icon: FiVideo, path: "/community/videos" },
    { name: "Gamification", icon: FiAward, path: "/community/gamification" },
    { name: "Monetization", icon: FiDollarSign, path: "/community/monetization" },
    { name: "Coaching", icon: FiCalendar, path: "/community/coaching" },
    { name: "Course Builder", icon: FiBook, path: "/community/courses" },
];

export const adminOnly = [
    "Dashboard",
    "Analytics",
    "Email Broadcast",
    "Monetization",
    "Coaching",
    "Course Builder",
    "Gamification",
    "Events"
];