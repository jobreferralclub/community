import React from "react";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";

const CertificatesSection = ({ certificates, onAdd, onEdit, onDelete }) => (
  <section className="bg-gray-900 rounded-xl p-6">
    <SectionHeader title="Certificates" onAdd={onAdd} />
    <div className="space-y-4">
      {certificates.map((cert) => (
        <div
          key={cert.id}
          className="group bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors relative"
        >
          <div className="absolute top-4 right-4">
            <ActionButtons
              onEdit={() => onEdit(cert)}
              onDelete={() => onDelete(cert.id)}
            />
          </div>
          <div className="pr-16">
            <h3 className="text-lime-400 font-semibold mb-1">{cert.name}</h3>
            <p className="text-gray-300 text-sm mb-1">{cert.issuer}</p>
            <p className="text-gray-400 text-sm">{cert.date}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default CertificatesSection;
