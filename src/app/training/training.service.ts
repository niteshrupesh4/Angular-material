import { Subject } from 'rxjs';
import { Exercise } from './exercise.model';

export class TrainingService {
  exerciseChange = new Subject<Exercise>();

  private availableExerices: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private runningExercises: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableExerices.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercises  = this.availableExerices.find(
      x => x.id === selectedId
      );
    this.exerciseChange.next({...this.runningExercises});
  }

  completeExercise() {
    this.exercises.push({...this.runningExercises,
       date: new Date(),
       state: 'completed' });
    this.runningExercises = null;
    this.exerciseChange.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({...this.runningExercises,
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

  getCompletedOrCanceledExercises() {
    return this.exercises.slice();
  }
}
