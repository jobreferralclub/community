import React from "react";
import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";
import { ExternalLink } from "lucide-react";

const CertificatesSection = ({ certificates, onAdd, onEdit, onDelete }) => (
  <section className="bg-gray-900 rounded-xl p-6">
    <SectionHeader title="Certificates" onAdd={onAdd} />
    <div className="space-y-4">
      {certificates.map((cert) => (
        <div
          key={cert.id}
          className="group bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors relative"
        >
          {/* Delete/Edit buttons */}
          <div className="absolute top-4 right-4">
            <ActionButtons
              onEdit={() => onEdit(cert)}
              onDelete={() => onDelete(cert.id)}
            />
          </div>

          <div className="pr-16 space-y-1">
            {/* Certificate Name */}
            <h3 className="text-lime-400 font-semibold">{cert.name}</h3>

            {/* Issuer */}
            <p className="text-gray-300 text-sm">{cert.issuer}</p>

            {/* Date */}
            {cert.date && <p className="text-gray-400 text-sm">{cert.date}</p>}

            {/* Credential URL (optional) */}
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-400 hover:underline mt-1"
              >
                <ExternalLink size={14} className="mr-1" />
                View Credential
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default CertificatesSection;
