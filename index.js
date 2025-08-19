import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Simple user storage
const users = [
  { id: 1, name: "John Doe", email: "john@example.com", age: 30, role: "developer" },
];

// Available roles configuration
const AVAILABLE_ROLES = {
  developer: "Software Developer",
  designer: "UI/UX Designer", 
  manager: "Project Manager",
  analyst: "Business Analyst",
  tester: "QA Tester"
};

// Create an MCP server with elicitation support
const server = new McpServer({
  name: "elicitation-demo-server",
  version: "1.0.0",
  description: "A simple MCP server for user profile elicitation"
});

// Helper functions
function getNextUserId() {
  return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function buildElicitationSchema(missingFields) {
  const properties = {};
  const required = [];
  
  const schemas = {
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
      enum: Object.keys(AVAILABLE_ROLES),
      enumNames: Object.values(AVAILABLE_ROLES)
    }
  };

  missingFields.forEach(field => {
    if (schemas[field]) {
      properties[field] = schemas[field];
      required.push(field);
    }
  });

  return { properties, required };
}

// Create user profile with elicitation
server.tool(
  "create_user_profile",
  "Create a new user profile with elicitation support for missing fields",
  {
    name: { type: "string", description: "User's full name", optional: true },
    email: { type: "string", description: "User's email address", optional: true },
    age: { type: "number", description: "User's age", optional: true },
    role: { type: "string", description: "User's role", optional: true },
  },
  async (inputs) => {
    try {
      let { name, email, age, role } = inputs;
      
      // Determine missing fields
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email"); 
      if (age === undefined) missingFields.push("age");
      if (!role) missingFields.push("role");

      // Elicit missing information if needed
      if (missingFields.length > 0) {
        const { properties, required } = buildElicitationSchema(missingFields);
        
        const profileElicitation = await server.server.elicitInput({
          message: "Please provide your user profile information",
          requestedSchema: {
            type: "object",
            properties,
            required
          },
        });

        if (profileElicitation.action === "accept" && profileElicitation.content) {
          const content = profileElicitation.content;
          name = name || content.name;
          email = email || content.email;
          age = age !== undefined ? age : content.age;
          role = role || content.role;
        } else if (profileElicitation.action === "decline") {
          return {
            content: [{
              type: "text", 
              text: "User declined to provide profile information. No profile was created."
            }]
          };
        } else {
          return {
            content: [{
              type: "text", 
              text: "User cancelled the profile creation process."
            }]
          };
        }
      }

      // Validate email format
      if (email && !validateEmail(email)) {
        return {
          content: [{
            type: "text",
            text: "Error: Invalid email format. Please provide a valid email address."
          }]
        };
      }

      // Create the user profile
      const newUser = {
        id: getNextUserId(),
        name,
        email,
        age,
        role
      };

      users.push(newUser);

      return {
        content: [{
          type: "text",
          text: `Successfully created user profile:\n${JSON.stringify(newUser, null, 2)}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error creating user profile: ${error.message}`
        }]
      };
    }
  }
);

// List all user profiles
server.tool(
  "list_users",
  "List all user profiles currently stored in the system",
  {},
  async () => {
    try {
      return {
        content: [{
          type: "text",
          text: `All user profiles (${users.length} total):\n${JSON.stringify(users, null, 2)}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error listing users: ${error.message}`
        }]
      };
    }
  }
);

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Elicitation Server running on stdio");
  } catch (error) {
    console.error("Fatal error running server:", error);
    process.exit(1);
  }
}

main();
