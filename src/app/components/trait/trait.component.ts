import { Component, OnInit,  Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'trait',
  templateUrl: './trait.component.html',
  styleUrls: ['./trait.component.css', '../sheet/sheet.component.css']
})
export class TraitComponent implements OnInit {
  @Input() trait: [string, number];
  @Input() path: string;
  @Input() editable: boolean = true;
  @Input() removeable: boolean = true;
  @Input() isAuthor: boolean = false;
  @Input() lowGenFactor: number = 0;

  traitMax: number = 5;
  newEntry: string;
  newName: string;
  inFocus: string;
  edit: boolean = false;
  del = faPlus;

  adjustRank(trait: object, rank: number):void {
    if (!this.isAuthor) return;
    if (trait[0].length == 0) return;
    rank++;
    rank == trait[1] ? trait[1]-- : trait[1] = rank;
    this.dataService.updateTrait(this.path + trait[0], trait[1]);
  }

  addTrait(name: string): void {
    if (!this.isAuthor) return;
    if (!name) return;
    this.dataService.updateTrait(this.path + name, 0);
  }

  updateName(trait: [string, number], name: string): void {
    if (!this.isAuthor) return;
    let newTrait = [name, trait[1]];
    this.dataService.removeTrait(this.path + trait[0]);
    this.dataService.updateTrait(this.path + newTrait[0], newTrait[1]);
  }

  remove(trait: string): void {
    if (!this.isAuthor) return;
    this.dataService.removeTrait(this.path + trait);
  }

  focused(name: string): void {
    if (!this.isAuthor) return;
    this.inFocus = name;
  }

  log(name: string, value: number): void {
    if (!this.isAuthor) return;
    name = name.replace("\n", "");
    if (this.inFocus != name) {
      this.dataService.removeTrait(this.path + this.inFocus);
      this.dataService.updateTrait(this.path + name, value);
    }
  }

  noLineBreaks(event: KeyboardEvent) {
    event.preventDefault();
  }

  ranksWidth(): Object {
    return {
      'width': this.lowGenFactor > 0 ? 104 + 21 * this.lowGenFactor + 'px': '104px'
    }
  }

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    if (this.lowGenFactor > 0) {
      this.traitMax = this.traitMax + this.lowGenFactor;
    }
  }

}
