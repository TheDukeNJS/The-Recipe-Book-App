import { Component } from '@angular/core';
import { IonicPage, ToastController, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list';
import { Ingredient } from '../../modals/ingredient';
import { DatabaseOptionsPage } from '../database-options/database-options';
import { AuthService } from '../../services/auth';


@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  listItems: Ingredient [];

  constructor(private slService: ShoppingListService,
     private toastCtrl: ToastController,
     private popoverCtrl: PopoverController,
     private authService: AuthService,
     private loadingCtrl: LoadingController,
     private alertCtrl: AlertController){
  }

  ionViewWillEnter(){
    this.loadItems();
  }

  onShowOptions(event: MouseEvent){
    const loading = this.loadingCtrl.create({
      content: 'Please wait ... '
    });
    const popover = this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({
      ev: event

    });
    popover.onDidDismiss(
      data => {
        if(!data){
          return;
        }
        if(data.action == 'load'){
          loading.present();
          this.authService.getActiveUser().getIdToken()
          .then(
            (token: string) => {
              this.slService.fetchList(token)
              .subscribe(
                (list: Ingredient[]) => {
                  loading.dismiss();
                  if(list){
                    this.listItems = list;
                  } else {
                    this.listItems = [];
                  }
                },
                error => {
                  loading.dismiss();
                  this.handleError(error.message);
                   }
              );
            }
          );

        } else if (data.action == 'store') {
          loading.present();
          this.authService.getActiveUser().getIdToken()
          .then(
            (token: string) => {
              this.slService.storeList(token)
              .subscribe(
                () => loading.dismiss(),
                error => {
                  loading.dismiss();
                this.handleError(error.message);                   }
              );
            }
          );

        }
      }
    );

  }

  private handleError(errorMessage: string){
    const alert = this.alertCtrl.create({
      title: ' An error occured !',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();

  }

  onAddItem(form: NgForm) {
    this.slService.addItem(form.value.ingredientName, form.value.amount);
    const toast = this.toastCtrl.create({
      message: 'Item are successfull added!',
      duration: 2000,
      position: 'top'
    });
    toast.present();
    form.reset();
    this.loadItems();

  }

  onCheckItem(index: number){
    this.slService.removeItem(index);
    const toast = this.toastCtrl.create({
      message: 'Item are successfull removed!',
      duration: 2000,
      position: 'top'
    });
    toast.present();
    this.loadItems();
  }
  
  private loadItems() {
    return this.listItems = this.slService.getItems();  
  }

}
