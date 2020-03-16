import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Contact } from 'app/main/apps/contacts/contact.model';

@Injectable()
export class ContactsService implements Resolve<any> {
    onContactsChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    contacts: Contact[];
    user: any;
    selectedContacts: number[] = [];

    searchText: string;
    filterBy: string;

    constructor(private _httpClient: HttpClient) {
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getContacts()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContacts();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getContacts();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getContacts(): Promise<any> {
        return new Promise((resolve, reject) => {
                this._httpClient.get('/Contact')
                    .subscribe((response: any) => {

                        this.contacts = response;

                        if (this.searchText && this.searchText !== '') {
                            this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                        }

                        this.contacts = this.contacts.map(contact => {
                            return new Contact(contact);
                        });

                        this.onContactsChanged.next(this.contacts);
                        resolve(this.contacts);
                    }, reject);
            }
        );
    }

    updateContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.put('/Contact', contact)
                .subscribe(response => {
                    this.getContacts();
                    resolve(response);
                }, reject);
        });
    }

    addContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {

            this._httpClient.post('/Contact', contact)
                .subscribe(response => {
                    this.getContacts();
                    resolve(response);
                }, reject);
        });
    }

    deleteContact(contactId) {
        return new Promise((resolve, reject) => {
            this._httpClient.delete(`/Contact?id=${contactId}`)
                .subscribe(response => {
                    this.getContacts();
                    resolve(response);
                }, reject);
        });
    }
}
