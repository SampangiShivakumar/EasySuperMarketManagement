/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginResponse
 * @property {boolean} success
 * @property {string} [token]
 * @property {Object} [user]
 * @property {string} user.id
 * @property {string} user.email
 * @property {string} user.name
 * @property {('admin'|'employee'|'manager')} user.role
 * @property {string} [error]
 */

/**
 * @typedef {Object} LoginContextType
 * @property {boolean} isAuthenticated
 * @property {LoginResponse['user']|null} user
 * @property {function(LoginCredentials): Promise<LoginResponse>} login
 * @property {function(): void} logout
 */

export {};