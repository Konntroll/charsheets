import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {
  published: any;
  searchOptions: Array<string> = [
    "Clan",
    "Name",
    "Generation"
  ]
  path: string;
  query: string;

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.published = this.dataService.getPublicChars();
  }

  openChar(ID: string) {
    this.dataService.switchToNewSheet(ID);
  }

  refineDisplay() {
    this.published = this.dataService.refinePublicSelection(this.path, this.query);
  }

}
