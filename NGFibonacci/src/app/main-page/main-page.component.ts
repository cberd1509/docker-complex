import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  seenIndexes:any[];
  values:any;
  indexForm:FormGroup;

  constructor(private httpclient:HttpClient, private formBuilder:FormBuilder) {
    this.fetchIndexes();
    this.fetchValues();

    this.indexForm = this.formBuilder.group({
      "index":['',[Validators.required,Validators.pattern(new RegExp("^[0-9]*$"))]]
    })
  }

  ngOnInit() {
  }

  submitIndex()
  {
    this.httpclient.post("/api/values",this.indexForm.value).subscribe(()=>{
      this.indexForm.reset();
    })
  }

  fetchIndexes()
  {
    this.httpclient.get("/api/values/all").subscribe((data:any[])=>{
      this.seenIndexes = data;
    })
  }

  fetchValues()
  {
    this.httpclient.get("/api/values/current").subscribe((data:any[])=>{
      this.values = [];

      if(data)
      {
        for(let key of Object.keys(data))
        {
          this.values.push({key:key, value:data[key]});
        }
      }

    });
  }
}
