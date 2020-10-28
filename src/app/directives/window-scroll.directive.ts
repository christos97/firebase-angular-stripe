import { Directive, HostListener, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subject, fromEvent } from "rxjs";
import { takeUntil,  } from "rxjs/operators";
@Directive({
  selector: '[appWindowScroll]'
})
export class WindowScrollDirective implements OnDestroy {

	destroy = new Subject();

  destroy$ = this.destroy.asObservable();

  constructor() {
    fromEvent(window, 'scroll').pipe(takeUntil(this.destroy$))
    .subscribe((e: Event) => console.log(this.getYPosition(e)));
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
 }

  ngOnDestroy(): void {
  this.destroy.next();
  }

}
