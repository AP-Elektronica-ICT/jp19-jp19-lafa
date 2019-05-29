import { Component, OnInit } from '@angular/core';
import { DataService, Node } from 'src/app/data.service';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent implements OnInit {
  private nodes: Node[];
  private dataState: HTTPRequestState = HTTPRequestState.loading;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getAllNodes().subscribe(data => {
      this.nodes = data;
      this.dataState = HTTPRequestState.done;
    }, err => {
      this.dataState = HTTPRequestState.error;
    });
  }

  getStateClass(node: Node) {
    switch (node.status) {
      case 1:
        return { online: true }
        break;
      case 0:
        return { offline: true }
        break;
      case 2:
        return { warning: true }
        break;
    }
  }

}

enum HTTPRequestState {
  loading,
  error,
  done
}
