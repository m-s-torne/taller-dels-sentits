import type { ContactFormData, FormErrors, ArttherapyFormat, ParticipantAge, EducationStage, CourseGroup, ExternsSubtype, CentreSubtype, EntityType } from '@/app/contacte/types/form.types';
import {
  arttherapyFormatOptions,
  participantAgeOptions,
  educationStageOptions,
  courseGroupOptions,
  externsSubtypeOptions,
  centreSubtypeOptions,
  entityTypeOptions,
} from '@/app/contacte/lib';

interface ServiceSpecificFieldsProps {
  formData: ContactFormData;
  errors: FormErrors;
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
                onChange={(e) => updateField('arttherapyFormat', e.target.value as ArttherapyFormat)}
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
                onChange={(e) => updateField('participantAge', e.target.value as ParticipantAge)}
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

// Sub-componente: Formació per a alumnes (centre educatiu)
const AlumnesFields = ({ formData, updateField, errors }: ServiceSpecificFieldsProps) => {
  const getCourseOptions = () => {
    if (!formData.educationStage) {
      return [{ value: '', label: 'Selecciona primer una etapa educativa' }];
    }
    return courseGroupOptions[formData.educationStage];
  };

  const handleEducationStageChange = (value: string) => {
    updateField('educationStage', value as EducationStage);
    updateField('courseGroup', '');
  };

  return (
    <div className="space-y-4">
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
        <label className="block text-sm font-medium mb-2">Etapa educativa</label>
        <select
          value={formData.educationStage}
          onChange={(e) => handleEducationStageChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
        >
          {educationStageOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Curs</label>
        <select
          value={formData.courseGroup}
          onChange={(e) => updateField('courseGroup', e.target.value as CourseGroup)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
          disabled={!formData.educationStage}
        >
          {getCourseOptions().map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
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

      <div>
        <label htmlFor="courseInterest" className="block text-sm font-medium mb-2">
          Curs o monogràfic d'interès (opcional)
        </label>
        <input
          type="text"
          id="courseInterest"
          value={formData.courseInterest}
          onChange={(e) => updateField('courseInterest', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
          placeholder="Ex: Taller d'emocions, Art i literatura..."
        />
      </div>
    </div>
  );
};

// Sub-componente: Formació al professorat
const ProfessoratFields = ({ formData, updateField, errors }: ServiceSpecificFieldsProps) => (
  <div className="space-y-4">
    <div>
      <label htmlFor="schoolNameProf" className="block text-sm font-medium mb-1">
        Nom del centre <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="schoolNameProf"
        value={formData.schoolName}
        onChange={(e) => updateField('schoolName', e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${errors.schoolName ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Nom de l'escola o institut"
      />
      {errors.schoolName && <p className="mt-1 text-xs text-red-500">{errors.schoolName}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Etapa educativa</label>
      <select
        value={formData.educationStage}
        onChange={(e) => updateField('educationStage', e.target.value as EducationStage)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
      >
        {educationStageOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="teachersCount" className="block text-sm font-medium mb-2">
        Nombre de professors
      </label>
      <input
        type="number"
        id="teachersCount"
        min="1"
        value={formData.teachersCount}
        onChange={(e) => updateField('teachersCount', e.target.value ? Number(e.target.value) : '')}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
        placeholder="Ex: 10"
      />
    </div>

    <div>
      <label htmlFor="trainingInterest" className="block text-sm font-medium mb-2">
        Àrea o temàtica d'interès per a la formació (opcional)
      </label>
      <input
        type="text"
        id="trainingInterest"
        value={formData.trainingInterest}
        onChange={(e) => updateField('trainingInterest', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
        placeholder="Ex: Expressió emocional, gestalt artística..."
      />
    </div>
  </div>
);

// Sub-componente: Centre Educatiu (brancha sobre centreSubtype)
const CentreEducatiuFields = ({ formData, updateField, errors }: ServiceSpecificFieldsProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">Destinatari de la formació <span className="text-red-500">*</span></label>
      <select
        value={formData.centreSubtype}
        onChange={(e) => updateField('centreSubtype', e.target.value as CentreSubtype)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${errors.centreSubtype ? 'border-red-500' : 'border-gray-300'}`}
      >
        {centreSubtypeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {errors.centreSubtype && <p className="mt-1 text-xs text-red-500">{errors.centreSubtype}</p>}
    </div>

    {formData.centreSubtype === 'alumnes' && (
      <AlumnesFields formData={formData} updateField={updateField} errors={errors} />
    )}
    {formData.centreSubtype === 'professorat' && (
      <ProfessoratFields formData={formData} updateField={updateField} errors={errors} />
    )}
  </div>
);

// Sub-componente: Altres entitats
const AltresEntitatsFields = ({ formData, updateField, errors }: ServiceSpecificFieldsProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">
        Tipus d'entitat <span className="text-red-500">*</span>
      </label>
      <select
        value={formData.entityType}
        onChange={(e) => updateField('entityType', e.target.value as EntityType)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${errors.entityType ? 'border-red-500' : 'border-gray-300'}`}
      >
        {entityTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {errors.entityType && <p className="mt-1 text-xs text-red-500">{errors.entityType}</p>}
    </div>

    <div>
      <label htmlFor="entityName" className="block text-sm font-medium mb-1">
        Nom de l'entitat <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="entityName"
        value={formData.entityName}
        onChange={(e) => updateField('entityName', e.target.value)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${errors.entityName ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Nom de l'entitat o organisme"
      />
      {errors.entityName && <p className="mt-1 text-xs text-red-500">{errors.entityName}</p>}
    </div>

    {formData.entityType === 'altres' && (
      <div>
        <label htmlFor="entityDescription" className="block text-sm font-medium mb-1">
          Descripció de l'entitat
        </label>
        <input
          type="text"
          id="entityDescription"
          value={formData.entityDescription}
          onChange={(e) => updateField('entityDescription', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent"
          placeholder="Descriu breument l'entitat"
        />
      </div>
    )}

    <div>
      <label htmlFor="participantsCount" className="block text-sm font-medium mb-2">
        Nombre aproximat de participants <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        id="participantsCount"
        min="1"
        value={formData.participantsCount}
        onChange={(e) => updateField('participantsCount', e.target.value ? Number(e.target.value) : '')}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${errors.participantsCount ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Ex: 15"
      />
      {errors.participantsCount && <p className="mt-1 text-xs text-red-500">{errors.participantsCount}</p>}
    </div>

    <div>
      <label htmlFor="projectDescription" className="block text-sm font-medium mb-2">
        Descripció del projecte o necessitat (opcional)
      </label>
      <textarea
        id="projectDescription"
        value={formData.projectDescription}
        onChange={(e) => updateField('projectDescription', e.target.value)}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent resize-none"
        placeholder="Explica breument el projecte o la necessitat del col·lectiu..."
      />
    </div>
  </div>
);

// Sub-componente: Serveis Externs (brancha sobre externsSubtype)
const ServeisExternsFields = ({ formData, updateField, errors }: ServiceSpecificFieldsProps) => (
  <div className="space-y-4 border-t pt-6">
    <h3 className="text-xl font-semibold">Detalls del Servei Extern</h3>

    <div>
      <label className="block text-sm font-medium mb-2">Tipus de col·lectiu <span className="text-red-500">*</span></label>
      <select
        value={formData.externsSubtype}
        onChange={(e) => updateField('externsSubtype', e.target.value as ExternsSubtype)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-shakespeare focus:border-transparent ${errors.externsSubtype ? 'border-red-500' : 'border-gray-300'}`}
      >
        {externsSubtypeOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {errors.externsSubtype && <p className="mt-1 text-xs text-red-500">{errors.externsSubtype}</p>}
    </div>

    {formData.externsSubtype === 'centre-educatiu' && (
      <CentreEducatiuFields formData={formData} updateField={updateField} errors={errors} />
    )}
    {formData.externsSubtype === 'altres-entitats' && (
      <AltresEntitatsFields formData={formData} updateField={updateField} errors={errors} />
    )}
  </div>
);

// Componente principal exportado
export const ServiceSpecificFields = ({ formData, updateField, errors }: ServiceSpecificFieldsProps) => {
  switch (formData.serviceType) {
    case 'artterapia':
      return <ArtterapiaFields formData={formData} updateField={updateField} errors={errors} />;
    case 'artperdins':
      return <ArtperdinsFields formData={formData} updateField={updateField} errors={errors} />;
    case 'serveis-externs':
      return <ServeisExternsFields formData={formData} updateField={updateField} errors={errors} />;
    default:
      return null;
  }
};
