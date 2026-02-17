import { Component, computed, inject, Input, PLATFORM_ID, Renderer2, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlowbiteService } from '../../../core/services/flowbite/flowbite.service';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/auth/services/authentication/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { STORED_KEYS } from '../../../core/constants/storedKeys';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface Language {
  code: string;        // ISO language code (e.g., 'en', 'es')
  name: string;        // English name
}


@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive,TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

 @Input({required:true}) isLogin!: boolean;

private readonly flowbiteService = inject(FlowbiteService)
private readonly authService  = inject(AuthService)
private readonly cartService  = inject(CartService)
private readonly wishlistService  = inject(WishlistService)
private readonly plat_id  = inject(PLATFORM_ID)



count:Signal<number> = computed(  ()=> this.cartService.cartCount()     )

countw:Signal<number> = computed(  ()=> this.wishlistService.wishlistCount()     )


  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });


if (isPlatformBrowser(this.plat_id)) {
  
const token = localStorage.getItem(STORED_KEYS.userToken);
if(token){
  this.getAllCartData();
      this.getAllWishlistData();
  
}
}
  }


  getAllWishlistData():void{
    this.wishlistService.getLoggedUserWishlist().subscribe({
      next: (res)=> {
        this.wishlistService.wishlistCount.set(res.data.length);


      }
    })
  }


getAllCartData():void{
  this.cartService.getLoggedUserCart().subscribe({
    next: (res)=> {
      this.cartService.cartCount.set(res.numOfCartItems)
    }
  })
}


signOut(): void{
this.authService.userLogOut();
}



private readonly translateService = inject(TranslateService)
private readonly renderer2 = inject(Renderer2)


isOpen = false;

  languages: Language[] = [
    { code: 'en', name: 'English'},
    { code: 'de', name: 'German' },
    { code: 'ar', name: 'Arabic'},
  ];

  selectedLanguage: Language = {code: this.translateService.getCurrentLang() , name: 'English'}

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  /**
   * @param language
   */
  selectLanguage(language: Language): void {
    this.selectedLanguage = language;
    this.closeDropdown();


    this.translateService.use(language.code);

this.renderer2.setAttribute(document.documentElement , 'lang' , language.code) ;

this.renderer2.setAttribute(
  document.documentElement,
  'dir',
  language.code === 'en' || language.code === 'de' ? 'ltr' : 'rtl'
);
    
  }













}
