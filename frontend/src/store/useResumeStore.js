import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

const useResumeStore = create((set) => ({
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
    location: "",
  },
  experience: [], // now aligned with workSchema
  education: [],
  skills: [],
  projects: [],

  // ================= PERSONAL INFO =================
  updatePersonalInfo: (field, value) =>
    set((state) => ({
      personalInfo: { ...state.personalInfo, [field]: value },
    })),

  // ================= EXPERIENCE =================
  addExperience: (exp = {}) =>
    set((state) => ({
      experience: [
        ...state.experience,
        {
          id: exp.id ?? uuidv4(), // keep client-side id for React rendering
          workType: exp.workType ?? "fullTime",
          designation: exp.designation ?? "",
          profile: exp.profile ?? "",
          organization: exp.organization ?? "",
          location: exp.location ?? "",
          isRemote: exp.isRemote ?? false,
          startDate: exp.startDate ?? "",
          endDate: exp.endDate ?? "",
          currentlyWorking: exp.currentlyWorking ?? false,
          description: exp.description ?? "",
        },
      ],
    })),

  updateExperience: (id, field, value) =>
    set((state) => ({
      experience: state.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    })),

  removeExperience: (id) =>
    set((state) => ({
      experience: state.experience.filter((exp) => exp.id !== id),
    })),

  // ================= EDUCATION =================
  addEducation: (edu = {}) =>
    set((state) => ({
      education: [
        ...state.education,
        {
          id: edu.id ?? uuidv4(),
          school: edu.school ?? "",
          degree: edu.degree ?? "",
          field: edu.field ?? "",
          startDate: edu.startDate ?? "",
          endDate: edu.endDate ?? "",
          gpa: edu.gpa ?? "",
        },
      ],
    })),
  updateEducation: (id, field, value) =>
    set((state) => ({
      education: state.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    })),
  removeEducation: (id) =>
    set((state) => ({
      education: state.education.filter((edu) => edu.id !== id),
    })),

  // ================= SKILLS =================
  addSkill: (skill = {}) =>
    set((state) => ({
      skills: [
        ...state.skills,
        {
          id: skill.id ?? uuidv4(),
          name: skill.name ?? "",
          level: skill.level ?? "Intermediate",
        },
      ],
    })),
  updateSkill: (id, field, value) =>
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    })),
  removeSkill: (id) =>
    set((state) => ({
      skills: state.skills.filter((skill) => skill.id !== id),
    })),

  // ================= PROJECTS =================
  addProject: (project = {}) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          id: project.id ?? uuidv4(),
          name: project.name ?? "",
          description: project.description ?? "",
          technologies: project.technologies ?? "",
          url: project.url ?? "",
        },
      ],
    })),
  updateProject: (id, field, value) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
}));

export default useResumeStore;
