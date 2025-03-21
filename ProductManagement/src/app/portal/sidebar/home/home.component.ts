import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  profileImage: string | ArrayBuffer | null = null;

  // onProfileUpload(event: any) {
  //   const file = event.files[0];

  //   // Check if file type is JPG/PNG
  //   if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
  //     const reader = new FileReader();

  //     reader.onload = (e: any) => {
  //       this.profileImage = e.target.result; // Save image for preview
  //     };

  //     reader.readAsDataURL(file);
  //   } else {
  //     alert("Only JPG and PNG formats are allowed.");
  //   }
  // }

 
}
