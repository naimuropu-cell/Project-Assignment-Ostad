import { faker } from '@faker-js/faker';

export interface EmployeeInfo {
  firstName: string;
  lastName: string;
  employeeId: string;
}

export function getRandomEmployee(): EmployeeInfo {
  // Generate a random alphabetic name
  const firstName = faker.person.firstName().replace(/[^a-zA-Z]/g, '');
  const lastName = faker.person.lastName().replace(/[^a-zA-Z]/g, '');
  // Generate random 6-digit employee id
  const employeeId = Math.floor(100000 + Math.random() * 900000).toString();

  return {
    firstName,
    lastName,
    employeeId,
  };
}
