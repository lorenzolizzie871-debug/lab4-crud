import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  ToastController
} from '@ionic/angular';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase.config';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,

  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton
  ]
})
export class Tab1Page {

  studentName: string = '';
  studentId: string = '';
  email: string = '';
  contactNumber: string = '';
  course: string = '';
  yearLevel: string = '';

  constructor(
    private toastController: ToastController
  ) {}

  async addStudent(form: NgForm) {

    if (
      !this.studentName.trim() ||
      !this.studentId.trim() ||
      !this.email.trim() ||
      !this.contactNumber.trim() ||
      !this.course ||
      !this.yearLevel
    ) {
      await this.showToast('Please complete all fields.');
      return;
    }

    try {

      await addDoc(collection(db, 'students'), {
        studentName: this.studentName.trim(),
        studentId: this.studentId.trim(),
        email: this.email.trim(),
        contactNumber: this.contactNumber.trim(),
        course: this.course,
        yearLevel: this.yearLevel,
        createdAt: new Date()
      });

      form.resetForm({
        studentName: '',
        studentId: '',
        email: '',
        contactNumber: '',
        course: '',
        yearLevel: ''
      });

      await this.showToast('Student added successfully!');

    } catch (error) {

      console.error('Error adding student:', error);

      await this.showToast('Error adding student.');

    }

  }

  async showToast(message: string) {

    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });

    await toast.present();

  }

}