import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Recipe } from '../../modals/recipe';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { ShoppingListService } from '../../services/shopping-list';
import { recipeService } from '../../services/recipe';


@IonicPage()
@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit {
  recipe: Recipe;
  index: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     public slServive: ShoppingListService,
    public recipeService: recipeService) {
  }
  ngOnInit(){
    this.recipe = this.navParams.get('recipe');
    this.index = this.navParams.get('index');
  }
  
  onEditRecipe(){
    this.navCtrl.push(EditRecipePage, {mode: 'Edit', recipe: this.recipe, index: this.index});
  }

  onAddIngredients(){
    this.slServive.addItems(this.recipe.ingredients);
  }

  onDeleteRecipe(){
    this.recipeService.removeRecipe(this.index);
  }


}
