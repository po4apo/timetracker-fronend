import { Component, OnInit } from '@angular/core';

import {Project, ProjectsService} from "../app.service.tc";
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from "../login/login.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  providers: [ProjectsService]
})
export class MainPageComponent implements OnInit{
  projects:Project[] = []
  currentProjectId: number = -1
  isToggle = true
  newProjectName: string = ''
  constructor(private projectsService: ProjectsService, private auth: AuthService) {

  }

  ngOnInit() {
    this.projectsService.getProjects().subscribe(
      data => {
        console.debug(data)
        this.projects = data
        this.currentProjectId = data[0].id
      }

    )
  }

  setCurrentProject(id: number) {
    this.currentProjectId = id;
  }

  CurrentProjectIdNotUnderfind(): boolean {
  return this.currentProjectId != undefined;
}

addProject(){
    let userId = this.auth.getUserId()
  if (userId) {
    this.projectsService.addProject(this.newProjectName, userId).subscribe(
      {next:project=>
    {
      this.projects[this.projects.length] = project
      this.setCurrentProject(project.id)
    },
      error: err => {
        alert('Invalid data')
      },
        complete: () => {
          this.newProjectName = ''
        }

  }
    )
  }else{
    console.debug(`UserId is ${userId}`)
  }

}

removeProject(id:number){
    this.projectsService.removeProject(id).subscribe(data =>{
      let i = this.projects.findIndex((x => x.id === id))
      this.projects.splice(i, 1)
      }


    )
}

logOut(){
    this.auth.logout()
}

isLoggedIn(){
    return this.auth.isLoggedIn()
}

}
