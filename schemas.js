import { CONFIG } from './config.js';

export class SchemaBuilder {
  static USER_FIELD_SCHEMAS = {
    name: {
      type: "string",
      title: "Full Name", 
      description: "Your full name",
      minLength: 2,
      maxLength: 100
    },
    email: {
      type: "string",
      title: "Email Address",
      description: "Your email address (e.g., john.doe@example.com)",
      minLength: 5,
      maxLength: 100
    },
    age: {
      type: "number",
      title: "Age",
      description: "Your age in years",
      minimum: 13,
      maximum: 120
    },
    role: {
      type: "string", 
      title: "Role",
      description: "Your role in the organization",
      enum: Object.keys(CONFIG.ROLES),
      enumNames: Object.values(CONFIG.ROLES)
    }
  };

  static JOB_FIELD_SCHEMAS = {
    jobTitle: {
      type: "string",
      title: "Job Title",
      description: "The job title or position name",
      minLength: 2,
      maxLength: 100
    },
    description: {
      type: "string",
      title: "Job Description", 
      description: "Detailed description of the job responsibilities",
      minLength: 10,
      maxLength: 1000
    },
    company_email: {
      type: "string",
      title: "Company Email",
      description: "Contact email for the company",
      format: "email"
    },
    company_website: {
      type: "string", 
      title: "Company Website",
      description: "Company website URL",
      format: "uri"
    },
    salary: {
      type: "number",
      title: "Salary",
      description: "Annual salary in USD",
      minimum: 0,
      maximum: 1000000
    },
    experience_years: {
      type: "integer",
      title: "Required Experience",
      description: "Minimum years of experience required (optional)",
      minimum: 0,
      maximum: 50,
      default: 3
    },
    is_remote: {
      type: "boolean", 
      title: "Remote Work",
      description: "Is this a remote position?",
      default: false
    },
    is_active: {
      type: "boolean",
      title: "Active Posting",
      description: "Is this job posting currently active?",
      default: true
    },
    start_date: {
      type: "string",
      title: "Start Date", 
      description: "Expected start date (YYYY-MM-DD)",
      format: "date"
    },
    application_deadline: {
      type: "string",
      title: "Application Deadline",
      description: "Application deadline date and time",
      format: "date-time"
    },
    job_type: {
      type: "string",
      title: "Job Type",
      description: "Type of employment",
      enum: Object.keys(CONFIG.JOB_TYPES),
      enumNames: Object.values(CONFIG.JOB_TYPES)
    },
    priority: {
      type: "string",
      title: "Priority Level",
      description: "Hiring priority for this position", 
      enum: Object.keys(CONFIG.PRIORITIES),
      enumNames: Object.values(CONFIG.PRIORITIES)
    }
  };

  static buildUserSchema(missingFields) {
    return this._buildSchema(this.USER_FIELD_SCHEMAS, missingFields);
  }

  static buildJobSchema(missingFields) {
    return this._buildSchema(this.JOB_FIELD_SCHEMAS, missingFields);
  }

  static _buildSchema(fieldSchemas, missingFields) {
    const properties = {};
    const required = [];
    
    missingFields.forEach(field => {
      if (fieldSchemas[field]) {
        properties[field] = fieldSchemas[field];
        required.push(field);
      }
    });

    return { properties, required };
  }

  static getUserToolParams() {
    const toolParams = {};
    for (const [key, schema] of Object.entries(this.USER_FIELD_SCHEMAS)) {
      toolParams[key] = {
        type: schema.type,
        description: schema.description,
        optional: true
      };
    }
    
    return toolParams;
  }

  static getJobToolParams() {
    const toolParams = {};
    for (const [key, schema] of Object.entries(this.JOB_FIELD_SCHEMAS)) {
      toolParams[key] = {
        type: schema.type,
        description: schema.description
      };
    }
    
    return toolParams;
  }
}
