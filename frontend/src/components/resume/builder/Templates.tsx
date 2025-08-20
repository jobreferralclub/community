import React from "react";
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Calendar,
    Building,
    Linkedin,
    Github,
} from "lucide-react";
import useResumeStore from "../../../store/useResumeStore";

export const Template1: React.FC = () => {
    const {
        personalInfo,
        experience,
        education,
        skills,
        projects,
    } = useResumeStore();

    return (
        <div className="flex justify-center items-start w-full h-[calc(100vh-100px)] overflow-auto p-4 bg-gray-100 aspect-[0.7072]">
            <div
                className="bg-white shadow-md border border-gray-300 rounded-lg p-6 text-[12px] space-y-5 aspect-[0.7072] w-full"
                id="resume-preview"
            >
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="font-bold text-gray-900 mb-1" style={{ fontSize: "24px" }}>
                        {personalInfo.fullName || "Your Name"}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3 text-gray-600 text-[11px]">
                        {personalInfo.email && (
                            <div className="flex items-center gap-1">
                                <Mail size={12} />
                                {personalInfo.email}
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-1">
                                <Phone size={12} />
                                {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo.address && (
                            <div className="flex items-center gap-1">
                                <MapPin size={12} />
                                {personalInfo.address}
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-1">
                                <Globe size={12} />
                                {personalInfo.website}
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-1">
                                <Linkedin size={12} />
                                {personalInfo.linkedin}
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-1">
                                <Github size={12} />
                                {personalInfo.github}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                {personalInfo.summary && (
                    <div>
                        <h2 className="text-[14px] font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-1">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 text-[12px] leading-tight text-justify">
                            {personalInfo.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <div>
                        <h2 className="text-[14px] font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                            Experience
                        </h2>
                        <div className="space-y-3">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-[13px] text-gray-900">
                                                {exp.position}
                                            </p>
                                            <div className="flex items-center gap-1 text-gray-600 text-[11px]">
                                                <Building size={10} />
                                                {exp.company}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                                            <Calendar size={10} />
                                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <p className="text-gray-700 mt-1 text-[11px] leading-tight">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <div>
                        <h2 className="text-[14px] font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                            Education
                        </h2>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-[13px]">
                                                {edu.degree} {edu.field && `in ${edu.field}`}
                                            </p>
                                            <p className="text-gray-600 text-[11px]">{edu.school}</p>
                                            {edu.gpa && (
                                                <p className="text-gray-500 text-[11px]">GPA: {edu.gpa}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                                            <Calendar size={10} />
                                            {edu.startDate} - {edu.endDate}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div>
                        <h2 className="text-[14px] font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                            Skills
                        </h2>
                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="flex justify-between items-center"
                                >
                                    <span className="text-gray-700">{skill.name}</span>
                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-[2px] rounded">
                                        {skill.level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                    <div>
                        <h2 className="text-[14px] font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                            Projects
                        </h2>
                        <div className="space-y-3">
                            {projects.map((project) => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="font-semibold text-gray-900 text-[13px]">
                                            {project.name}
                                        </p>
                                        {project.url && (
                                            <a
                                                href={project.url}
                                                className="text-blue-500 hover:underline text-[10px]"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-gray-700 text-[11px]">{project.description}</p>
                                    {project.technologies && (
                                        <p className="text-gray-500 text-[10px]">
                                            <strong>Technologies:</strong> {project.technologies}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Template2: React.FC = () => {
    const {
        personalInfo,
        experience,
        education,
        skills,
        projects,
    } = useResumeStore();

    return (
        <div className="flex justify-center items-start w-full h-[calc(100vh-100px)] overflow-auto p-4 bg-gray-200 aspect-[0.7072]">
            <div className="bg-white shadow-lg border-2 border-gray-300 rounded-xl p-8 text-[12px] aspect-[0.7072] w-full" id="resume-preview">
                {/* Header with different style */}
                <div className="border-l-4 border-blue-500 pl-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {personalInfo.fullName || "Your Name"}
                    </h1>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-gray-600">
                        {personalInfo.email && (
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-blue-500" />
                                {personalInfo.email}
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-blue-500" />
                                {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo.address && (
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-blue-500" />
                                {personalInfo.address}
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-2">
                                <Globe size={14} className="text-blue-500" />
                                {personalInfo.website}
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-2">
                                <Linkedin size={14} className="text-blue-500" />
                                {personalInfo.linkedin}
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-2">
                                <Github size={14} className="text-blue-500" />
                                {personalInfo.github}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary with different style */}
                {personalInfo.summary && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <h2 className="text-lg font-semibold text-blue-500 mb-2">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 text-[13px] leading-relaxed">
                            {personalInfo.summary}
                        </p>
                    </div>
                )}

                {/* Experience with different style */}
                {experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-blue-500 mb-3">
                            Professional Experience
                        </h2>
                        <div className="space-y-4">
                            {experience.map((exp) => (
                                <div key={exp.id} className="border-l-2 border-gray-200 pl-4 py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-[14px] text-gray-800">
                                                {exp.position}
                                            </p>
                                            <div className="flex items-center gap-2 text-[12px] text-gray-600">
                                                <Building size={12} className="text-blue-400" />
                                                {exp.company}
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 px-3 py-1 rounded-full text-[10px] text-blue-500">
                                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                        </div>
                                    </div>
                                    {exp.description && (
                                        <p className="text-gray-600 mt-2 text-[12px] leading-relaxed">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education with different style */}
                {education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-blue-500 mb-3">
                            Education
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-[14px] text-gray-800">
                                                {edu.degree} {edu.field && `in ${edu.field}`}
                                            </p>
                                            <p className="text-[12px] text-gray-600">{edu.school}</p>
                                            {edu.gpa && (
                                                <p className="text-[11px] text-blue-500">GPA: {edu.gpa}</p>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-gray-500">
                                            {edu.startDate} - {edu.endDate}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills with different style */}
                {skills.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-blue-500 mb-3">
                            Technical Skills
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="bg-blue-50 p-2 rounded-lg flex justify-between items-center"
                                >
                                    <span className="text-gray-700 font-medium">{skill.name}</span>
                                    <span className="text-[10px] text-blue-500 bg-white px-2 py-1 rounded-full">
                                        {skill.level}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects with different style */}
                {projects.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-blue-500 mb-3">
                            Projects
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {projects.map((project) => (
                                <div key={project.id} className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-bold text-[14px] text-gray-800">
                                            {project.name}
                                        </p>
                                        {project.url && (
                                            <a
                                                href={project.url}
                                                className="text-blue-500 hover:text-blue-600 text-[11px] bg-blue-50 px-3 py-1 rounded-full"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Project
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-[12px] mb-2">{project.description}</p>
                                    {project.technologies && (
                                        <div className="flex gap-2 flex-wrap">
                                            {project.technologies.split(',').map((tech, index) => (
                                                <span
                                                    key={index}
                                                    className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                                >
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Template3: React.FC = () => {
    const {
        personalInfo,
        experience,
        education,
        skills,
        projects,
    } = useResumeStore();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
            width: '100%',
            height: 'calc(100vh - 100px)',
            overflow: 'auto',
            padding: '1rem',
            backgroundColor: '#F1F5F9', // bg-slate-100
            aspectRatio: '0.7072',
        }}>
            <div style={{
                backgroundColor: '#FFFFFF', // bg-white
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '0',
                padding: '2rem', // p-8
                fontSize: '0.75rem', // text-[12px]
                aspectRatio: '0.7072',
                width: '100%',
            }} id="resume-preview">
                {/* Header - Minimalist style with dark theme */}
                <div style={{
                    backgroundColor: '#0F172A', // bg-slate-900
                    color: '#FFFFFF', // text-white
                    padding: '1.5rem', // p-6
                    marginLeft: '-2rem', // -mx-8
                    marginRight: '-2rem', // -mx-8
                    marginTop: '-2rem', // -mt-8
                    marginBottom: '1.5rem', // mb-6
                }}>
                    <h1 style={{
                        fontSize: '1.5rem', // text-2xl
                        fontWeight: '300', // font-light
                        marginBottom: '1rem', // mb-4
                        letterSpacing: '0.05em', // tracking-wider
                    }}>
                        {personalInfo.fullName || "Your Name"}
                    </h1>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem', // gap-4
                        fontSize: '0.6875rem', // text-[11px]
                        color: '#D1D5DB', // text-slate-300
                    }}>
                        {personalInfo.email && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={12} style={{ color: '#94A3B8' /* text-slate-400 */ }} />
                                {personalInfo.email}
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={12} style={{ color: '#94A3B8' }} />
                                {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo.address && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={12} style={{ color: '#94A3B8' }} />
                                {personalInfo.address}
                            </div>
                        )}
                        {personalInfo.website && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Globe size={12} style={{ color: '#94A3B8' }} />
                                {personalInfo.website}
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Linkedin size={12} style={{ color: '#94A3B8' }} />
                                {personalInfo.linkedin}
                            </div>
                        )}
                        {personalInfo.github && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Github size={12} style={{ color: '#94A3B8' }} />
                                {personalInfo.github}
                            </div>
                        )}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr', // grid-cols-3
                    gap: '1.5rem', // gap-6
                }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Skills Section */}
                        {skills.length > 0 && (
                            <div>
                                <h2 style={{
                                    fontSize: '0.875rem', // text-sm
                                    fontWeight: '600', // font-semibold
                                    color: '#0F172A', // text-slate-900
                                    marginBottom: '0.75rem', // mb-3
                                    textTransform: 'uppercase', // uppercase
                                    letterSpacing: '0.05em', // tracking-wider
                                }}>
                                    Skills
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {skills.map((skill) => (
                                        <div key={skill.id}>
                                            <div style={{
                                                fontSize: '0.6875rem', // text-[11px]
                                                color: '#334155', // text-slate-700
                                                fontWeight: '500', // font-medium
                                                marginBottom: '0.25rem', // mb-1
                                            }}>
                                                {skill.name}
                                            </div>
                                            <div style={{
                                                height: '0.375rem', // h-1.5
                                                backgroundColor: '#F1F5F9', // bg-slate-100
                                                borderRadius: '9999px', // rounded-full
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    backgroundColor: '#334155', // bg-slate-700
                                                    width: `${skill.level === 'Beginner' ? '33%' :
                                                        skill.level === 'Intermediate' ? '66%' : '100%'}`
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education Section */}
                        {education.length > 0 && (
                            <div>
                                <h2 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#0F172A',
                                    marginBottom: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>
                                    Education
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {education.map((edu) => (
                                        <div key={edu.id} style={{
                                            borderLeft: '2px solid #E2E8F0', // border-slate-200
                                            paddingLeft: '0.75rem',
                                        }}>
                                            <p style={{
                                                fontWeight: '500',
                                                fontSize: '0.75rem', // text-[12px]
                                                color: '#0F172A',
                                            }}>
                                                {edu.degree} {edu.field && `in ${edu.field}`}
                                            </p>
                                            <p style={{
                                                fontSize: '0.6875rem', // text-[11px]
                                                color: '#64748B', // text-slate-600
                                            }}>
                                                {edu.school}
                                            </p>
                                            <p style={{
                                                fontSize: '0.625rem', // text-[10px]
                                                color: '#6B7280', // text-slate-500
                                            }}>
                                                {edu.startDate} - {edu.endDate}
                                            </p>
                                            {edu.gpa && (
                                                <p style={{
                                                    fontSize: '0.625rem',
                                                    color: '#6B7280',
                                                }}>
                                                    GPA: {edu.gpa}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Summary */}
                        {personalInfo.summary && (
                            <div>
                                <h2 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#0F172A',
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>
                                    Professional Summary
                                </h2>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: '#64748B',
                                    lineHeight: 1.5,
                                }}>
                                    {personalInfo.summary}
                                </p>
                            </div>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && (
                            <div>
                                <h2 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#0F172A',
                                    marginBottom: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>
                                    Experience
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {experience.map((exp) => (
                                        <div key={exp.id} style={{
                                            position: 'relative',
                                            paddingLeft: '1rem',
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                left: '0',
                                                top: '0.375rem', // top-1.5
                                                width: '0.5rem', // w-2
                                                height: '0.5rem', // h-2
                                                backgroundColor: '#334155', // bg-slate-700
                                                borderRadius: '9999px',
                                            }} />
                                            {/* Content */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                            }}>
                                                <div>
                                                    <p style={{
                                                        fontWeight: '500',
                                                        fontSize: '0.8125rem', // text-[13px]
                                                        color: '#0F172A',
                                                    }}>
                                                        {exp.position}
                                                    </p>
                                                    <p style={{
                                                        fontSize: '0.6875rem',
                                                        color: '#64748B',
                                                    }}>
                                                        {exp.company}
                                                    </p>
                                                </div>
                                                <p style={{
                                                    fontSize: '0.625rem',
                                                    color: '#6B7280',
                                                }}>
                                                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                                </p>
                                            </div>
                                            {exp.description && (
                                                <p style={{
                                                    fontSize: '0.6875rem',
                                                    color: '#64748B',
                                                    marginTop: '0.25rem',
                                                    lineHeight: 1.5,
                                                }}>
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {projects.length > 0 && (
                            <div>
                                <h2 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    color: '#0F172A',
                                    marginBottom: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>
                                    Projects
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {projects.map((project) => (
                                        <div key={project.id} style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#F8FAFC', // bg-slate-50
                                        }}>
                                            {/* Header */}
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: '0.5rem',
                                            }}>
                                                <p style={{
                                                    fontWeight: '500',
                                                    fontSize: '0.8125rem', // text-[13px]
                                                    color: '#0F172A',
                                                }}>
                                                    {project.name}
                                                </p>
                                                {project.url && (
                                                    <a href={project.url} style={{
                                                        fontSize: '0.625rem', // text-[10px]
                                                        color: '#6B7280',
                                                        textDecoration: 'underline',
                                                    }} target="_blank" rel="noopener noreferrer">
                                                        View Project →
                                                    </a>
                                                )}
                                            </div>
                                            <p style={{
                                                fontSize: '0.6875rem', // text-[11px]
                                                color: '#64748B',
                                                marginBottom: '0.5rem',
                                            }}>
                                                {project.description}
                                            </p>
                                            {project.technologies && (
                                                <div style={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.25rem', // gap-1
                                                }}>
                                                    {project.technologies.split(',').map((tech, index) => (
                                                        <span key={index} style={{
                                                            fontSize: '0.625rem', // text-[10px]
                                                            backgroundColor: '#E2E8F0', // bg-slate-200
                                                            color: '#334155', // text-slate-700
                                                            padding: '0.25rem 0.5rem', // px-2 py-0.5
                                                            borderRadius: '9999px',
                                                        }}>
                                                            {tech.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Template4: React.FC = () => {
    const {
        personalInfo,
        experience,
        education,
        skills,
        projects,
    } = useResumeStore();

    return (
        <div className="flex justify-center items-start w-full h-[calc(100vh-100px)] overflow-auto p-4 bg-purple-50 aspect-[0.7072]">
            <div className="bg-white shadow-lg border-0 rounded-2xl p-8 text-[12px] aspect-[0.7072] w-full relative overflow-hidden" id="resume-preview">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full -ml-24 -mb-24" />

                {/* Header */}
                <div className="relative z-10 border-b-2 border-purple-200 pb-6 mb-6">
                    <h1 className="text-3xl font-bold text-purple-900 mb-2">
                        {personalInfo.fullName || "Your Name"}
                    </h1>
                    <div className="grid grid-cols-3 gap-3 text-[11px]">
                        {personalInfo.email && (
                            <div className="flex items-center gap-2 text-purple-700">
                                <Mail size={14} className="text-purple-400" />
                                {personalInfo.email}
                            </div>
                        )}
                        {personalInfo.phone && (
                            <div className="flex items-center gap-2 text-purple-700">
                                <Phone size={14} className="text-purple-400" />
                                {personalInfo.phone}
                            </div>
                        )}
                        {personalInfo.address && (
                            <div className="flex items-center gap-2 text-purple-700">
                                <MapPin size={14} className="text-purple-400" />
                                {personalInfo.address}
                            </div>
                        )}
                        {personalInfo.website && (
                            <div className="flex items-center gap-2 text-purple-700">
                                <Globe size={14} className="text-purple-400" />
                                {personalInfo.website}
                            </div>
                        )}
                        {personalInfo.linkedin && (
                            <div className="flex items-center gap-2 text-purple-700">
                                <Linkedin size={14} className="text-purple-400" />
                                {personalInfo.linkedin}
                            </div>
                        )}
                        {personalInfo.github && (
                            <div className="flex items-center gap-2 text-purple-700">
                                <Github size={14} className="text-purple-400" />
                                {personalInfo.github}
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative z-10 grid grid-cols-12 gap-6">
                    {/* Main Content */}
                    <div className="col-span-8 space-y-6">
                        {/* Summary */}
                        {personalInfo.summary && (
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold text-purple-900 mb-2">
                                    About Me
                                </h2>
                                <p className="text-purple-800 text-[12px] leading-relaxed">
                                    {personalInfo.summary}
                                </p>
                            </div>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-purple-900 mb-4">
                                    Work Experience
                                </h2>
                                <div className="space-y-4">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-purple-200 before:rounded-full before:border-2 before:border-purple-400">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <p className="font-semibold text-purple-900 text-[14px]">
                                                        {exp.position}
                                                    </p>
                                                    <p className="text-purple-600 text-[12px]">
                                                        {exp.company}
                                                    </p>
                                                </div>
                                                <div className="bg-purple-100 px-3 py-1 rounded-full text-[10px] text-purple-700">
                                                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                                </div>
                                            </div>
                                            {exp.description && (
                                                <p className="text-purple-700 text-[11px] leading-relaxed mt-2">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Projects */}
                        {projects.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-purple-900 mb-4">
                                    Featured Projects
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {projects.map((project) => (
                                        <div key={project.id} className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-semibold text-purple-900 text-[14px]">
                                                    {project.name}
                                                </p>
                                                {project.url && (
                                                    <a
                                                        href={project.url}
                                                        className="text-purple-500 hover:text-purple-700 text-[11px]"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Project ↗
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-purple-700 text-[11px] mb-2">
                                                {project.description}
                                            </p>
                                            {project.technologies && (
                                                <div className="flex gap-1 flex-wrap">
                                                    {project.technologies.split(',').map((tech, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                                                        >
                                                            {tech.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-4 space-y-6">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-purple-900 mb-3">
                                    Skills
                                </h2>
                                <div className="space-y-2">
                                    {skills.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className="bg-purple-50 p-2 rounded-lg"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-purple-900 font-medium text-[12px]">
                                                    {skill.name}
                                                </span>
                                                <span className="text-[10px] text-purple-600">
                                                    {skill.level}
                                                </span>
                                            </div>
                                            <div className="h-1 bg-purple-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-400"
                                                    style={{
                                                        width: `${skill.level === 'Beginner' ? '33%' :
                                                            skill.level === 'Intermediate' ? '66%' :
                                                                '100%'
                                                            }`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-purple-900 mb-3">
                                    Education
                                </h2>
                                <div className="space-y-3">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="bg-purple-50 p-3 rounded-lg">
                                            <p className="font-semibold text-purple-900 text-[13px] mb-1">
                                                {edu.degree} {edu.field && `in ${edu.field}`}
                                            </p>
                                            <p className="text-purple-700 text-[11px]">{edu.school}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-purple-600 text-[10px]">
                                                    {edu.startDate} - {edu.endDate}
                                                </span>
                                                {edu.gpa && (
                                                    <span className="text-purple-600 text-[10px]">
                                                        GPA: {edu.gpa}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Template5: React.FC = () => {
    const {
        personalInfo,
        experience,
        education,
        skills,
        projects,
    } = useResumeStore();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
            width: '100%',
            height: 'calc(100vh - 100px)',
            overflow: 'auto',
            padding: '16px',
            backgroundColor: '#ECFDF5',
            aspectRatio: '0.7072',
        }}>
            <div style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '24px',
                padding: '32px',
                fontSize: '12px',
                aspectRatio: '0.7072',
                width: '100%',
                position: 'relative',
                overflow: 'hidden'
            }} id="resume-preview">
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(to right, #059669, #14B8A6)',
                    color: '#FFFFFF',
                    margin: '-32px -32px 24px -32px',
                    padding: '32px',
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gap: '16px',
                    }}>
                        {/* Name and Summary */}
                        <div>
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '8px',
                            }}>
                                {personalInfo.fullName || "Your Name"}
                            </h1>
                            {personalInfo.summary && (
                                <p style={{
                                    color: '#E0F2E9',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                }}>
                                    {personalInfo.summary}
                                </p>
                            )}
                        </div>
                        {/* Contact Information */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}>
                            {personalInfo.email && (<ContactDetail icon="mail" content={personalInfo.email} />)}
                            {personalInfo.phone && (<ContactDetail icon="phone" content={personalInfo.phone} />)}
                            {personalInfo.address && (<ContactDetail icon="map" content={personalInfo.address} />)}
                            {personalInfo.website && (<ContactDetail icon="web" content={personalInfo.website} />)}
                            {personalInfo.linkedin && (<ContactDetail icon="linkedin" content={personalInfo.linkedin} />)}
                            {personalInfo.github && (<ContactDetail icon="github" content={personalInfo.github} />)}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '32px',
                }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Experience */}
                        {experience.length > 0 && (
                            <Section title="Professional Experience">
                                {experience.map((exp) => (
                                    <div key={exp.id} style={{
                                        position: 'relative',
                                        paddingLeft: '24px',
                                        borderLeft: '2px solid #D1FAE5',
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: '-8px',
                                            top: '8px',
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: '#34D399',
                                            borderRadius: '50%',
                                        }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <p style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '14px',
                                                    color: '#065F46',
                                                }}>{exp.position}</p>
                                                <p style={{
                                                    fontSize: '12px',
                                                    color: '#047857',
                                                }}>{exp.company}</p>
                                            </div>
                                            <p style={{
                                                fontSize: '11px',
                                                color: '#10B981',
                                                fontWeight: '500',
                                            }}>{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                                        </div>
                                        {exp.description && (
                                            <p style={{
                                                marginTop: '8px',
                                                fontSize: '11px',
                                                lineHeight: '1.5',
                                                color: '#065F46',
                                            }}>{exp.description}</p>
                                        )}
                                    </div>
                                ))}
                            </Section>
                        )}

                        {/* Projects */}
                        {projects.length > 0 && (
                            <Section title="Notable Projects">
                                {projects.map((project) => (
                                    <div key={project.id} style={{
                                        background: 'linear-gradient(to bottom, #ECFDF5, rgba(236, 253, 245, 0))',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #D1FAE5',
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}>
                                            <p style={{
                                                fontWeight: '600',
                                                fontSize: '13px',
                                                color: '#065F46',
                                            }}>{project.name}</p>
                                            {project.url && (
                                                <a href={project.url} style={{
                                                    fontSize: '11px',
                                                    color: '#10B981',
                                                    textDecoration: 'underline',
                                                }} target="_blank" rel="noopener noreferrer">View Project →</a>
                                            )}
                                        </div>
                                        <p style={{
                                            marginBottom: '8px',
                                            fontSize: '11px',
                                            color: '#065F46',
                                        }}>{project.description}</p>
                                        {project.technologies && (
                                            <div style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '8px',
                                            }}>
                                                {project.technologies.split(',').map((tech, index) => (
                                                    <span key={index} style={{
                                                        backgroundColor: '#D1FAE5',
                                                        color: '#065F46',
                                                        padding: '4px 8px',
                                                        fontSize: '10px',
                                                        borderRadius: '8px',
                                                    }}>{tech.trim()}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </Section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Skills */}
                        {skills.length > 0 && (
                            <Section title="Skills">
                                {skills.map((skill) => (
                                    <div key={skill.id}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '4px',
                                        }}>
                                            <p style={{
                                                fontWeight: '500',
                                                fontSize: '12px',
                                                color: '#065F46',
                                            }}>{skill.name}</p>
                                            <p style={{
                                                fontSize: '10px',
                                                color: '#10B981',
                                            }}>{skill.level}</p>
                                        </div>
                                        <div style={{
                                            height: '6px',
                                            backgroundColor: '#D1FAE5',
                                            borderRadius: '9999px',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                background: 'linear-gradient(to right, #34D399, #2DD4BF)',
                                                width: `${skill.level === 'Beginner' ? '33%' : skill.level === 'Intermediate' ? '66%' : '100%'}`,
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <Section title="Education">
                                {education.map((edu) => (
                                    <div key={edu.id} style={{
                                        padding: '12px',
                                        backgroundColor: '#ECFDF5',
                                        borderRadius: '8px',
                                    }}>
                                        <p style={{
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            color: '#065F46',
                                        }}>{edu.degree} {edu.field && `in ${edu.field}`}</p>
                                        <p style={{
                                            fontSize: '11px',
                                            color: '#047857',
                                        }}>{edu.school}</p>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: '4px',
                                            fontSize: '10px',
                                            color: '#10B981',
                                        }}>
                                            <span>{edu.startDate} - {edu.endDate}</span>
                                            {edu.gpa && (
                                                <span style={{
                                                    padding: '2px 8px',
                                                    backgroundColor: '#D1FAE5',
                                                    borderRadius: '9999px',
                                                    color: '#065F46',
                                                }}>GPA: {edu.gpa}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Reusable Section Component
 * */
const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#065F46',
            marginBottom: '8px',
        }}>{title}</h2>
        {children}
    </div>
);

/**
 * Contact Detail Helper
 * */
const ContactDetail: React.FC<{ icon: string, content: string }> = ({ icon, content }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#E0F2E9',
        fontSize: '11px',
    }}>
        {/* You can use a switch-case or icon component here */}
        {icon === "mail" && <Mail size={12} />}
        {icon === "phone" && <Phone size={12} />}
        {icon === "map" && <MapPin size={12} />}
        {icon === "web" && <Globe size={12} />}
        {icon === "linkedin" && <Linkedin size={12} />}
        {icon === "github" && <Github size={12} />}
        {content}
    </div>
);

// Add more templates as needed...

export const templates = {
    template1: Template1,
    template2: Template2,
    template3: Template3,
    template4: Template4,
    template5: Template5,
    // Add more templates here
} as const;

export type TemplateName = keyof typeof templates;