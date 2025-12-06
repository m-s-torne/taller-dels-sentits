import type { ContactFormData } from '@/app/contacte/types';
import {
  arttherapyFormatOptions,
  preferredTimeOptions,
  participantAgeOptions,
  educationStageOptions,
  courseGroupOptions,
} from '@/app/contacte/lib';

interface ServiceSpecificFieldsProps {
  formData: ContactFormData;
  updateField: <K extends keyof ContactFormData>(
    field: K,
    value: ContactFormData[K]
  ) => void;
}

// Sub-componente: Campos de Artteràpia
const ArtterapiaFields = ({ formData, updateField }: ServiceSpecificFieldsProps) => {
  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-xl font-semibold">Detalls d'<em>Artteràpia</em></h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Format de sessió preferit
        </label>
        <div className="space-y-2">
          {arttherapyFormatOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="arttherapyFormat"
                value={option.value}
                checked={formData.arttherapyFormat === option.value}
                onChange={(e) => updateField('arttherapyFormat', e.target.value as any)}
                className="text-shakespeare focus:ring-shakespeare"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Horari preferit
        </label>
        <div className="space-y-2">
          {preferredTimeOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="preferredTime"
                value={option.value}
                checked={formData.preferredTime === option.value}
                onChange={(e) => updateField('preferredTime', e.target.value as any)}
                className="text-shakespeare focus:ring-shakespeare"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-componente: Campos de Artperdins
const ArtperdinsFields = ({ formData, updateField }: ServiceSpecificFieldsProps) => {
  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-xl font-semibold">Detalls d'<em>Artperdins</em></h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Edat del participant
        </label>
        <div className="space-y-2">
          {participantAgeOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="participantAge"
                value={option.value}
                checked={formData.participantAge === option.value}
                onChange={(e) => updateField('participantAge', e.target.value as any)}
                className="text-shakespeare focus:ring-shakespeare"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-componente: Campos de Centres Educatius
const EducationFields = ({ formData, updateField }: ServiceSpecificFieldsProps) => {
  // Obtener opciones de curso según la etapa educativa seleccionada
  const getCourseOptions = () => {
    if (!formData.educationStage) {
      return [{ value: '', label: 'Selecciona primer una etapa educativa' }];
    }
    return courseGroupOptions[formData.educationStage];
  };

  // Resetear courseGroup cuando cambia educationStage
  const handleEducationStageChange = (value: string) => {
    updateField('educationStage', value as any);
    updateField('courseGroup', ''); // Reset course selection
  };

  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-xl font-semibold">Detalls del Centre Educatiu</h3>
      
      <div>
        <label htmlFor="schoolName" className="block text-sm font-medium mb-1">
          Nom del centre
        </label>
        <input
          type="text"
          id="schoolName"
          value={formData.schoolName}
          onChange={(e) => updateField('schoolName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
          placeholder="Nom de l'escola o institut"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Etapa educativa
        </label>
        <select
          value={formData.educationStage}
          onChange={(e) => handleEducationStageChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
        >
          {educationStageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Curs
        </label>
        <select
          value={formData.courseGroup}
          onChange={(e) => updateField('courseGroup', e.target.value as any)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
          disabled={!formData.educationStage}
        >
          {getCourseOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="studentsCount" className="block text-sm font-medium mb-2">
          Nombre d'estudiants
        </label>
        <input
          type="number"
          id="studentsCount"
          min="1"
          value={formData.studentsCount}
          onChange={(e) => updateField('studentsCount', e.target.value ? Number(e.target.value) : '')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
          placeholder="Ex: 25"
        />
      </div>
    </div>
  );
};

// Componente principal exportado
export const ServiceSpecificFields = ({ formData, updateField }: ServiceSpecificFieldsProps) => {
  switch (formData.serviceType) {
    case 'artterapia':
      return <ArtterapiaFields formData={formData} updateField={updateField} />;
    case 'artperdins':
      return <ArtperdinsFields formData={formData} updateField={updateField} />;
    case 'centres-educatius':
      return <EducationFields formData={formData} updateField={updateField} />;
    default:
      return null;
  }
};
