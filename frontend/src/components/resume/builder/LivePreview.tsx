// LivePreview.tsx
import React, { useState, useEffect } from "react";
import useTemplateStore from "../../../store/useTemplateStore";
import { templates } from "../../../components/resume/builder/Templates";

const LivePreview: React.FC = () => {
  const currentTemplate = useTemplateStore((state) => state.currentTemplate);
  const Template = templates[currentTemplate];

  return (
    <div style={{ fontSize: "0.75rem" }}>
      {Template && <Template />}
    </div>
  );
};

export default LivePreview;
