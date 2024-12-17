import { ContentType } from '../content-types';

export type SemanticAnalysisType = 'none' | 'ai' | 'scrape';

export interface PromptData {
  title: string;
  topic: string;
  contentType: ContentType;
  semanticAnalysisType: SemanticAnalysisType;
  persona?: {
    profession: string;
    objectifs: string[];
    defis: string[];
    sujets_interet: string[];
  };
  site?: {
    name: string;
    url: string;
    siteType: string;
    targetAudience: string[];
  };
}
