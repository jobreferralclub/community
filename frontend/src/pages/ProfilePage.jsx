import React, { useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import EducationSection from "../components/profile/sections/EducationSection";
import WorkExperienceSection from "../components/profile/sections/WorkExperienceSection";
import ProjectsSection from "../components/profile/sections/ProjectsSection";
import SkillsSection from "../components/profile/sections/SkillsSection";
import CertificatesSection from "../components/profile/sections/CertificatesSection";
import Modal from "../components/profile/Modal";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import Navigation from "../components/landing/Navigation";
import Footer from "../components/landing/Footer";

const ProfilePage = () => {
    const { user, setUser } = useAuthStore();

    const apiUrl = import.meta.env.VITE_API_PORT;

    // ===== Profile Data from user =====
    const profile = {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        location: user?.location || "",
        company: user?.company || "",
        job_title: user?.job_title || "",
        avatar: user?.avatar || "",
        badges: user?.badges || [],
        tier: user?.tier || "",
        points: user?.points || 0,
        createdAt: user?.createdAt || "",
    };

    // ===== State for Sections =====
    const [education, setEducation] = useState(user?.education || []);
    const [workExperience, setWorkExperience] = useState(user?.work || []);
    const [projects, setProjects] = useState(user?.projects || []);
    const [skills, setSkills] = useState(user?.skills || []);
    const [certificates, setCertificates] = useState(user?.certificates || []);

    // ===== Modal State =====
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const openModal = (type, item = null) => {
        setModalType(type);
        setEditingItem(item);
        setFormData(item || {});
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
    };

    // ===== Save Handler with API Integration =====
    const handleSave = async () => {
        let updatedData;

        switch (modalType) {
            case "education":
                updatedData = editingItem
                    ? education.map((e) => (e.id === editingItem.id ? formData : e))
                    : [...education, { ...formData, id: Date.now() }];
                setEducation(updatedData);

                try {
                    setLoading(true);
                    const res = await axios.put(
                        `${apiUrl}/api/users/${user._id}`,
                        { education: updatedData }
                    );
                    setUser(res.data);
                } catch (err) {
                    console.error("Error updating education:", err);
                } finally {
                    setLoading(false);
                }
                break;

            case "work":
                updatedData = editingItem
                    ? workExperience.map((w) => (w.id === editingItem.id ? formData : w))
                    : [...workExperience, { ...formData, id: Date.now() }];
                setWorkExperience(updatedData);

                try {
                    setLoading(true);
                    const res = await axios.put(
                        `${apiUrl}/api/users/${user._id}`,
                        { work: updatedData }
                    );
                    setUser(res.data);
                } catch (err) {
                    console.error("Error updating work experience:", err);
                } finally {
                    setLoading(false);
                }
                break;

            case "project":
                updatedData = editingItem
                    ? projects.map((p) => (p.id === editingItem.id ? formData : p))
                    : [...projects, { ...formData, id: Date.now() }];
                setProjects(updatedData);

                try {
                    setLoading(true);
                    const res = await axios.put(
                        `${apiUrl}/api/users/${user._id}`,
                        { projects: updatedData }
                    );
                    setUser(res.data);
                } catch (err) {
                    console.error("Error updating projects:", err);
                } finally {
                    setLoading(false);
                }
                break;

            case "skill":
                updatedData = editingItem
                    ? skills.map((s) => (s.id === editingItem.id ? formData : s))
                    : [...skills, { ...formData, id: Date.now() }];
                setSkills(updatedData);

                try {
                    setLoading(true);
                    const res = await axios.put(
                        `${apiUrl}/api/users/${user._id}`,
                        { skills: updatedData }
                    );
                    setUser(res.data);
                } catch (err) {
                    console.error("Error updating skills:", err);
                } finally {
                    setLoading(false);
                }
                break;

            case "certificate":
                updatedData = editingItem
                    ? certificates.map((c) => (c.id === editingItem.id ? formData : c))
                    : [...certificates, { ...formData, id: Date.now() }];
                setCertificates(updatedData);

                try {
                    setLoading(true);
                    const res = await axios.put(
                        `${apiUrl}/api/users/${user._id}`,
                        { certificates: updatedData } // ✅ update certificates via API
                    );
                    setUser(res.data); // sync global user state
                } catch (err) {
                    console.error("Error updating certificates:", err);
                } finally {
                    setLoading(false);
                }
                break;

            default:
                break;
        }

        closeModal();
    };

    // ===== Render Form (unchanged) =====
    const renderForm = () => {
        switch (modalType) {
            case "education":
                return (
                    <div className="space-y-4">
                        {/* Education Level */}
                        <select
                            value={formData.level || ""}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        >
                            <option value="">Select Education Level</option>
                            <option value="secondary">Secondary (X)</option>
                            <option value="seniorSecondary">Senior Secondary / Equivalent (XII)</option>
                            <option value="graduation">Graduation / Post Graduation</option>
                            <option value="diploma">Diploma</option>
                            <option value="phd">PhD</option>
                        </select>

                        {/* Common Fields (for all levels) */}
                        <input
                            type="text"
                            placeholder="Institution / School / College"
                            value={formData.institution || ""}
                            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />

                        {/* Year Fields */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Start Year"
                                value={formData.startYear || ""}
                                onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                                className="w-1/2 p-2 rounded bg-gray-800 text-white"
                            />
                            <input
                                type="text"
                                placeholder="End Year"
                                value={formData.endYear || ""}
                                onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                                className="w-1/2 p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        {/* Conditional Fields */}
                        {formData.level === "secondary" && (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Board (e.g. CBSE, ICSE, State Board)"
                                    value={formData.board || ""}
                                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-800 text-white"
                                />
                            </div>
                        )}

                        {formData.level === "seniorSecondary" && (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Board (e.g. CBSE, ICSE, State Board)"
                                    value={formData.board || ""}
                                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-800 text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Stream (e.g. Science, Commerce, Arts)"
                                    value={formData.stream || ""}
                                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                                    className="w-full p-2 rounded bg-gray-800 text-white"
                                />
                            </div>
                        )}

                        {(formData.level === "graduation" ||
                            formData.level === "diploma" ||
                            formData.level === "phd") && (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Degree (e.g. B.Sc (Hons.), MBA, Diploma in IT, PhD in Physics)"
                                        value={formData.degree || ""}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Specialization / Stream"
                                        value={formData.stream || ""}
                                        onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                    />
                                </div>
                            )}

                        {/* Performance Score (common for all levels) */}
                        <div className="flex gap-3">
                            <select
                                value={formData.scoreType || "Percentage"}
                                onChange={(e) => setFormData({ ...formData, scoreType: e.target.value })}
                                className="w-1/3 p-2 rounded bg-gray-800 text-white"
                            >
                                <option value="Percentage">Percentage</option>
                                <option value="CGPA">CGPA</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Score (e.g. 85 / 9.2)"
                                value={formData.performance || ""}
                                onChange={(e) => setFormData({ ...formData, performance: e.target.value })}
                                className="w-2/3 p-2 rounded bg-gray-800 text-white"
                            />
                        </div>
                    </div>
                );

            case "work":
                return (
                    <div className="space-y-3">
                        {/* Work Type */}
                        <select
                            value={formData.workType || ""}
                            onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        >
                            <option value="">Select Work Type</option>
                            <option value="fullTime">Full-time</option>
                            <option value="partTime">Part-time</option>
                            <option value="internship">Internship</option>
                            <option value="volunteering">Volunteering</option>
                        </select>

                        {/* Designation */}
                        <input
                            type="text"
                            placeholder="Designation (e.g. Software Engineer)"
                            value={formData.designation || ""}
                            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />

                        {/* Profile (only for full-time) */}
                        {formData.workType === "fullTime" && (
                            <input
                                type="text"
                                placeholder="Profile (e.g. Operations)"
                                value={formData.profile || ""}
                                onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        )}

                        {/* Organization */}
                        <input
                            type="text"
                            placeholder="Organization (e.g. Internshala)"
                            value={formData.organization || ""}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />

                        {/* Location */}
                        <input
                            type="text"
                            placeholder="Location (e.g. Mumbai)"
                            value={formData.isRemote ? "Remote" : formData.location || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value,
                                    isRemote: false, // if user types manually, disable auto Remote
                                })
                            }
                            className="w-full p-2 rounded bg-gray-800 text-white"
                            disabled={formData.isRemote} // lock location if WFH
                        />

                        {/* Remote Work Checkbox */}
                        <label className="flex items-center gap-2 text-gray-300">
                            <input
                                type="checkbox"
                                checked={formData.isRemote || false}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        isRemote: e.target.checked,
                                        location: e.target.checked ? "Remote" : "",
                                    })
                                }
                            />
                            Is work from home
                        </label>

                        {/* Dates */}
                        <div className="flex gap-3">
                            <input
                                type="date"
                                value={formData.startDate || ""}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-1/2 p-2 rounded bg-gray-800 text-white"
                            />
                            <input
                                type="date"
                                value={formData.endDate || ""}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                disabled={formData.currentlyWorking}
                                className="w-1/2 p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        {/* Currently Working Checkbox */}
                        <label className="flex items-center gap-2 text-gray-300">
                            <input
                                type="checkbox"
                                checked={formData.currentlyWorking || false}
                                onChange={(e) => setFormData({ ...formData, currentlyWorking: e.target.checked })}
                            />
                            Currently working here
                        </label>

                        {/* Description */}
                        <textarea
                            placeholder="Description (e.g. responsibilities, achievements, skills used)"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                            rows={4}
                        />
                    </div>
                );

            case "project":
                return (
                    <div className="space-y-3">
                        {/* Project Title */}
                        <input
                            type="text"
                            placeholder="Project Title"
                            value={formData.title || ""}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />

                        {/* Start & End Month */}
                        <div className="flex gap-3">
                            <input
                                type="month"
                                value={formData.startMonth || ""}
                                onChange={(e) => setFormData({ ...formData, startMonth: e.target.value })}
                                className="w-1/2 p-2 rounded bg-gray-800 text-white"
                            />
                            <input
                                type="month"
                                value={formData.endMonth || ""}
                                onChange={(e) => setFormData({ ...formData, endMonth: e.target.value })}
                                disabled={formData.currentlyOngoing}
                                className="w-1/2 p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        {/* Currently Ongoing */}
                        <label className="flex items-center gap-2 text-gray-300">
                            <input
                                type="checkbox"
                                checked={formData.currentlyOngoing || false}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        currentlyOngoing: e.target.checked,
                                        endMonth: e.target.checked ? "" : formData.endMonth,
                                    })
                                }
                            />
                            Currently ongoing
                        </label>

                        {/* Description (optional) */}
                        <textarea
                            placeholder="Description (optional)"
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                            rows={3}
                        />

                        {/* Project Link (optional) */}
                        <input
                            type="url"
                            placeholder="Project Link (optional)"
                            value={formData.projectLink || ""}
                            onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                    </div>
                );

            case "skill":
                return (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Skill"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                    </div>
                );

            case "certificate":
                return (
                    <div className="space-y-3">
                        {/* Certificate Name */}
                        <input
                            type="text"
                            placeholder="Certificate Name"
                            value={formData.name || ""}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />

                        {/* Issuer */}
                        <input
                            type="text"
                            placeholder="Issuer"
                            value={formData.issuer || ""}
                            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />

                        {/* Month & Year */}
                        <input
                            type="month"
                            placeholder="Month & Year"
                            value={formData.date || ""}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />

                        {/* Credential URL (optional) */}
                        <input
                            type="url"
                            placeholder="Credential URL (optional)"
                            value={formData.credentialUrl || ""}
                            onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                            className="w-full p-2 rounded bg-gray-800 text-white"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

return (
        <>
            <Navigation />
            <div className="min-h-screen bg-black text-white">
                <ProfileHeader profile={profile} />

                <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                    <EducationSection
                        education={education}
                        onAdd={() => openModal("education")}
                        onEdit={(item) => openModal("education", item)}
                        onDelete={async (id) => {
                            const updated = education.filter((e) => e.id !== id);
                            setEducation(updated);
                            try {
                                await axios.put(
                                    `${apiUrl}/api/users/${user._id}`,
                                    { education: updated }
                                );
                                setUser({ ...user, education: updated });
                            } catch (err) {
                                console.error("Error deleting education:", err);
                            }
                        }}
                    />

                    <WorkExperienceSection
                        workExperience={workExperience}
                        onAdd={() => openModal("work")}
                        onEdit={(item) => openModal("work", item)}
                        onDelete={(id) => setWorkExperience(workExperience.filter((w) => w.id !== id))}
                    />

                    <ProjectsSection
                        projects={projects}
                        onAdd={() => openModal("project")}
                        onEdit={(item) => openModal("project", item)}
                        onDelete={(id) => setProjects(projects.filter((p) => p.id !== id))}
                    />

                    <SkillsSection
                        skills={skills}
                        onAdd={() => openModal("skill")}
                        onEdit={(item) => openModal("skill", item)}
                        onDelete={(id) => setSkills(skills.filter((s) => s.id !== id))}
                    />

                    <CertificatesSection
                        certificates={certificates}
                        onAdd={() => openModal("certificate")}
                        onEdit={(item) => openModal("certificate", item)}
                        onDelete={(id) => setCertificates(certificates.filter((c) => c.id !== id))}
                    />
                </div>

                <Modal
                    show={showModal}
                    title={loading ? "Saving..." : "Add / Edit Item"}
                    onSave={handleSave}
                    onClose={closeModal}
                >
                    {renderForm()}
                </Modal>
            </div>

            <Footer />
        </>
    );
};

export default ProfilePage;
