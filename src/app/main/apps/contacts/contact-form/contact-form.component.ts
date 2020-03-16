import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from 'app/main/apps/contacts/contact.model';

@Component({
    selector     : 'contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent {
    action: string;
    contact: Contact;
    contactForm: FormGroup;
    dialogTitle: string;

    constructor(public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder)
    {
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Edit Contact';
            this.contact = _data.contact;
        }
        else {
            this.dialogTitle = 'New Contact';
            this.contact = new Contact({});
        }

        this.contactForm = this.createContactForm();
    }

    createContactForm(): FormGroup {
        return this._formBuilder.group({
            id      : [ this.contact.id ],
            title   : [ this.contact.title, Validators.required ],
            fullName    : [ this.contact.fullName, Validators.required ],
            preferredName: [ this.contact.preferredName, Validators.required ],
            email  : [ this.contact.email, [ Validators.required, Validators.email ] ],
            mobileNumber: [ this.contact.mobileNumber ]
        });
    }
}
