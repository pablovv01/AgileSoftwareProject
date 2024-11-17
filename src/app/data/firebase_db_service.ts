import { get, getDatabase, ref, remove, set } from "firebase/database";
import { User } from "../core/entities/user";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class FirebaseDbService {

    private db = getDatabase();

    constructor() { }

    // Get reference to Firebase Database
    getDatabaseRef(path: string) {
        const db = getDatabase();
        return ref(db, path);
    }

    // Save user data into the database
    saveUserData(userId: string, user: User): Promise<void> {
        return set(ref(this.db, 'users/' + userId), user);
    }

    // Get the ideas from Firebase Database
    async getIdeas() {
        const dbRef = this.getDatabaseRef('ideas');
        const snapshot = await get(dbRef);
        return snapshot;
    }

    // Delete idea from Firebase Database
    async deleteIdea(ideaID: string) {
        const dbRef = this.getDatabaseRef(`ideas/${ideaID}`);
        await remove(dbRef);
    }
}