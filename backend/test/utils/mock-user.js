"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUser = void 0;
const mockUser = (fields) => (Object.assign({ firstName: 'Ahmet', middleName: null, lastName: 'Uysal', username: 'ahmet', image: null, birthDate: new Date('1998-09-21'), registrationDate: new Date(), email: 'auysal16@ku.edu.tr', id: 1, emailVerified: true, passwordHash: 'passwordHash' }, fields));
exports.mockUser = mockUser;
//# sourceMappingURL=mock-user.js.map