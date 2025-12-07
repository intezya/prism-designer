export enum ShapeType {
  Box = 'Box',
  Torus = 'Torus',
  Icosahedron = 'Icosahedron',
  Octahedron = 'Octahedron',
  Knot = 'Knot'
}

export enum MaterialType {
  Standard = 'Standard',
  Physical = 'Physical',
  Normal = 'Normal',
  Wireframe = 'Wireframe'
}

export interface SceneConfig {
  shape: ShapeType;
  color: string;
  metalness: number;
  roughness: number;
  rotationSpeed: number;
  scale: number;
  material: MaterialType;
  bgColor: string;
  lightColor: string;
  lightIntensity: number;
}

export interface AIThemeResponse {
  themeName: string;
  description: string;
  config: Partial<SceneConfig>;
}

export interface ThemePreset {
  name: string;
  config: SceneConfig;
}