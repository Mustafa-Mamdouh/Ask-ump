import { Injectable } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
 
 
 
@Injectable()
export class NotificationBuilderService {
 
  options = {
    position: 'bottom-left',
    toastTimeout: 8000,
    showCloseButton: true,
    maxShown:5
  };

  constructor(private toastr: ToastrManager ) 
      {   
/*           this.toastOpts.toastLife = 8000;
          this.toastOpts.positionClass = 'toast-bottom-left';
          this.toastOpts.showCloseButton = true;
 */          // this.toastr.setRootViewContainerRef(vcr);

      }

      showSuccess(message) {
        this.toastr.successToastr( message , 'Success!', this.options);
      }
    
      showError(message) {
        this.toastr.errorToastr(message, 'Oops!', this.options);
      }
    
      showWarning(message) {
        this.toastr.warningToastr(message, 'Alert!', this.options);
      }
    
      showInfo(message) {
        this.toastr.infoToastr(message, 'Info!' , this.options);
      }
      
      showCustom() {
        this.toastr.customToastr('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
      }
}