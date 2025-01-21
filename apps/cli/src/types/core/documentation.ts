export interface DocumentSection {
  title: string;
  key: string;
  required: boolean;
  description: string;
  subsections?: DocumentSection[];
}

export interface DocumentStructure {
  sections: DocumentSection[];
  metadata: {
    style: string;
    audience: string[];
    purpose: string;
    format: string;
  };
}

export interface GeneratedDocument {
  content: string;
  structure: DocumentStructure;
  metadata: {
    generatedAt: string;
    version: string;
    context: {
      projectType: string;
      technicalStack: string[];
    };
  };
}
