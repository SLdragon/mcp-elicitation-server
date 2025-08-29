// =============================================================================
// USER SERVICE
// =============================================================================

import { storage } from '../storage.js';
import { utils } from '../utils.js';

export class UserService {
  static getMissingFields(inputs) {
    const { name, email, age, role } = inputs;
    const missing = [];
    
    if (!name) missing.push("name");
    if (!email) missing.push("email");
    if (age === undefined) missing.push("age");
    if (!role) missing.push("role");
    
    return missing;
  }

  static validateUser(user) {
    if (user.email && !utils.validateEmail(user.email)) {
      throw new Error("Invalid email format. Please provide a valid email address.");
    }
  }

  static createUser(userData) {
    const newUser = {
      id: utils.getNextId(storage.users),
      name: userData.name,
      email: userData.email,
      age: userData.age,
      role: userData.role
    };

    storage.users.push(newUser);
    return newUser;
  }
}
