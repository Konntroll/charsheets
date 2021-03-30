import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from 'src/app/services/login.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit {
  data;
  physical: Array<[string, number]>;
  social: Array<[string, number]>;
  mental: Array<[string, number]>;
  talents: Array<[string, number]>;
  skills: Array<[string, number]>;
  knowledges: Array<[string, number]>;
  backgrounds: Array<[string, number]>;
  disciplines: Array<[string, number]>;
  virtues: Array<[string, number]>;
  humanity: [string, number] = ["humanity", 0];
  path: Array<any> = [];
  willpower: [string, object] = ["willpower", {}];
  bloodpool: [string, number] = ["bloodpool", 0];
  bloodpoolMax: number;
  health = {damage: {}, levels: []};
  applyAggr: boolean = false;
  misc: Array<string>;
  inFocus: string;
  info;
  characterName: string;
  plusSymbol = faPlus;
  isPublished: boolean = false;
  isAuthor: boolean = false;
  characterID: string;
  latestSheet: string;
  pics: Observable<unknown[]>;
  tags: Array<string> = [
    "young",
    "middle-aged",
    "old",
    "male",
    "female",
    "business",
    "classy",
    "casual",
    "edgy",
    "menacing",
    "weapons",
    "Nosferatu"
  ];
  tagOption: string;
  charPic: string;
  picSelectorOpen: boolean = false;
  traitMax: number;
  expansionFactor: number;
  sheetExpansion: string;
  categoryExpansion: string;
  subcategoryExpansion: string;
  picRemover = faPlus;

  physattr: Map<string, number> = new Map([
    ["Strength", 1],
    ["Dexterity", 1],
    ["Stamina", 1]
  ]);
  socattr: Map<string, number> = new Map([
    ["Charisma", 1],
    ["Manipulation", 1],
    ["Appearance", 1]
  ]);
  mentattr: Map<string, number> = new Map([
    ["Perception", 1],
    ["Intelligence", 1],
    ["Wits", 1]
  ]);

  meta: Map<string, string> = new Map([
    ["Nature", ""],
    ["Clan", ""],
    ["Player", ""],
    ["Demeanor", ""],
    ["Generation", "13"],
    ["Chronicle", ""],
    ["Concept", ""],
    ["Sire", ""]
  ])

  bloodpoolChart: Map<number, number> = new Map([
    [2, 30],
    [3, 40],
    [4, 50]
  ]);

  constructor(public dataService: DataService,
              public loginService: LoginService,
              public router: Router) {}

  adjustVRank(trait, rank) {
    if (!this.isAuthor) return;
    rank++;
    rank == trait[1] ? trait[1]-- : trait[1] = rank;
    this.dataService.updateTrait(trait[0], trait[1]);
  }

  adjustHLevels(damage, rank) {
    if (!this.isAuthor) return;
    rank++;
    if (this.applyAggr) {
      rank == damage.aggravated ? damage.aggravated-- : damage.aggravated = rank;
    } else {
      rank == damage.regular ? damage.regular-- : damage.regular = rank;
    }
    this.dataService.updateTrait("other.health.damage", damage);
  }

  updateMisc() {
    if (!this.isAuthor) return;
    this.dataService.updateTrait("other.misc", this.misc);
  }

  updateInfo(input) {
    if (!this.isAuthor) return;
    this.dataService.updateTrait("meta." + input[0], input[1]);
  }

  miscTracker(index: number) {
    return index;
  }

  addEntry(path): void {
    if (!this.isAuthor) return;
    this.dataService.updateTrait(path + 'new trait', 0);
  }

  focused(name: string): void {
    if (!this.isAuthor) return;
    this.inFocus = name;
  }

  changePathName(name: string, value: number): void {
    if (this.inFocus != name) {
      this.dataService.updateTrait('other.path.' + name, value);
      this.dataService.removeTrait('other.path.' + this.inFocus);
    }
  }

  changeCharName(name: string) {
    if (!this.isAuthor) return;
    if (this.inFocus != name) {
      this.dataService.updateTrait('name', name);
    }
  }

  noLineBreaks(event: KeyboardEvent) {
    if (!this.isAuthor) return;
    event.preventDefault();
  }

  togglePublicationStatus(status: boolean) {
    this.dataService.updateTrait('published', status);
  }

  deleteChar(ID: string) {
    this.router.navigate(['private']);
    this.dataService.db.collection('chars').doc(ID).delete();
  }

  showPicSelector() {
    this.picSelectorOpen = !this.picSelectorOpen;
  }

  picSelectorStyle(): Object {
    return {
      'left': this.picSelectorOpen ? '0px' : '-400px',
      'height': screen.height - 191 + 'px'
    }
  }

  fetchPics() {
    this.pics = this.dataService.getPics(this.tagOption);
  }

  assignPic(ID: string) {
    this.dataService.updateTrait("pic", ID);
  }

  removePic() {
    this.charPic = null;
    this.dataService.removeTrait('pic');
  }

  ngOnInit(): void {
    if (this.dataService.data === undefined) {
      this.dataService.switchToNewSheet(window.localStorage.getItem('latest'));
    }
    this.dataService.data.subscribe(data => {
      if (data) {
        window.localStorage.setItem('latest', data.charID);
        this.loginService.user$.pipe(take(1)).subscribe(user => {
          if (user) {
            if (user.uid == data.author) {
              this.isAuthor = true;
            }
          }
        });
        
        if (data.published) {
          this.isPublished = true;
        } else {
          this.isPublished = false;
        }

        this.characterID = data.charID;
        
        this.expansionFactor = 0;

        this.physical = Object.entries(data.attributes.physical);
        for (let trait of this.physical) {
          this.physattr.set(trait[0], trait[1]);
        }
        this.physical = Array.from(this.physattr);
        this.social = Object.entries(data.attributes.social);
        for (let trait of this.social) {
          this.socattr.set(trait[0], trait[1]);
        }
        this.social = Array.from(this.socattr);
        this.mental = Object.entries(data.attributes.mental);
        for (let trait of this.mental) {
          this.mentattr.set(trait[0], trait[1]);
        }
        this.mental = Array.from(this.mentattr);
        this.talents = Object.entries(data.abilities.talents);
        this.talents.sort();
        this.skills = Object.entries(data.abilities.skills);
        this.skills.sort();
        this.knowledges = Object.entries(data.abilities.knowledges);
        this.knowledges.sort();
        this.backgrounds = Object.entries(data.advantages.backgrounds);
        this.backgrounds.sort();
        this.disciplines = Object.entries(data.advantages.disciplines);
        this.disciplines.sort();
        this.virtues = Object.entries(data.advantages.virtues);
        this.virtues.sort();
        this.humanity[1] = data.other.humanity;
        this.path = Object.entries(data.other.path);
        this.path = this.path[0];
        this.willpower[1] = data.other.willpower;
        this.bloodpool[1] = data.other.bloodpool;
        this.health = data.other.health;
        this.misc = data.other.misc;
        this.characterName = data.Name;
        if (data.meta.Generation < 8) {
          this.expansionFactor = 8 - data.meta.Generation;
          if (this.expansionFactor > 4) this.expansionFactor = 4;
          this.sheetExpansion = 1075 + this.expansionFactor * 63 + 'px';
          this.categoryExpansion = 800 + this.expansionFactor * 63 + 'px';
          this.subcategoryExpansion = 230 + this.expansionFactor * 21 + 'px'
        }
        if (this.expansionFactor > 1) {
          this.bloodpoolMax = 20 + (this.expansionFactor - 1) * 10;
        } else {
          this.bloodpoolMax = 20;
        }
        this.info = Object.entries(data.meta);
        for (let trait of this.info) {
          this.meta.set(trait[0], trait[1]);
        }
        this.info = Array.from(this.meta);
        if (data.pic) {
          this.charPic = data.pic;
        }
      }
    });
  }

}
