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

export function searchUsersTool(server, elicitationHelper) {
  return server.tool(
    "search_users",
    "Search through user profiles using a simple text query",
    {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query to find users by name, email, or role"
        }
      }
    },
    async (inputs, context) => {
      try {
        let searchQuery = inputs.query;

        if (!searchQuery) {
          const elicitationResult = await elicitationHelper.elicitWithProgress(
            "Please enter your search query to find users",
            {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  title: "Search Query",
                  description: "Enter keywords to search for users by name, email, or role"
                }
              },
              required: ["query"]
            },
            inputs
          );

          if (elicitationResult.action === "accept" && elicitationResult.content?.query) {
            searchQuery = elicitationResult.content.query;
          } else if (elicitationResult.action === "decline") {
            return utils.createErrorResponse("User declined to provide search query. Search cancelled.");
          } else {
            return utils.createErrorResponse("User cancelled the search process.");
          }
        }

        const { storage } = await import('../storage.js');
        const query = searchQuery.toLowerCase();
        
        const matchingUsers = storage.users.filter(user => {
          return (
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query)
          );
        });

        if (matchingUsers.length === 0) {
          return utils.createSuccessResponse(`No users found matching query: "${searchQuery}"`);
        }

        return utils.createSuccessResponse(
          `Found ${matchingUsers.length} user(s) matching "${searchQuery}":\n${JSON.stringify(matchingUsers, null, 2)}`
        );
      } catch (error) {
        return utils.createErrorResponse(`Error searching users: ${error.message}`);
      }
    }
  );
}
