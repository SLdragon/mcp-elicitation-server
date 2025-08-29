// =============================================================================
// JOB SERVICE
// =============================================================================

import { storage } from '../storage.js';
import { utils } from '../utils.js';

export class JobService {
  static getMissingFields(inputs) {
    const requiredFields = ["jobTitle", "description", "job_type", "salary", "experience_years"];
    const optionalFields = [
      "company_email", "company_website", , 
      "is_remote", "is_active", "start_date", "application_deadline", "priority"
    ];

    const missingRequired = requiredFields.filter(field => 
      !inputs[field] && inputs[field] !== 0
    );
    const missingOptional = optionalFields.filter(field => 
      inputs[field] === undefined || inputs[field] === null || inputs[field] === ""
    );

    return {
      required: missingRequired,
      optional: missingOptional,
      all: [...missingRequired, ...missingOptional]
    };
  }

  static validateJob(job) {
    const errors = [];

    if (!job.jobTitle || !job.description || !job.job_type) {
      errors.push("Missing required fields. JobTitle, description, and job_type are required.");
    }

    if (job.company_email && !utils.validateEmail(job.company_email)) {
      errors.push("Invalid email format for company_email.");
    }

    if (job.company_website && !utils.validateUri(job.company_website)) {
      errors.push("Invalid URI format for company_website.");
    }

    if (job.start_date && !utils.validateDate(job.start_date)) {
      errors.push("Invalid date format for start_date. Please use YYYY-MM-DD format.");
    }

    if (job.application_deadline && !utils.validateDate(job.application_deadline)) {
      errors.push("Invalid date-time format for application_deadline.");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }
  }

  static createJob(jobData) {
    const newJob = {
      id: utils.getNextId(storage.jobs),
      title: jobData.jobTitle,
      description: jobData.description,
      company_email: jobData.company_email,
      company_website: jobData.company_website,
      salary: jobData.salary,
      experience_years: jobData.experience_years,
      is_remote: jobData.is_remote !== undefined ? jobData.is_remote : false,
      is_active: jobData.is_active !== undefined ? jobData.is_active : true,
      start_date: jobData.start_date,
      application_deadline: jobData.application_deadline,
      job_type: jobData.job_type,
      priority: jobData.priority,
      created_at: new Date().toISOString()
    };

    storage.jobs.push(newJob);
    return newJob;
  }
}
