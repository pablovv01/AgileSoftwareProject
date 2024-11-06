import { Component } from '@angular/core';

@Component({
  selector: 'app-add-idea',
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.css']
})
export class AddIdeaComponent {
  idea = { title: '', description: '', tags: [] };
  availableTags = ['Innovation', 'Technology', 'Healthcare', 'Environment']; // Example tags

  onSubmit() {
    if (this.idea.title && this.idea.description) {
      console.log('Idea submitted:', this.idea);
      // Add logic to save the idea (e.g., call to service)
    }
  }
}