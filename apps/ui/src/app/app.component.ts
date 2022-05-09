import { Component } from '@angular/core';
import { HelloService } from './hello.service';

@Component({
  selector: 'bludger-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.hello.getHello();
  constructor(private hello: HelloService) { }
}
