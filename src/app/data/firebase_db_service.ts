import { getDatabase, ref, set } from "firebase/database";
import { User } from "../core/entities/user";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class FirebaseDbService {

    private db = getDatabase();

    constructor() { }
    
    // Save user data into the database
    saveUserData(userId: string, user: User): Promise<void> {
        return set(ref(this.db, 'users/' + userId), user);
    }
}