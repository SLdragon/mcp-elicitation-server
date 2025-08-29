import { UserService } from '../services/user.js';
import { SchemaBuilder } from '../schemas.js';
import { utils } from '../utils.js';

export function createUserTool(server, elicitationHelper) {
  return server.tool(
    "create_user_profile",
    "Create a new user profile with elicitation support for missing fields",
    SchemaBuilder.getUserToolParams(),
    async (inputs, context) => {
      try {
        let userData = { ...inputs };
        const missingFields = UserService.getMissingFields(userData);

        if (missingFields.length > 0) {
          const { properties, required } = SchemaBuilder.buildUserSchema(missingFields);
          
          const elicitationResult = await elicitationHelper.elicitWithProgress(
            "Please provide your user profile information",
            { type: "object", properties, required },
            inputs,
          );

          if (elicitationResult.action === "accept" && elicitationResult.content) {
            Object.assign(userData, elicitationResult.content);
          } else if (elicitationResult.action === "decline") {
            return utils.createErrorResponse("User declined to provide profile information. No profile was created.");
          } else {
            return utils.createErrorResponse("User cancelled the profile creation process.");
          }
        }

        UserService.validateUser(userData);
        const newUser = UserService.createUser(userData);

        return utils.createSuccessResponse(
          `Successfully created user profile:\n${JSON.stringify(newUser, null, 2)}`
        );
      } catch (error) {
        return utils.createErrorResponse(`Error creating user profile: ${error.message}`);
      }
    }
  );
}

export function listUsersTool(server) {
  return server.tool(
    "list_users",
    "List all user profiles currently stored in the system",
    {},
    async () => {
      try {
        const { storage } = await import('../storage.js');
        return utils.createSuccessResponse(
          `All user profiles (${storage.users.length} total):\n${JSON.stringify(storage.users, null, 2)}`
        );
      } catch (error) {
        return utils.createErrorResponse(`Error listing users: ${error.message}`);
      }
    }
  );
}
