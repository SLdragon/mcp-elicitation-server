# MCP User Profile Management Server

A demonstration Model Context Protocol (MCP) server showcasing elicitation capabilities.

## Project Overview

This project implements an MCP server with interactive elicitation capabilities, allowing clients to create and manage user profiles. When information is missing, the server uses MCP's elicitation feature to prompt users for required data.


## Available Tools

### `create_user_profile`
Creates a new user profile with interactive elicitation support for missing fields.

**Parameters (all optional):**
- `name` (string): User's full name
- `email` (string): User's email address  
- `age` (number): User's age
- `role` (string): User's role

**Validation Rules:**
- Name: 2-100 characters
- Email: 5-100 characters, must follow email format
- Age: Between 13-120 years
- Role: Select from predefined options (developer, designer, manager, analyst, tester)

### `list_users`
Lists all user profiles currently stored in the system.

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server

**Development Mode (with file watching):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

**Direct execution:**
```bash
node index.js
```

## VS Code Integration

The project comes pre-configured for VS Code MCP integration. Configuration file is located at `.vscode/mcp.json`:

```json
{
  "servers": {
    "elicitationDemo": {
      "type": "stdio",
      "command": "node",
      "args": ["index.js"],
      "cwd": "${workspaceFolder}",
      "dev": {
        "watch": "*.js",
        "debug": { "type": "node" }
      }
    }
  }
}
```

## Usage Examples

### Create Complete Profile
```javascript
create_user_profile({
  name: "John Doe",
  email: "john@example.com", 
  age: 28,
  role: "developer"
})
```

### Create Profile with Interactive Prompts
```javascript
// Provide partial information, system will prompt for missing data
create_user_profile({
  name: "Jane Smith"
  // Missing email, age, role - will trigger interactive elicitation
})
```

### List All Users
```javascript
list_users()
```
