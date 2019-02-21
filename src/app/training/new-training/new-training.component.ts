import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exerciseList: Exercise[];
  exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService
  ) {}

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exercisesChanged
    .subscribe(exercises => this.exerciseList = exercises);
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    if (form.valid) {
      this.trainingService.startExercise(form.value.exercise);
    }
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }

}
