import {Component, Input, OnChanges, Pipe, PipeTransform} from '@angular/core';
import {Task, TasksServes} from "../app.service.tc";
import * as moment from "moment/moment";

@Pipe({name: 'sortTasksBuStatus'})
export class SortTasksBuStatus implements PipeTransform {

  transform(arr: Task[]){
    return arr.sort((a, b) => {
        return b.status.length - a.status.length;
    });
  }
}


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TasksServes]
})
export class TasksComponent implements OnChanges {
  newTaskName: string = ''
  newTaskDescription: string = ''
  newTaskNameErr: string = ''
  newTaskDescriptionErr: string = ''
  startedTask: number | null = null
  // @ts-ignore
  timer: string = '0m'
  // @ts-ignore
  intervalId: NodeJS.Timer | undefined

  @Input() projectId = -1
  tasks: Task[] = []

  constructor(private taskServes: TasksServes) {
  }

  ngOnChanges() {
    this.taskServes.getTasksByProject(this.projectId).subscribe({
        next: data => {
          console.debug(data)
          this.tasks = data
          this.updateStatus()

        },

      }
    )
  }

  updateStatus(){
    this.taskServes.getTaskStatus().subscribe(
      {
        next: value => {
          if (value.stop){
            this.startedTask = null
          }else{
            this.startedTask = value.task
            const momentDate = moment.utc(value.start);
            const date = momentDate.toDate().getTime();
            this.createTimer(date)
          }
        }
      }
    )
  }

  addTask() {
    this.taskServes.addTask(this.projectId, this.newTaskName, this.newTaskDescription).subscribe(
      {
        next: task => {
          task.timeSpent = "0m"
          this.tasks[this.tasks.length] = task

        },
        error: err => {
          console.debug(err)
          if (err.error.name){
            this.newTaskNameErr = err.error.name
          }
          if (err.error.description){
            this.newTaskDescriptionErr = err.error.description
          }
        },
        complete: () => {
          this.newTaskName = ''
          this.newTaskDescription = ''
          this.newTaskNameErr = ''
          this.newTaskDescriptionErr = ''

        }

      }
    )
  }

  removeTask(id: number) {
    this.taskServes.removeTask(id).subscribe({
        next: value => {
          let i = this.tasks.findIndex((x => x.id === id))
          this.tasks.splice(i, 1)
        }
      }
    )

  }

  getFormattedTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDate
  }

  createTimer(startTime: number){
    this.timer = '0m'
    clearInterval(this.intervalId)
    this.intervalId = setInterval(() => {
      this.timer = this.taskServes.formatTime((Date.now() - startTime) / 1000);
    }, 2000);
  }

  startTask(taskId: number) {

    this.taskServes.startTask(this.getFormattedTime(), taskId).subscribe(
      {
        next: value => {``
          const momentDate = moment.utc(value.start);
          const date = momentDate.toDate().getTime();
          this.createTimer(date)
        },
        complete: () => {
          this.startedTask = taskId

        },
        error: err => {
          alert(err)
        }
      }
    )

  }

  stopTask(task: Task) {
    this.taskServes.stopTask(this.getFormattedTime(), task.id).subscribe(
      {
        complete: () => {
          this.startedTask = null
          this.taskServes.timeSpent(task.id).subscribe(
            value => task.timeSpent = value.time_spent
          )
        },
        error: err => {
          alert(err)
        }
      }
    )
  }

  setTaskStatus(task: Task, status: string){
    this.taskServes.setTaskStatus(task.id, status).subscribe(
      {
        next: value => {
          task.status = status
        }
      }
    )
  }

}
