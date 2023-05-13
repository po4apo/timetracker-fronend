import {Component, Input, OnChanges} from '@angular/core';
import {TasksServes} from "../app.service.tc";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TasksServes]
})
export class TasksComponent implements OnChanges {
  @Input() projectId = -1
  tasks:any = []
  constructor(private taskServes: TasksServes) {
  }

  ngOnChanges() {
    this.taskServes.getTasksByProject(this.projectId).subscribe(
      data=>{
        this.tasks = data
      }
    )
  }



}
