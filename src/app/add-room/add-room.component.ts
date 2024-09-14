import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { environment } from '../environments/environments';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css'] // Corrected from styleUrl to styleUrls
})
export class AddRoomComponent {
  roomForm: FormGroup;
  private apiUrl = `${environment.apiUrl}/api/Room`; // Adjust the URL as necessary

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.roomForm = this.fb.group({
      roomNumber: [null, Validators.required],
      roomType: ['', Validators.required],
      price: ['', Validators.required],
      isAvailable: [true, Validators.required],
      imagePath: [''],
      bathRoom:[''],
      hall:[''],
      bedRoom:[''],
      rating: [null, [Validators.required, this.ratingRangeValidator]],
      location: [null, Validators.required],
      description: [null, Validators.required],
      wifi: [false], // Default value
      tv: [false] ,
      carparking:[false],
      freecancelation:[false],
      hotwater:[false],
      ironing:[false]
    });
  }

  ratingRangeValidator(control: AbstractControl) {
    const value = control.value;
    if (value !== null && (value < 1.0 || value > 5.0)) {
      return { ratingRange: true }; // Return error if rating is out of range
    }
    return null; // Return null if validation passes
  }

  onSubmit() {
    if (this.roomForm.valid) {
      const formData = this.roomForm.value;
      formData.amenities = this.getSelectedAmenities(); // Add amenities to the data
      this.http.post<any>(`${this.apiUrl}/AddRoom`, formData).subscribe(
        response => {
          window.alert('Room added successfully');
          this.activeModal.close(response); // Close modal and pass response
        },
        error => {
          console.error('Error adding room', error);
        }
      );
    }
  }

  getSelectedAmenities() {
    const amenities = [];
    if (this.roomForm.value.wifi) amenities.push('Free Wi-Fi');
    if (this.roomForm.value.tv) amenities.push('TV Available');
    if (this.roomForm.value.carparking) amenities.push('Car parking Available');
    if (this.roomForm.value.hotwater) amenities.push('Hot water');
    if (this.roomForm.value.ironing) amenities.push('Ironing');
    if (this.roomForm.value.freecancelation) amenities.push('Free Cancelation');
    return amenities.join(', '); // Return amenities as a comma-separated string
  }

  close() {
    this.activeModal.dismiss(); // Dismiss the modal
  }
}