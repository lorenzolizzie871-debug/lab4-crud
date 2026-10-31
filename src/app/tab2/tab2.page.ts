import { Component, ChangeDetectorRef } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore';

import { db } from '../firebase.config';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  students: any[] = [];
  filteredStudents: any[] = [];

  searchText: string = '';
  selectedCourse: string = 'All';

  isLoading: boolean = false;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {
    this.selectedCourse = 'All';
    this.searchText = '';
    this.loadStudents();
  }

  async loadStudents() {
    this.isLoading = true;

    try {
      const querySnapshot = await getDocs(
        collection(db, 'students')
      );

      const loadedStudents: any[] = [];

      querySnapshot.forEach((document) => {
        loadedStudents.push({
          id: document.id,
          ...document.data()
        });
      });

      this.students = loadedStudents;

      // Ipakita agad lahat ng data kapag All
      this.filteredStudents = [...this.students];

      // Apply search and course filter
      this.filterStudents();

    } catch (error) {
      console.error('Error loading students:', error);
      this.showToast('Error loading students.');

    } finally {
      this.isLoading = false;

      // Important: refresh Angular screen immediately
      this.changeDetectorRef.detectChanges();
    }
  }

  filterStudents() {
    const search = this.searchText.trim().toLowerCase();
    const selectedCourse =
      this.selectedCourse.trim().toLowerCase();

    this.filteredStudents = this.students.filter((student) => {

      const studentName = String(
        student.studentName ?? ''
      ).toLowerCase();

      const studentId = String(
        student.studentId ?? ''
      ).toLowerCase();

      const email = String(
        student.email ?? ''
      ).toLowerCase();

      const contactNumber = String(
        student.contactNumber ?? ''
      ).toLowerCase();

      const course = String(
        student.course ?? ''
      ).trim().toLowerCase();

      const yearLevel = String(
        student.yearLevel ?? ''
      ).toLowerCase();

      const matchesSearch =
        studentName.includes(search) ||
        studentId.includes(search) ||
        email.includes(search) ||
        contactNumber.includes(search) ||
        course.includes(search) ||
        yearLevel.includes(search);

      const matchesCourse =
        selectedCourse === 'all' ||
        course === selectedCourse;

      return matchesSearch && matchesCourse;
    });

    // Refresh the displayed list immediately
    this.changeDetectorRef.detectChanges();
  }

  async updateStudent(student: any) {
    const alert = await this.alertController.create({
      header: 'Update Student',

      inputs: [
        {
          name: 'studentName',
          type: 'text',
          placeholder: 'Student Name',
          value: student.studentName
        },
        {
          name: 'studentId',
          type: 'text',
          placeholder: 'Student ID',
          value: student.studentId
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          value: student.email
        },
        {
          name: 'contactNumber',
          type: 'tel',
          placeholder: 'Contact Number',
          value: student.contactNumber
        },
        {
          name: 'course',
          type: 'text',
          placeholder: 'Course',
          value: student.course
        },
        {
          name: 'yearLevel',
          type: 'text',
          placeholder: 'Year Level',
          value: student.yearLevel
        }
      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',

          handler: async (data) => {

            if (
              !data.studentName ||
              !data.studentId ||
              !data.email ||
              !data.contactNumber ||
              !data.course ||
              !data.yearLevel
            ) {
              this.showToast('Please complete all fields.');
              return false;
            }

            try {
              const studentRef = doc(
                db,
                'students',
                student.id
              );

              await updateDoc(studentRef, {
                studentName: data.studentName,
                studentId: data.studentId,
                email: data.email,
                contactNumber: data.contactNumber,
                course: data.course,
                yearLevel: data.yearLevel
              });

              this.showToast(
                'Student updated successfully!'
              );

              await this.loadStudents();

              return true;

            } catch (error) {
              console.error(
                'Error updating student:',
                error
              );

              this.showToast(
                'Error updating student.'
              );

              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteStudent(student: any) {
    const alert = await this.alertController.create({
      header: 'Delete Student',

      message:
        `Are you sure you want to delete ${student.studentName}?`,

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',

          handler: async () => {
            try {
              await deleteDoc(
                doc(db, 'students', student.id)
              );

              this.showToast(
                'Student deleted successfully!'
              );

              await this.loadStudents();

            } catch (error) {
              console.error(
                'Error deleting student:',
                error
              );

              this.showToast(
                'Error deleting student.'
              );
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async refreshStudents(event: any) {
    await this.loadStudents();
    event.target.complete();
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