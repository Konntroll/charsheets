import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LoginService } from '../../services/login.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  private;
  newCharSymbol = faPlus;
  deleteIcon = faPlus;
  searchOptions: Array<string> = [
    "Clan",
    "Name",
    "Generation"
  ]
  path: string;
  query: string;

  constructor(public dataService: DataService,
              public loginService: LoginService,
              public router: Router) { }

  ngOnInit(): void {
    this.loginService.user$.subscribe(user => {
      if (user) {
        this.private = this.dataService.getPrivateChars(user.uid);
      }
    });
  }

  newChar() {
    this.dataService.copyBlankSheet();
  }

  openChar(ID: string) {
    this.dataService.switchToNewSheet(ID);
  }

  refineDisplay() {
    this.private = this.dataService.refinePrivateSelection(this.path, this.query);
  }

  deleteChar(event, ID: string) {
    event.stopPropagation();
    this.dataService.db.collection('chars').doc(ID).delete();
  }

}
