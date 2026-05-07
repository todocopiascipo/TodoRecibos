import ClassicTemplate from './ClassicTemplate';
import CommercialTemplate from './CommercialTemplate';
import MinimalTemplate from './MinimalTemplate';
import ModernTemplate from './ModernTemplate';

export const visualTemplates = [
  { id: 'classic', name: 'Clasica Profesional', description: 'Formal, clara y empresarial.', Component: ClassicTemplate },
  { id: 'modern', name: 'Moderna con Banda Superior', description: 'SaaS, contraste y presencia.', Component: ModernTemplate },
  { id: 'minimal', name: 'Minimalista Premium', description: 'Espacio blanco y tono elegante.', Component: MinimalTemplate },
  { id: 'commercial', name: 'Comercial Colorida', description: 'Energia visual para comercios.', Component: CommercialTemplate },
];

export function getVisualTemplate(type) {
  return visualTemplates.find((template) => template.id === type) || visualTemplates[0];
}
