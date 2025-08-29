export const utils = {
  getNextId: (array) => array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1,
  
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  
  validateUri: (uri) => {
    try {
      new URL(uri);
      return true;
    } catch {
      return false;
    }
  },
  
  validateDate: (dateStr) => !isNaN(new Date(dateStr).getTime()),
  
  createSuccessResponse: (message) => ({
    content: [{ type: "text", text: message }]
  }),
  
  createErrorResponse: (error) => ({
    content: [{ type: "text", text: `Error: ${error}` }]
  })
};
