import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function allowedEmailDomainValidator(allowedDomains: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;

    // Skip validation if email is empty
    if (!email) {
      return null;
    }

    // Extract domain from the email
    const domain = email.split('@')[1];

    // Check if domain is in allowed list
    if (allowedDomains.includes(domain)) {
      return null; // Valid
    }

    return { invalidDomain: true }; // Invalid
  };
}
