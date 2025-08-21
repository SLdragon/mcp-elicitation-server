# MCP User Profile Management Server Showcasing Elicitation Capabilities

A demonstration Model Context Protocol (MCP) server showcasing elicitation capabilities.

## Demo


https://github.com/user-attachments/assets/ce89872b-a015-48a6-b56f-6be6fee44ff0

## Key Point

Ask response from user:

<img width="1262" height="900" alt="Image" src="https://github.com/user-attachments/assets/3040712d-3a52-40bc-ba20-ef71baa8e851" />


Collect info using command palette:

<img width="1198" height="462" alt="Image" src="https://github.com/user-attachments/assets/0ff4ccfe-29ce-4580-a623-cb52fc5d2332" />


Success:

<img width="1254" height="692" alt="Image" src="https://github.com/user-attachments/assets/f29c7c78-cce0-4927-9cb6-b42754e06d8a" />

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
