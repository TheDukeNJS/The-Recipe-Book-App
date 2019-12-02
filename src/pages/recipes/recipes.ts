import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, AlertController } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe } from '../../modals/recipe';
import { recipeService } from '../../services/recipe';
import { RecipePage } from '../recipe/recipe';
import { AuthService } from '../../services/auth';
import { DatabaseOptionsPage } from '../database-options/database-options';
import { Ingredient } from '../../modals/ingredient';


@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];
  listItems: Ingredient[];

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      public recipesService: recipeService,
      private loadingCtrl: LoadingController,
      private popoverCtrl: PopoverController,
      private alertCtrl: AlertController,
      private authService: AuthService ) {}

  ionViewWillEnter(){
    this.recipes = this.recipesService.getRecipes();
  }

  onNewRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'New'});
  }

  onLoadRecipe(recipe: Recipe, index:number){
    this.navCtrl.push(RecipePage, {recipe: recipe, index: index});
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
              this.recipesService.fetchList(token)
              .subscribe(
                (list: Recipe[]) => {
                  loading.dismiss();
                  if(list){
                    this.recipes = list;
                  } else {
                    this.recipes = [];
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
              this.recipesService.storeList(token)
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

}
