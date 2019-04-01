import { Component, OnInit } from '@angular/core';
import { Node, DataService } from 'src/app/data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss']
})
export class NodeDetailComponent implements OnInit {
  private node: Node;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.params.id) {
      const id = this.route.snapshot.params.id;
      this.dataService.getNodeById(id).subscribe(data => {
        this.node = data;
      });
    } else {
      this.router.navigate(['nodes']);
    }
  }

}
