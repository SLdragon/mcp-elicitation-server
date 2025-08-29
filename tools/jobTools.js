import { JobService } from '../services/job.js';
import { SchemaBuilder } from '../schemas.js';
import { utils } from '../utils.js';

export function createJobTool(server, elicitationHelper) {
  return server.tool(
    "create_job_details",
    "Create a new job posting with elicitation support for missing fields",
    SchemaBuilder.getJobToolParams(),
    async (inputs, context) => {
      try {
        let jobData = { ...inputs };
        const missingFields = JobService.getMissingFields(jobData);

        if (missingFields.all.length > 0) {
          const { properties, required } = SchemaBuilder.buildJobSchema(missingFields.all);
          
          const elicitationResult = await elicitationHelper.elicitWithProgress(
            "Please provide job posting details",
            { 
              type: "object", 
              properties, 
              required: missingFields.required  // 只有必填字段是真正required的
            },
            inputs
          );

          if (elicitationResult.action === "accept" && elicitationResult.content) {
            Object.assign(jobData, elicitationResult.content);
          } else if (elicitationResult.action === "decline") {
            return utils.createErrorResponse("User declined to provide job information. No job posting was created.");
          } else {
            return utils.createErrorResponse("User cancelled the job creation process.");
          }
        }

        JobService.validateJob(jobData);
        const newJob = JobService.createJob(jobData);

        return utils.createSuccessResponse(
          `Successfully created job posting:\n${JSON.stringify(newJob, null, 2)}`
        );
      } catch (error) {
        return utils.createErrorResponse(`Error creating job posting: ${error.message}`);
      }
    }
  );
}

export function listJobsTool(server) {
  return server.tool(
    "list_jobs",
    "List all job postings currently stored in the system",
    {},
    async () => {
      try {
        const { storage } = await import('../storage.js');
        return utils.createSuccessResponse(
          `All job postings (${storage.jobs.length} total):\n${JSON.stringify(storage.jobs, null, 2)}`
        );
      } catch (error) {
        return utils.createErrorResponse(`Error listing jobs: ${error.message}`);
      }
    }
  );
}
