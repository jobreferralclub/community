import React, { useState } from 'react';
import useTemplateStore from '../../../store/useTemplateStore';
import { templates } from '../../../components/resume/builder/Templates';

const TemplateSelectionPopup: React.FC = () => {
    const setCurrentTemplate = useTemplateStore((state) => state.setCurrentTemplate);
    const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(true); // local visibility control

    const handleTemplateSelect = (template: string) => {
        setCurrentTemplate(template as keyof typeof templates);
        setIsOpen(false); // close popup
    };

    const handleBackgroundClick = () => setIsOpen(false);

    const templatePreviews = {
        template1: (
            <div style={{ padding: '10px', fontSize: '10px', fontFamily: 'sans-serif', color: '#111827' }}>
                <div style={{ height: '20%', backgroundColor: '#E5E7EB', marginBottom: '10px', padding: '5px' }}>
                    <strong>John Doe</strong><br />
                    Software Developer<br />
                    john@example.com
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <strong>Experience</strong>
                    <div>Frontend Developer - ABC Corp</div>
                    <div style={{ fontSize: '8px' }}>Built React apps for e-commerce clients.</div>
                </div>
                <div>
                    <strong>Skills</strong>
                    <div>React, TypeScript, Tailwind</div>
                </div>
            </div>
        ),
        template2: (
            <div style={{ padding: '10px', fontSize: '10px', fontFamily: 'sans-serif', color: '#111827' }}>
                <div style={{ borderLeft: '4px solid #3B82F6', paddingLeft: '10px', marginBottom: '10px' }}>
                    <strong>John Doe</strong><br />
                    Full Stack Engineer<br />
                    johndoe.dev
                </div>
                <div>
                    <strong>Experience</strong>
                    <div>Software Engineer - XYZ Ltd</div>
                    <div style={{ fontSize: '8px' }}>Worked on Node.js and GraphQL APIs.</div>
                </div>
            </div>
        ),
        template3: (
            <div style={{ padding: '10px', fontSize: '10px', fontFamily: 'sans-serif', color: '#111827' }}>
                <div style={{ height: '30%', backgroundColor: '#1F2937', color: '#fff', padding: '5px', marginBottom: '10px' }}>
                    <strong>John Doe</strong><br />
                    DevOps Specialist<br />
                    johndoe@cloudmail.com
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', height: '60%' }}>
                    <div style={{ backgroundColor: '#F3F4F6', padding: '5px' }}>
                        <strong>Skills</strong><br />
                        Docker, Kubernetes<br />
                        AWS, CI/CD
                    </div>
                    <div style={{ backgroundColor: '#E5E7EB', padding: '5px' }}>
                        <strong>Projects</strong><br />
                        Monitoring Dashboard<br />
                        <span style={{ fontSize: '8px' }}>Built with Grafana and Prometheus</span>
                    </div>
                </div>
            </div>
        ),
        template4: (
            <div style={{ padding: '10px', width: '100%', height: '100%', position: 'relative', fontSize: '10px', fontFamily: 'sans-serif', color: '#111827' }}>
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#EDE9FE'
                }}></div>
                <div style={{ height: '80%', backgroundColor: '#F3F4F6', padding: '5px', zIndex: 1, position: 'relative' }}>
                    <strong>John Doe</strong><br />
                    UX Designer<br />
                    www.johndoe.design<br /><br />
                    <strong>Experience</strong><br />
                    UI/UX Designer - Creative Inc<br />
                    <span style={{ fontSize: '8px' }}>Designed user flows and mobile interfaces.</span>
                </div>
            </div>
        ),
        template5: (
            <div style={{ padding: '10px', width: '100%', height: '100%', fontSize: '10px', fontFamily: 'sans-serif', color: '#111827' }}>
                <div style={{
                    height: '30%',
                    background: 'linear-gradient(to right, #059669, #14B8A6)',
                    color: '#fff',
                    padding: '5px',
                    marginBottom: '10px'
                }}>
                    <strong>John Doe</strong><br />
                    AI Engineer<br />
                    john.ai@example.com
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', height: '60%' }}>
                    <div style={{ backgroundColor: '#F3F4F6', padding: '5px', color: '#111827' }}>
                        <strong>Projects</strong><br />
                        Chatbot Framework<br />
                        <span style={{ fontSize: '8px' }}>Built using Python & LangChain</span>
                    </div>
                    <div style={{ backgroundColor: '#ECFDF5', padding: '5px', color: '#111827' }}>
                        <strong>Skills</strong><br />
                        Python, ML, NLP
                    </div>
                </div>
            </div>
        )
    };



    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
            onClick={handleBackgroundClick}
        >
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    width: '80%',
                    maxWidth: '800px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    padding: '16px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className='text-black text-2xl align-center text-center mb-2'>Select a Template</h1>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                    }}
                >
                    {Object.keys(templates).map((templateName, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredTemplate(templateName)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                            onClick={() => handleTemplateSelect(templateName)}
                            style={{
                                cursor: 'pointer',
                                border: hoveredTemplate === templateName ? '2px solid #3B82F6' : '1px solid #E5E7EB',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                transition: 'all 0.3s',
                                aspectRatio: '0.7072',
                                position: 'relative',
                            }}
                        >
                            <div style={{ height: '100%', backgroundColor: '#F9FAFB' }}>
                                {templatePreviews[templateName as keyof typeof templates]}
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '8px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderTop: '1px solid #E5E7EB',
                                    textAlign: 'center',
                                }}
                            >
                                <h3 style={{
                                    fontWeight: 600,
                                    color: hoveredTemplate === templateName ? '#3B82F6' : '#1F2937',
                                    fontSize: '14px',
                                }}>
                                    Template {index + 1}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplateSelectionPopup;
