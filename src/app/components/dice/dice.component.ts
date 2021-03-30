import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.css']
})
export class DiceComponent implements OnInit {
  difficulty: number = 6;
  dice: number = 6;
  success: number = 0;
  roll: Array<number> = [];
  output: string = "";
  clear = faTimes;

  adjustDifficulty(inc): void {
    this.difficulty += inc;
    if (this.difficulty > 10) this.difficulty = 10;
    if (this.difficulty < 1) this.difficulty = 1;
  }

  setNumberOfDice(num): void {
    this.dice = num + 1;
  }

  addADie(): void {
    this.dice++;
    if (this.dice > 20) this.dice = 20;
  }

  rollDice(): void {
    this.success = 0;
    this.roll = [];
    let dieRoll: number;
    for (let die: number = 1; die <= this.dice; die++) {
      dieRoll = Math.floor(Math.random() * 10 + 1);
      this.roll.push(dieRoll);
      if (dieRoll >= this.difficulty) {
        this.success++;
      }
    }
    this.formatRoll();
  }

  formatRoll(): void {
    let results: Array<string> = [];
    let eachResult: Array<number> = []
    for (let die: number = 1; die <= 10; die++) {
      eachResult = this.roll.filter(dieRoll => dieRoll == die);
      if (eachResult.length > 1) {
        results.push((die + '×' + eachResult.length).toString());
      }
      if (eachResult.length == 1) {
        results.push((die).toString());
      }
    }
    this.output = results.join(", ");
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
