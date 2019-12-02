import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { recipeService } from '../../services/recipe';
import { Recipe } from '../../modals/recipe';


@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit {
  mode = 'New';
  selectOption = ['Easy', 'Medium', 'Hard'];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
      private actionSheepControl: ActionSheetController,
    private alertCtrl: AlertController,
  private toastCtrl: ToastController,
private recipeService: recipeService) {}


  ngOnInit(){
this.mode = this.navParams.get('mode');
if(this.mode == 'Edit'){
  this.recipe = this.navParams.get('recipe');
  this.index = this.navParams.get('index');

}
this.initializeForm();
  }

  onManageIngredients(){
    const actionSheet = this.actionSheepControl.create({
      title: 'What do you want to do ?',
      buttons: [
        {
          text: 'Add Ingredients',
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: 'Remove all Ingredients',
          role: 'destructive',
          handler: () => {
            const fArray: FormArray = <FormArray>this.recipeForm.get('ingredients');
            const len = fArray.length;
            if(len >0){
              for(let i = len - 1; i>=0; i--){
                fArray.removeAt(i);
              }
              const toast = this.toastCtrl.create({
                message: 'All Ingredients were deleted!',
                duration: 2000,
                position: 'top'
              });
              toast.present();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private createNewIngredientAlert(){
    return this.alertCtrl.create({
      title: 'Add Ingredient',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if(data.name.trim() == '' || data.name  == null){
              const toast = this.toastCtrl.create({
                message: 'Please enter a valid value !',
                duration: 2000,
                position: 'top'
              });
              toast.present();
              return;
            }
           (<FormArray>this.recipeForm.get('ingredients'))
            .push(new FormControl(data.name, Validators.required));
            const toast = this.toastCtrl.create({
              message: 'Ingredient was successfully added !',
              duration: 2000,
              position: 'top'
            });
            toast.present();
          }
        }
      ]
    });
  }

  private initializeForm(){
    let title = null;
    let description = null;
    let difficulty = 'Medium';
    let ingredients = [];

    if(this.mode == 'Edit'){
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for(let ingredient of this.recipe.ingredients){
        ingredients.push(new FormControl(ingredient, Validators.required));
      }
    }
    this.recipeForm = new FormGroup({
      'title': new FormControl(title, Validators.required),
      'description': new FormControl(description, Validators.required),
      'difficulty': new FormControl(difficulty, Validators.required),
      'ingredients': new FormArray(ingredients)
    });
  }

  onSubmit(){
    const value = this.recipeForm.value;
    let ingredients = [];
    if(value.ingredients.length > 0){
      ingredients = value.ingredients.map(name => {
        return {name: name, amount: 1};
      });
    }
    if(this.mode == 'Edit'){
      this.recipeService.updateRecipe(this.index, value.title, value.description, value.difficulty, value.ingredients);
    } else {
      this.recipeService.addRecipe(value.title, value.description, value.difficulty, value.ingredients);
    }
      this.recipeForm.reset();
      this.navCtrl.popToRoot();
  }
}
