import { Profile, FormField } from '../types/profile';

export class AutoFillEngine {
  private static fieldMappings: Record<string, (profile: Profile) => string> = {
    // Name variations
    'name': (p) => p.name,
    'full name': (p) => p.name,
    'fullname': (p) => p.name,
    'first name': (p) => p.name.split(' ')[0] || '',
    'last name': (p) => p.name.split(' ').slice(1).join(' ') || '',
    'firstname': (p) => p.name.split(' ')[0] || '',
    'lastname': (p) => p.name.split(' ').slice(1).join(' ') || '',
    
    // Contact information
    'email': (p) => p.email,
    'email address': (p) => p.email,
    'phone': (p) => p.phone,
    'phone number': (p) => p.phone,
    'mobile': (p) => p.phone,
    'contact': (p) => p.phone,
    
    // Social profiles
    'github': (p) => p.github,
    'github profile': (p) => p.github,
    'github url': (p) => p.github,
    'linkedin': (p) => p.linkedin,
    'linkedin profile': (p) => p.linkedin,
    'linkedin url': (p) => p.linkedin,
    
    // Education
    'college': (p) => p.college,
    'university': (p) => p.college,
    'school': (p) => p.college,
    'institution': (p) => p.college,
    'degree': (p) => p.degree,
    'qualification': (p) => p.degree,
    'branch': (p) => p.branch,
    'major': (p) => p.branch,
    'specialization': (p) => p.branch,
    'field of study': (p) => p.branch,
    'year': (p) => p.year,
    'graduation year': (p) => p.year,
    'passing year': (p) => p.year,
    
    // Experience
    'experience': (p) => p.workExperience.map(w => `${w.position} at ${w.company}`).join(', '),
    'work experience': (p) => p.workExperience.map(w => `${w.position} at ${w.company}`).join(', '),
    'previous company': (p) => p.workExperience[0]?.company || '',
    'current position': (p) => p.workExperience[0]?.position || '',
    
    // Projects & Achievements
    'projects': (p) => p.projects.map(proj => proj.title).join(', '),
    'achievements': (p) => p.achievements.join(', '),
    'skills': (p) => p.projects.map(proj => proj.techStack).join(', '),
    'technologies': (p) => p.projects.map(proj => proj.techStack).join(', '),
  };

  static parseFormFields(formText: string): string[] {
    // Extract field labels from form text
    const fieldPatterns = [
      /(\w+(?:\s+\w+)*)\s*[:*]/g, // Label followed by : or *
      /label\s*=\s*["']([^"']+)["']/gi, // HTML label attributes
      /placeholder\s*=\s*["']([^"']+)["']/gi, // HTML placeholder attributes
      /<label[^>]*>([^<]+)<\/label>/gi, // HTML label tags
    ];

    const fields = new Set<string>();
    
    fieldPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(formText)) !== null) {
        const field = match[1].trim().toLowerCase();
        if (field.length > 2 && field.length < 50) {
          fields.add(field);
        }
      }
    });

    return Array.from(fields);
  }

  static matchFields(profile: Profile, formFields: string[]): FormField[] {
    return formFields.map(field => {
      const normalizedField = field.toLowerCase().trim();
      let matchedValue = '';
      let matched = false;

      // Direct mapping
      if (this.fieldMappings[normalizedField]) {
        matchedValue = this.fieldMappings[normalizedField](profile);
        matched = !!matchedValue;
      } else {
        // Fuzzy matching using keywords
        for (const [key, mapper] of Object.entries(this.fieldMappings)) {
          if (normalizedField.includes(key) || key.includes(normalizedField)) {
            matchedValue = mapper(profile);
            if (matchedValue) {
              matched = true;
              break;
            }
          }
        }
      }

      return {
        label: field,
        value: matchedValue,
        matched
      };
    });
  }

  static generateJSON(matchedFields: FormField[]): string {
    const result: Record<string, string> = {};
    matchedFields.forEach(field => {
      if (field.matched && field.value) {
        result[field.label] = field.value;
      }
    });
    return JSON.stringify(result, null, 2);
  }

  static generateCSV(matchedFields: FormField[]): string {
    const headers = ['Field', 'Value', 'Status'];
    const rows = matchedFields.map(field => [
      field.label,
      field.value || 'Not Found',
      field.matched ? 'Matched' : 'No Match'
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }
}