export interface FungiSpecies {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: FungiSpecies;
}

export interface UploadData {
  file: File;
  speciesName?: string;
}