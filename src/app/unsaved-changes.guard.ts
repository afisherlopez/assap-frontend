import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

export interface SaveableChangesComponent {
  isSaved(): boolean | Observable<boolean> | Promise<boolean>;
}

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard  {
  canDeactivate(component: SaveableChangesComponent): Observable<boolean> | Promise<boolean> | boolean {
    return component.isSaved() || confirm('Are you sure you want to leave this page? Changes that you made may not be saved.');
  }
}
