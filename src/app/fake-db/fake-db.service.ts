import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ContactsFakeDb } from 'app/fake-db/contacts';
import { IconsFakeDb } from 'app/fake-db/icons';

export class FakeDbService implements InMemoryDbService
{
    createDb(): any
    {
        return {
            // Contacts
            'contacts-contacts': ContactsFakeDb.contacts,
            'contacts-user'    : ContactsFakeDb.user,

            // Icons
            'icons': IconsFakeDb.icons
        };
    }
}
