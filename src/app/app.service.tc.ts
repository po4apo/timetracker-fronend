import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

const URL = 'http://127.0.0.1:8000/api/v1/'

@Injectable()
export class ProjectsService {
  constructor(private httpClient: HttpClient) {
  }

  getProjects() {
    console.debug('request has been sent to receive all projects')
    return this.httpClient.get<any>(URL + 'projects/')
  }


}

@Injectable()
export class TasksServes {
  constructor(private httpClient: HttpClient) {
  }

  getTasksByProject(projectId: number) {
    console.debug('request has been sent to receive all projects')
    return this.httpClient.get<any>(URL + 'tasks/?project=' + projectId)
  }
}
