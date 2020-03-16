import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';

@Component({
    selector     : 'contacts-contact-list',
    templateUrl  : './contact-list.component.html',
    styleUrls    : ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContactsContactListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent', {static: false})
    dialogContent: TemplateRef<any>;

    contacts: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['title', 'fullName', 'preferredName', 'email', 'mobileNumber', 'createdOn', 'modifiedOn', 'buttons'];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    private _unsubscribeAll: Subject<any>;

    constructor(private _contactsService: ContactsService,
        public _matDialog: MatDialog) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.dataSource = new FilesDataSource(this._contactsService);

        this._contactsService.onContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(contacts => {
                this.contacts = contacts;
            });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    editContact(contact) {
        this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                contact: contact,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }

                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch (actionType) {
                    case 'save':

                        var value = formData.getRawValue();

                        var body = {
                            id: value.id,
                            title: value.title,
                            fullName: value.fullName,
                            preferredName: value.preferredName,
                            email: value.email,
                            mobileNumber: value.mobileNumber
                        };

                        this._contactsService.updateContact(formData.getRawValue());

                        break;
                    case 'delete':

                        this.deleteContact(contact);

                        break;
                }
            });
    }

    deleteContact(contact) {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._contactsService.deleteContact(contact.id);
            }

            this.confirmDialogRef = null;
        });
    }
}

export class FilesDataSource extends DataSource<any> {
    
    constructor(private _contactsService: ContactsService) {
        super();
    }

    connect(): Observable<any[]> {
        return this._contactsService.onContactsChanged;
    }

    disconnect() { }
}
