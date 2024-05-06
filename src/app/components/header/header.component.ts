import { Component, EventEmitter, Output } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar/navbar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userIdentifier: any;
  userIdentifierType: string = '';
  
  constructor(private navbarService: NavbarService) {
    const storedUser = localStorage.getItem('currentUser');
    // console.log("header:", storedUser);
    
    if (storedUser !== null) {
      const parsedUser = JSON.parse(storedUser);
      const firstSpaceIndex = parsedUser.nome.indexOf(' ');

      if (firstSpaceIndex !== -1) {
        this.userIdentifier = parsedUser.nome.substring(0, firstSpaceIndex);
        this.userIdentifierType = parsedUser.identifier;
      } else {
        this.userIdentifier = parsedUser.identifier;
      }
    } 
    // console.log(this.userIdentifier);
  }

  get isAsideOpen(): boolean {
    return this.navbarService.isAsideOpen;
  }

  toggleAside() {
    this.navbarService.toggleAside();
  }

  @Output() toggleSidebarEvent = new EventEmitter<void>();

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

}
