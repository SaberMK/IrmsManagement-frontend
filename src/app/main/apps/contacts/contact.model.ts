import { FuseUtils } from '@fuse/utils';

export class Contact {
    id: number;
    title: string;
    fullName: string;
    preferredName: string;
    email: string;
    mobileNumber: string;
    createdOn: string;
    modifiedOn: string;

    constructor(contact) {
        this.id = contact.id || 0;
        this.title = contact.title || '';
        this.fullName = contact.fullName || '';
        this.preferredName = contact.preferredName || '';
        this.email = contact.email || '';
        this.mobileNumber = contact.mobileNumber || '';
        this.createdOn = contact.createdOn || '';
        this.modifiedOn = contact.modifiedOn || '';
    }
}
