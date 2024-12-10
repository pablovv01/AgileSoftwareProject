import { Injectable } from '@angular/core';
import { Idea } from '../entities/idea';
import { FirebaseDbService } from '../../data/firebase_db_service';
import { get, getDatabase, push, ref, remove, set, update, query, orderByKey, startAfter, limitToFirst, child } from "firebase/database";
import {Comment} from '../entities/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentUseCase {

  constructor(private firebaseDb: FirebaseDbService) { }

  async addComment(ideaId: string, comment: Comment): Promise<void> {
    try {
      await this.firebaseDb.addComment(ideaId, comment);
      console.log(`Comment added to idea ${ideaId} successfully.`);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Error adding comment');
    }
  }
}
