import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export class customGlobalValidation {

    /** Function to not accept spaces */
    public cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if ((control.value as string).indexOf(' ') >= 0) {
                return { invalidField: true };
            }
        }
        return null;
    }

    /** Function to  accept only alphanumeric  */
    public onlyAlphaNumeric(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if (!(/^[a-zA-Z0-9]+$/.test(control.value))) {
                return { invalidField: true };
            }
        }
        return null;
    }

    /** Function to accept only character */
    public onlyCharacters(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if (!(/^[a-zA-Z]+$/.test(control.value))) {
                return { invalidField: true };
            }
        }
        return null;
    }

    /** Function to not accept alphanumeric values with underscore */
    public onlyAlphaNumericWithUnderScore(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if (!(/^[a-zA-Z0-9](?:_?[a-zA-Z0-9])*$/.test(control.value))) {
                return { invalidField: true };
            }
        }
        return null;
    }

    /** Function to not accept alphanumeric values with underscore */
    public onlyPlusMinusCharaterInFront(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if (!(/^[+-]?\d+$/.test(control.value))) {
                return { invalidField: true };
            }
        }
        return null;
    }
}