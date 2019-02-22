import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Exercise } from './exercise.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UIServise } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  exerciseChange = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExerices: Exercise[] = [];
  // private availableExerices: Exercise[] = [
  //   { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
  //   { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
  //   { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
  //   { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  // ];

  private runningExercises: Exercise;
  private fbSubscription: Subscription[] = [];

  constructor(private db: AngularFirestore,
    private uiService: UIServise) { }

  fetchAvailableExercises() {
    this.uiService.lodingStateChanged.next(true);
    this.fbSubscription.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(res => {
          // throw(new Error());
          return res.map(a => {
            return {
              id: a.payload.doc.id,
              name: a.payload.doc.data().name,
              duration: a.payload.doc.data().duration,
              calories: a.payload.doc.data().calories
            };
          });
        })
      ).subscribe((exercises: Exercise[]) => {
        this.uiService.lodingStateChanged.next(false);
        this.availableExerices = exercises;
        this.exercisesChanged.next([...this.availableExerices]);
      }, error => {
        this.uiService.lodingStateChanged.next(false);
        this.uiService.showSnackbar(
          'Fetching exercises failed, please try again later', null, 4000);
        this.exercisesChanged.next(null);
      })
    );
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({laseSelected: new Date()});
    this.runningExercises  = this.availableExerices.find(
      x => x.id === selectedId
      );
    this.exerciseChange.next({...this.runningExercises});
  }

  completeExercise() {
    this.addDataToDatabase({...this.runningExercises,
       date: new Date(),
       state: 'completed' });
    this.runningExercises = null;
    this.exerciseChange.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({...this.runningExercises,
      duration: this.runningExercises.duration * (progress / 100),
      calories: this.runningExercises.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled' });
   this.runningExercises = null;
   this.exerciseChange.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercises };
  }

  fetchCompletedOrCanceledExercises() {
    this.fbSubscription.push(this.db.collection('finishedExercises').valueChanges()
    .subscribe((exercises: Exercise[]) => {
      this.finishedExercisesChanged.next(exercises);
    }));
  }

  cancelSubscription() {
    this.fbSubscription.forEach(sub => sub.unsubscribe());
  }
  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
