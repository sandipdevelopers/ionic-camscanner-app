import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { inject } from '@angular/core';

export const initalGuard: CanActivateFn = (route, state) => {
  const gs = inject(CommonService);
  const router = inject(Router);
console.log("gs.isFristTimeApp()",gs.isFristTimeApp());

  if (!gs.isFristTimeApp()) {
     return true;
  } else {
     router.navigate(['/home']);
     return false;
  }
};
