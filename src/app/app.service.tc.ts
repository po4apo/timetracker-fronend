import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs";

const URL = 'http://158.160.105.71:8000/'

export interface Project {
  id: number,
  name: string
  user: number
}

export interface Task {
  created_at: string,
  description: string,
  id: number,
  name: string,
  project: string,
  status: string,

  descriptionOpen?: boolean
  timeSpent?: string
}

export interface Frame {
  start: string,
  stop?: string,
  task: number
}

@Injectable()
export class ProjectsService {
  constructor(private httpClient: HttpClient) {
  }

  getProjects() {
    console.debug('request has been sent to receive all projects')
    return this.httpClient.get<Project[]>(URL + 'projects/')
  }

  addProject(name: string, user: string) {
    console.debug('request has been add project')
    return this.httpClient.post<Project>(URL + 'projects/', {name: name, user: user})

  }

  removeProject(id: number) {
    console.debug(`project ${id} has been removed`)
    return this.httpClient.delete<Project>(URL + `projects/${id}/`)
  }


}

@Injectable()
export class TasksServes {
  constructor(private httpClient: HttpClient) {
  }

  getTasksByProject(projectId: number) {
    console.debug('request has been sent to receive all projects')
    return this.httpClient.get<Task[]>(URL + 'tasks/?project=' + projectId).pipe(
      map((tasks) => {
        tasks.map(task => {
          task.descriptionOpen = false
          this.timeSpent(task.id).subscribe(
            value => {
              task.timeSpent = value.time_spent
            }
          )
        })
        return tasks
      })
    )

  }

  addTask(project: number, name: string, description: string) {
    return this.httpClient.post<Task>(URL + 'tasks/', {
      "project": project,
      "name": name,
      "description": description
    }).pipe(
      map(task => {
        task.descriptionOpen = false
        return task
      })
    )
  }

  removeTask(id: number) {
    return this.httpClient.delete<Task>(URL + `tasks/${id}/`)
  }

  startTask(startTime: string, taskId: number) {
    return this.httpClient.post<Frame>(URL + 'start/', {"start": startTime, task: taskId})

  }

  stopTask(stopTime: string, taskId: number) {
    return this.httpClient.patch<Frame>(URL + 'stop/', {"stop": stopTime, task: taskId})

  }

  setTaskStatus(taskId: number, status: string) {
    return this.httpClient.patch<Frame>(URL + `tasks/${taskId}/`, {"status": status})

  }

  getTaskStatus() {
    return this.httpClient.get<Frame>(URL + 'status/')
  }

  timeSpent(id: number) {
    return this.httpClient.get<any>(URL + `time_spent/${id}/`).pipe(
      map(value => {
        value.time_spent = this.formatTime(value.time_spent)
        return value
      })
    )
  }

  formatTime(seconds: number) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - hours * 3600) / 60);
    let timeString = '';
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes >= 0) {
      timeString += `${minutes}m`;
    }
    return timeString.trim();
  }


}
