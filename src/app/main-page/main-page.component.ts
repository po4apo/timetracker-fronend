import { Component, OnInit } from '@angular/core';

import {ProjectsService} from "../app.service.tc";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  providers: [ProjectsService]
})
export class MainPageComponent implements OnInit{
  projects:any = []
  currentProjectId = this.projects[0]
  constructor(private projectsService: ProjectsService) {

  }

  ngOnInit() {
    this.projectsService.getProjects().subscribe(
      data =>{
        console.debug(data)
        this.projects = data
        this.currentProjectId = data[0].pk
      }
    )
  }

  setCurrentProject(id: any) {
    this.currentProjectId = id;


  }

}
